import { Component, LOCALE_ID, computed, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { guideChaptersForLocale } from '../../../../../shared/guide-navigation';
import { resolveDocsLocale } from '../../../../../shared/docs-locales';
import { SeoService } from './seo.service';
import { docsBreadcrumbStructuredData } from './seo-json-ld';
import { GUIDE_CONTENT } from '../generated/guide-content.generated';
import { GuideArticleComponent } from './guide-article';

@Component({
  selector: 'app-guide-page',
  imports: [GuideArticleComponent],
  template: `@if (guide(); as content) {
    <app-guide-article [guide]="content" [path]="path()" [kind]="chapter()?.kind ?? 'task'" />
  }`,
})
export class GuidePageComponent {
  readonly #locale = inject(LOCALE_ID);
  readonly #seo = inject(SeoService);
  readonly #data = toSignal(inject(ActivatedRoute).data);
  readonly #chapters = guideChaptersForLocale(this.#locale);
  protected readonly chapter = computed(() =>
    this.#chapters.find((chapter) => chapter.id === this.#data()?.['chapter']),
  );
  protected readonly path = computed(() => this.chapter()?.path ?? '/');
  protected readonly guide = computed(() => {
    const chapter = this.chapter();
    return chapter ? GUIDE_CONTENT[chapter.id]?.[resolveDocsLocale(this.#locale)] : undefined;
  });
  constructor() {
    effect(() => {
      const guide = this.guide();
      if (!guide) return;
      this.#seo.setPage({
        title: guide.title,
        description: guide.description,
        path: this.path(),
        structuredData: docsBreadcrumbStructuredData(this.#locale, [
          { name: 'WebView Native UI', path: '/' },
          { name: guide.title, path: this.path() },
        ]),
      });
    });
  }
}
