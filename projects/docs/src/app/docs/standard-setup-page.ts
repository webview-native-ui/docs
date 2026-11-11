import { guideChaptersForLocale, guideCopyForLocale } from '../../../../../shared/guide-navigation';
import { Component, LOCALE_ID, OnInit, inject } from '@angular/core';
import { STANDARD_SETUP } from '../generated/standard-setup.generated';
import { resolveDocsLocale } from '../../../../../shared/docs-locales';
import { STANDARD_SETUP_PATH } from '../../../../../shared/standard-setup';
import { HeadingLinksDirective } from '../../../../../shared/heading-links';
import { SafeHtmlPipe } from './safe-html.pipe';
import { localizedPublicPath } from '../locale-path';
import { SeoService } from './seo.service';
import { docsBreadcrumbStructuredData } from './seo-json-ld';

@Component({
  selector: 'app-standard-setup-page',
  imports: [SafeHtmlPipe, HeadingLinksDirective],
  template: `
    <article class="docs-page-article znc mx-auto max-w-4xl px-6 py-10">
      <h1>{{ guide.title }}</h1>
      <div appHeadingLinks [innerHTML]="guide.html | safeHtml"></div>
      <nav class="mt-10 border-t border-slate-200 pt-6" [attr.aria-label]="copy.next">
        <h2>{{ copy.next }}</h2>
        <ul>@for (chapter of chapters; track chapter.id) {
          <li><a [href]="href(chapter.path)">{{ chapter.title }}</a></li>
        }</ul>
      </nav>
      <p class="mt-10 text-sm"><a [href]="guide.editUrl">GitHub ↗</a></p>
    </article>
  `,
})
export class StandardSetupPageComponent implements OnInit {
  readonly #locale = inject(LOCALE_ID);
  readonly #seo = inject(SeoService);
  protected readonly chapters = guideChaptersForLocale(this.#locale);
  protected readonly copy = guideCopyForLocale(this.#locale);
  protected href(path: string): string { return localizedPublicPath(this.#locale, path); }
  protected readonly guide = STANDARD_SETUP[resolveDocsLocale(this.#locale)];

  ngOnInit(): void {
    this.#seo.setPage({
      title: this.guide.title,
      description: this.guide.description,
      path: STANDARD_SETUP_PATH,
      structuredData: docsBreadcrumbStructuredData(this.#locale, [
        { name: 'WebView Native UI', path: '/' },
        { name: this.guide.title, path: STANDARD_SETUP_PATH },
      ]),
    });
  }
}
