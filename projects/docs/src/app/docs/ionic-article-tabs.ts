import { Component, input, linkedSignal } from '@angular/core';

export interface ArticleTabs {
  kind: 'tabs';
  panels: { label: string; html: string }[];
}

@Component({
  selector: 'app-ionic-article-tabs',
  template: `
    <div class="choices">
      @for (panel of group().panels; track panel.label) {
        <button type="button" [attr.aria-pressed]="active() === panel" (click)="active.set(panel)">{{ panel.label }}</button>
      }
    </div>
    <div class="code" [innerHTML]="active().html"></div>
  `,
  styles: `
    :host {display:block;overflow:hidden;margin:1rem 0 2rem;border-radius:.75rem;background:#f5f7fb}
    .choices {display:flex;flex-wrap:wrap;padding:.375rem;gap:.25rem;background:#e9edf4}
    button {border:0;border-radius:.5rem;background:transparent;color:#46556b;font:600 .875rem/1.5 system-ui;padding:.45rem .9rem;cursor:pointer}
    button[aria-pressed=true] {background:white;color:#175bb3}
    :host ::ng-deep .code pre {background:transparent;color:#203047;margin:0;padding:clamp(1rem,3vw,2rem);overflow:auto;border:0}
    :host ::ng-deep .code pre code {background:transparent;color:inherit;font:400 .875rem/1.65 ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre}
  `,
})
export class IonicArticleTabs {
  readonly group = input.required<ArticleTabs>();
  readonly active = linkedSignal(() => this.group().panels[0]);
}
