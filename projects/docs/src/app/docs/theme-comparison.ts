import { Component, LOCALE_ID, computed, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { resolveDocsLocale } from '../../../../../shared/docs-locales';
import { guideCopyForLocale } from '../../../../../shared/guide-navigation';

@Component({
  selector: 'app-theme-comparison',
  template: `
    <section class="comparison" aria-labelledby="theme-preview-title">
      <header>
        <h2 id="theme-preview-title">{{ copy.compareTitle }}</h2>
        <div class="mode-picker" role="group" [attr.aria-label]="copy.previewMode">
          <button type="button" [attr.aria-pressed]="mode() === 'ios'" (click)="mode.set('ios')">iOS</button>
          <button type="button" [attr.aria-pressed]="mode() === 'md'" (click)="mode.set('md')">Android</button>
        </div>
      </header>
      <p class="comparison-instructions">{{ copy.compareDescription }}</p>
      <p class="comparison-swipe">{{ copy.compareSwipe }}</p>
      <div class="comparison-frames">
        <figure>
          <figcaption>{{ copy.baselineLabel }} <span>{{ mode() }}</span></figcaption>
          <iframe [src]="baselineSrc()" [title]="copy.baselineLabel + ' — ' + mode()" sandbox="allow-scripts allow-same-origin" loading="lazy"></iframe>
        </figure>
        <figure>
          <figcaption>{{ mode() === 'ios' ? 'iOS 27' : 'Material Design 3' }}</figcaption>
          <iframe [src]="themedSrc()" [title]="mode() === 'ios' ? 'iOS 27' : 'Material Design 3'" sandbox="allow-scripts allow-same-origin" loading="lazy"></iframe>
        </figure>
      </div>
      <p class="comparison-scope">{{ copy.previewScope }}</p>
    </section>
  `,
  styleUrl: './theme-comparison.css',
})
export class ThemeComparisonComponent {
  readonly #locale = resolveDocsLocale(inject(LOCALE_ID));
  readonly #sanitizer = inject(DomSanitizer);
  protected readonly copy = guideCopyForLocale(this.#locale);
  protected readonly mode = signal<'ios' | 'md'>('ios');
  // Only fixed local assets, an allowlisted mode and the supported locale enter these URLs.
  protected readonly baselineSrc = computed(() => this.#previewUrl(false));
  protected readonly themedSrc = computed(() => this.#previewUrl(true));
  #previewUrl(themed: boolean) {
    return this.#sanitizer.bypassSecurityTrustResourceUrl(`/previews/theme/index.html?mode=${this.mode()}&theme=${themed ? 'on' : 'off'}&lang=${this.#locale}`);
  }
}
