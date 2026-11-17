import { guideChaptersForLocale, guideCopyForLocale } from '../../../../../shared/guide-navigation';
import { Component, LOCALE_ID, OnInit, inject, signal } from '@angular/core';
import { STANDARD_SETUP } from '../generated/standard-setup.generated';
import { resolveDocsLocale } from '../../../../../shared/docs-locales';
import { STANDARD_SETUP_PATH } from '../../../../../shared/standard-setup';
import { HeadingLinksDirective } from '../../../../../shared/heading-links';
import { SafeHtmlPipe } from './safe-html.pipe';
import { localizedPublicPath, localizedFragmentPath } from '../locale-path';
import { SeoService } from './seo.service';
import { docsBreadcrumbStructuredData } from './seo-json-ld';
import { ScrollSpyDirective } from './scroll-spy.directive';

@Component({
  selector: 'app-standard-setup-page',
  imports: [SafeHtmlPipe, HeadingLinksDirective, ScrollSpyDirective],
  styleUrl: './standard-setup-page.css',
  template: `
    <header class="setup-header">
      <h1>{{ guide.title }}</h1>
      <p>{{ guide.description }}</p>
    </header>
    <div class="setup-layout">
      <nav class="setup-toc" [attr.aria-label]="contentsLabel" data-pagefind-ignore>
        <p>{{ contentsLabel }}</p>
        <ol>
          @for (heading of guide.headings; track heading.id) {
            <li>
              <a
                [href]="headingHref(heading.id)"
                [attr.aria-current]="activeHeading() === heading.id ? 'location' : null"
                >{{ heading.text }}</a
              >
            </li>
          }
        </ol>
      </nav>
      <article
        class="docs-page-article znc min-w-0"
        [appScrollSpy]="headingIds"
        (activeHeadingChange)="activeHeading.set($event)"
      >
        <div appHeadingLinks [innerHTML]="guide.html | safeHtml"></div>
        <nav class="setup-next" [attr.aria-label]="copy.next">
          <h2>{{ copy.next }}</h2>
          <ul>
            @for (chapter of chapters; track chapter.id) {
              <li>
                <a [href]="href(chapter.path)">{{ chapter.title }}</a>
              </li>
            }
          </ul>
        </nav>
        <p class="mt-10 text-sm"><a [href]="guide.editUrl">GitHub ↗</a></p>
      </article>
    </div>
  `,
})
export class StandardSetupPageComponent implements OnInit {
  readonly #locale = inject(LOCALE_ID);
  readonly #seo = inject(SeoService);
  protected readonly chapters = guideChaptersForLocale(this.#locale);
  protected readonly copy = guideCopyForLocale(this.#locale);
  protected href(path: string): string {
    return localizedPublicPath(this.#locale, path);
  }
  protected readonly guide = STANDARD_SETUP[resolveDocsLocale(this.#locale)];

  protected readonly contentsLabel = $localize`:@@onThisPage:On this page`;
  protected readonly headingIds = this.guide.headings.map((heading) => heading.id);
  protected readonly activeHeading = signal('');
  protected headingHref(id: string): string {
    return localizedFragmentPath(this.#locale, STANDARD_SETUP_PATH, id);
  }

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
