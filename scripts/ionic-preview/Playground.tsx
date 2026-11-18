import React from 'react';

// MDX imports are executable components. Render each file during the upstream
// static build so every framework's code survives without a React runtime.
export default function Playground({ code, src, mode, showConsole, title }) {
  return (
    <section
      data-ionic-demo={src}
      data-mode={mode}
      data-console={showConsole || undefined}
      data-title={title}
    >
      {Object.entries(code).map(([framework, example]: [string, any]) => (
        <div key={framework} data-framework={framework}>
          {Object.entries(example.files ?? { '': example }).map(
            ([filename, Content]: [string, any]) => (
              <div key={filename} data-filename={filename}>
                <Content />
              </div>
            ),
          )}
        </div>
      ))}
    </section>
  );
}
