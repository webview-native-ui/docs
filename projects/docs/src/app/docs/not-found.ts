import { Component, LOCALE_ID, OnInit, inject } from '@angular/core';
import { canonicalHomePath } from '../locale-path';
import { SeoService } from './seo.service';

@Component({
  selector: 'app-not-found',
  template: `
    <section data-pagefind-ignore class="mx-auto max-w-3xl px-6 py-24 text-center sm:py-32">
      <p class="m-0 text-sm font-semibold tracking-[0.18em] text-[#1767d2] uppercase">404</p>
      <h1 class="mt-5 mb-0 text-4xl font-semibold tracking-[-0.04em] text-[#172033] sm:text-6xl">
        <ng-container i18n="@@notFoundHeading">Page not found</ng-container>
      </h1>
      <p class="mx-auto mt-6 max-w-xl text-lg leading-8 text-[#64748b]">
        <ng-container i18n="@@notFoundDescription"
          >The page may have moved while the documentation was being reorganized.</ng-container
        >
      </p>
      <a
        [href]="canonicalHomePath"
        class="mt-8 inline-flex rounded-full bg-[#1767d2] px-6 py-3 text-sm font-semibold text-white no-underline transition hover:bg-[#0b4da9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1767d2]"
      >
        <ng-container i18n="@@backToProjects">Back to documentation</ng-container>
      </a>
    </section>
  `,
})
export class NotFoundComponent implements OnInit {
  readonly #seo = inject(SeoService);
  protected readonly canonicalHomePath = canonicalHomePath(inject(LOCALE_ID));

  ngOnInit(): void {
    this.#seo.setPage({
      title: $localize`:@@notFoundTitle:Page not found - WebView Native UI`,
      description: $localize`:@@notFoundDescription:The page may have moved while the documentation was being reorganized.`,
      path: '/not-found',
      noIndex: true,
    });
  }
}
