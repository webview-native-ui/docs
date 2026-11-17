import { GuideArticleComponent } from './guide-article';
import { Component, LOCALE_ID, OnInit, inject } from '@angular/core';
import { STANDARD_SETUP } from '../generated/standard-setup.generated';
import { resolveDocsLocale } from '../../../../../shared/docs-locales';
import { STANDARD_SETUP_PATH } from '../../../../../shared/standard-setup';
import { SeoService } from './seo.service';
import { docsBreadcrumbStructuredData } from './seo-json-ld';

@Component({
  selector: 'app-standard-setup-page',
  imports: [GuideArticleComponent],
  template: `<app-guide-article [guide]="guide" [path]="path" kind="setup" />`,
})
export class StandardSetupPageComponent implements OnInit {
  readonly #locale = inject(LOCALE_ID);
  readonly #seo = inject(SeoService);
  protected readonly guide = STANDARD_SETUP[resolveDocsLocale(this.#locale)];

  protected readonly path = STANDARD_SETUP_PATH;

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
