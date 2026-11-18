import { Component, computed, ElementRef, inject, input, linkedSignal, signal, viewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

export interface IonicDemo {
  kind: 'demo';
  src: string;
  mode: string;
  console: boolean;
  examples: { name: string; files: { name: string; html: string }[] }[];
}
@Component({
  selector: 'app-ionic-component-demo',
  host: { '(window:message)': 'receive($event)' },
  template: `
    <section class="example">
      <div class="toolbar">
      <div class="controls" aria-label="Example language">
        @for (ex of demo().examples; track ex.name) {
          <button type="button" [attr.aria-pressed]="example() === ex" (click)="example.set(ex)">{{ names[ex.name] || ex.name }}</button>
        }
      </div>
      <div class="controls" aria-label="Theme">
        @for (t of themes; track t.key) {
          <button type="button" [disabled]="demo().mode && demo().mode !== t.mode"
            [attr.aria-pressed]="theme() === t.key" (click)="choose(t.key)">{{ t.label }}</button>
        }
      </div>
      </div>
      <iframe #frame [src]="url()" title="Component demo" loading="lazy"></iframe>
      @if (demo().console) { <output>{{ log() }}</output> }
    </section>
    <div class="code">
      @if (example().files.length > 1) {
        <div class="files" role="group" aria-label="Source file">
          @for (f of example().files; track f.name) {
            <button type="button" [attr.aria-pressed]="file() === f" [title]="f.name" (click)="file.set(f)">
              <span class="ext" aria-hidden="true">{{ f.name.split('.').pop() }}</span><span class="full-path">{{ f.name }}</span><span class="short-path">{{ f.name.split('/').pop() }}</span>
            </button>
          }
        </div>
      }
      <pre tabindex="0"><code [innerHTML]="file().html"></code></pre>
    </div>
  `,
  styles: `
    :host { display:block;margin:1.5rem 0 2.5rem;color:#172033 }
    .example,.code{overflow:hidden;border:1px solid #dbe3ed;border-radius:.75rem}
    .code{margin-top:.75rem;background:#f6f8fb}
    .controls{display:flex;gap:.15rem;flex-wrap:wrap;padding:.4rem .55rem;background:white;border-bottom:1px solid #e2e8f0}
    button{background:transparent;border:0;border-radius:2rem;padding:.5rem .8rem;color:#475569;font:600 .875rem/1.5 system-ui;cursor:pointer}
    button[aria-pressed=true]{background:#e6efff;color:#1459b8}button:disabled{opacity:.45}
    iframe{width:100%;height:clamp(18rem,49vh,27rem);display:block;border:0}
    .toolbar{display:flex;flex-wrap:wrap;align-items:center;border-bottom:1px solid #dbe3ed}
    .toolbar .controls{border:0}
    .toolbar .controls + .controls{border-inline-start:1px solid #dbe3ed}
    .code{background:#f5f7fb;border:0}
    .files{background:#e9edf4;display:flex;overflow-x:auto}
    .files button{display:flex;align-items:center;gap:.55rem;flex:none;white-space:nowrap;border-radius:0;color:#46556b;padding:.75rem 1rem;font-size:.8rem;font-weight:500}
    .files button[aria-pressed=true]{background:#f5f7fb;color:#172943;box-shadow:inset 0 2px #2866bf}
    .short-path{display:none}
    @media(max-width:600px){.files .full-path,.files .ext{display:none}.files .short-path{display:inline}.files button{padding:.75rem .65rem}}
    .ext{font:700 .7rem/1 monospace;color:#225bb0;text-transform:uppercase}
    .code pre{background:transparent;color:#203047;margin:0;padding:clamp(1rem,3vw,2rem);overflow:auto;border:0;border-radius:0}
    .code pre code{font:400 .875rem/1.65 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:transparent;color:inherit;padding:0;white-space:pre}
    output{display:block;padding:.65rem 1rem;font:.8rem/1.5 monospace;color:#475569}
    output:empty{display:none}
    @media(max-width:600px){.toolbar .controls{width:100%}.toolbar .controls + .controls{border-inline-start:0;border-top:1px solid #edf0f4}}

  `,
})
export class IonicComponentDemo {
  readonly demo = input.required<IonicDemo>();
  readonly themes = [{key:'ios27',mode:'ios',label:'iOS 27'},{key:'ios26',mode:'ios',label:'iOS 26'},{key:'md',mode:'md',label:'MD3'}];
  readonly names: Record<string,string> = {angular:'Angular',javascript:'JavaScript',react:'React',vue:'Vue'};
  readonly theme = linkedSignal<string>(() => this.demo().mode === 'md' ? 'md' : 'ios27');
  readonly example = linkedSignal(() => this.demo().examples.find(e => e.name === 'angular') ?? this.demo().examples[0]);
  readonly file = linkedSignal(() => this.example().files[0]);
  readonly log = signal('');
  readonly frame = viewChild<ElementRef<HTMLIFrameElement>>('frame');
  readonly #sanitizer = inject(DomSanitizer);
  readonly url = computed(() => this.#sanitizer.bypassSecurityTrustResourceUrl(
    '/assets/ionic-components/'+this.demo().src+'?ionic:mode='+(this.theme()==='md'?'md':'ios')+'&theme='+this.theme()));
  choose(theme: string) { this.log.set(''); this.theme.set(theme); }
  receive(event: MessageEvent) {
    if (this.demo().console && event.source === this.frame()?.nativeElement.contentWindow && event.origin === location.origin && typeof event.data?.ionicDemoLog === 'string') this.log.set(event.data.ionicDemoLog);
  }
}
