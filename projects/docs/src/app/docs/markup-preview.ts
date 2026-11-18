import { Component, computed, inject, input, linkedSignal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-markup-preview',
  template: `
    <div class="preview">
      <div class="themes" role="group" [attr.aria-label]="label()">
        @for (platform of platforms; track platform.id) {
          <button type="button" [attr.aria-pressed]="selected() === platform" (click)="selected.set(platform)">
            {{ platform.name }}
          </button>
        }
      </div>
      <iframe [src]="url()" [title]="label() + ' · ' + selected().name" loading="lazy"></iframe>
    </div>
  `,
  styles: `
    .preview { margin-block: 1rem; overflow: hidden; border: 1px solid #dbe3ed; border-radius: .75rem; }
    .themes { display: flex; gap: .25rem; padding: .375rem .625rem; border-bottom: 1px solid #dbe3ed; }
    button { padding: .5rem .9rem; border-radius: 2rem; color: #334155; cursor: pointer; font: 600 .875rem/1.5 system-ui, sans-serif; }
    button[aria-pressed='true'] { background: #e6efff; color: #1459b8; }
    iframe { display: block; width: 100%; height: 10rem; border: 0; }
  `,
})
export class MarkupPreview {
  readonly example = input.required<number>();
  readonly defaultMd = input(false);
  readonly label = input.required<string>();
  protected readonly platforms = [{ id: 'ios', name: 'iOS 27' }, { id: 'ios26', name: 'iOS 26' }, { id: 'md', name: 'MD3' }] as const;
  protected readonly selected = linkedSignal<(typeof this.platforms)[number]>(() => this.defaultMd() ? this.platforms.find(p => p.id === 'md')! : this.platforms[0]);
  readonly #sanitizer = inject(DomSanitizer);
  protected readonly url = computed(() => this.#sanitizer.bypassSecurityTrustResourceUrl(
    `/assets/theme-preview/markup-${this.example()}-${this.selected().id}.html`,
  ));
}
