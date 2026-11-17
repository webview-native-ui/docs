export interface DocumentedCodeBlock {
  readonly info: string;
  readonly language: string;
  readonly filename?: string;
  readonly variant?: string;
  readonly section: string;
  readonly subsection: string;
  readonly code: string;
}

/** Preserve code whitespace: context and removed lines must match the starting file. */
export function documentedCodeBlocks(markdown: string): DocumentedCodeBlock[] {
  let openingLine: number | undefined;
  for (const [index, line] of markdown.split('\n').entries()) {
    const fence = line.match(/^```([^`]*)$/);
    if (!fence) continue;
    if (openingLine === undefined) {
      if (!fence[1].trim())
        throw new Error(`Code fence closes without an opening at line ${index + 1}`);
      openingLine = index + 1;
    } else {
      if (fence[1].trim())
        throw new Error(
          `Code fence opened at line ${openingLine} is not closed before line ${index + 1}`,
        );
      openingLine = undefined;
    }
  }
  if (openingLine !== undefined)
    throw new Error(`Code fence opened at line ${openingLine} is not closed`);
  return [...markdown.matchAll(/^```([^\n`]+)\n([\s\S]*?)\n```/gm)].map((match) => {
    const info = match[1];
    const [language, ...name] = info.split(':');
    const caption = name.join(':');
    const variant = caption.match(/ \(([^)]+)\)$/)?.[1];
    const filename = caption.replace(/ \([^)]+\)$/, '') || undefined;
    const before = markdown.slice(0, match.index);
    const section = [...before.matchAll(/^## (.+)$/gm)].at(-1);
    const inSection = before.slice(section?.index ?? 0);
    return {
      info,
      language,
      filename,
      variant,
      section: section?.[1] ?? '',
      subsection: [...inSection.matchAll(/^### (.+)$/gm)].at(-1)?.[1] ?? '',
      code: match[2],
    };
  });
}

function fileLines(source: string): string[] {
  if (!source) return [];
  const lines = source.replaceAll('\r\n', '\n').split('\n');
  if (lines.at(-1) === '') lines.pop();
  return lines;
}

/** Apply the documented hunks, checking context, deletions and insertion position. */
export function applyDocumentedDiff(before: string, patch: string, context = 'example'): string {
  const hunks: string[][] = [[]];
  for (const line of patch.replaceAll('\r\n', '\n').split('\n')) {
    if (/^(?:---|\+\+\+) [ab]\//.test(line)) continue;
    if (line.startsWith('@@')) {
      if (hunks.at(-1)!.length) hunks.push([]);
      continue;
    }
    if (line === '\\ No newline at end of file') continue;
    if (line && !/^[ +-]/.test(line))
      throw new Error(`${context}: a diff line needs a context, + or - prefix: ${line}`);
    if (/^[+-]/.test(line) && line[1] !== ' ')
      throw new Error(`${context}: + and - markers require one separator space: ${line}`);
    hunks.at(-1)!.push(line || ' ');
  }
  const lines = fileLines(before);
  let nextSearch = 0;
  for (const hunk of hunks.filter((part) => part.length)) {
    const old = hunk
      .filter((line) => !line.startsWith('+'))
      .map((line) => line.slice(/^[+-]/.test(line) ? 2 : 1));
    const next = hunk
      .filter((line) => !line.startsWith('-'))
      .map((line) => line.slice(/^[+-]/.test(line) ? 2 : 1));
    if (!old.length) {
      if (lines.length) throw new Error(`${context}: additions to an existing file need context`);
      lines.push(...next);
      nextSearch = lines.length;
      continue;
    }
    const matches: number[] = [];
    for (let index = nextSearch; index + old.length <= lines.length; index++)
      if (old.every((line, offset) => lines[index + offset] === line)) matches.push(index);
    if (matches.length !== 1)
      throw new Error(
        `${context}: expected one matching before/context block, found ${matches.length}`,
      );
    const index = matches[0];
    lines.splice(index, old.length, ...next);
    nextSearch = index + next.length;
  }
  return lines.length ? lines.join('\n') + '\n' : '';
}

/** Input is a display diff, not a raw unified patch. Repair missing separators only.
 * Never infer a unified-diff format from leading code whitespace.
 */
export function repairDisplayDiffSpacing(markdown: string): string {
  return markdown.replace(
    /^(```diff[^\n]*\n)([\s\S]*?)(\n```)/gm,
    (_block, opening, code, closing) =>
      opening +
      code.replace(/^([+-])(?=[^ \n]|$)/gm, (marker: string, _prefix: string, offset: number) => {
        const line = code.slice(offset).split('\n', 1)[0];
        return /^(?:---|\+\+\+) /.test(line) ? marker : marker + ' ';
      }) +
      closing,
  );
}
