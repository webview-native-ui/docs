import { Component, LOCALE_ID, computed, inject, input, signal } from '@angular/core';
import { HeadingLinksDirective } from '../../../../../shared/heading-links';
import { SafeHtmlPipe } from './safe-html.pipe';
import { ScrollSpyDirective } from './scroll-spy.directive';
import { localizedFragmentPath } from '../locale-path';
import { guideCopyForLocale } from '../../../../../shared/guide-navigation';

export interface GuideContent {
  readonly title: string;
  readonly description: string;
  readonly html: string;
  readonly headings: readonly { readonly id: string; readonly text: string }[];
  readonly editUrl: string;
}

@Component({
  selector: 'app-guide-article',
  imports: [SafeHtmlPipe, HeadingLinksDirective, ScrollSpyDirective],
  styleUrl: './guide-article.css',
  template: `
    <div class="setup-layout">
      <header class="setup-header">
        <p class="guide-kind">{{ kindLabel() }}</p>
        <h1>{{ guide().title }}</h1>
        <p>{{ guide().description }}</p>
      </header>
      <nav class="setup-toc" [attr.aria-label]="contentsLabel" data-pagefind-ignore>
        <p>{{ contentsLabel }}</p>
        <ol>
          @for (heading of guide().headings; track heading.id) {
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
        [appScrollSpy]="headingIds()"
        (activeHeadingChange)="activeHeading.set($event)"
      >
        <div appHeadingLinks [innerHTML]="guide().html | safeHtml"></div>
        <p class="mt-10 text-sm">
          <a [href]="guide().editUrl" i18n="@@editOnGitHub">Edit this page on GitHub</a>
        </p>
      </article>
    </div>
  `,
})
export class GuideArticleComponent {
  readonly #locale = inject(LOCALE_ID);
  readonly guide = input.required<GuideContent>();
  readonly path = input.required<string>();
  readonly kind = input.required<'setup' | 'task' | 'migration'>();
  readonly #copy = guideCopyForLocale(this.#locale);
  protected readonly kindLabel = computed(() =>
    this.kind() === 'setup'
      ? this.#copy.setupGroup
      : this.kind() === 'migration'
        ? this.#copy.migrationGroup
        : this.#copy.guideTitle,
  );
  protected readonly contentsLabel = $localize`:@@onThisPage:On this page`;
  protected readonly headingIds = computed(() =>
    this.guide().headings.map((heading) => heading.id),
  );
  protected readonly activeHeading = signal('');
  protected headingHref(id: string): string {
    return localizedFragmentPath(this.#locale, this.path(), id);
  }
}
