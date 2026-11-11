import { Component, LOCALE_ID, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { guideChaptersForLocale, guideCopyForLocale } from '../../../../../shared/guide-navigation';
import { STANDARD_SETUP_LABELS } from '../../../../../shared/standard-setup';
import { resolveDocsLocale } from '../../../../../shared/docs-locales';
import { localizedPublicPath } from '../locale-path';
import { SeoService } from './seo.service';
import { docsBreadcrumbStructuredData } from './seo-json-ld';
import { effect } from '@angular/core';

@Component({
  selector: 'app-guide-page',
  template: `
    @if (chapter(); as currentChapter) {
      <article class="docs-page-article znc mx-auto max-w-4xl px-6 py-10">
        <p><a [href]="href('/')">{{ copy.overview }}</a> / {{ copy.guide }}</p>
        <h1>{{ currentChapter.title }}</h1>
        <p>{{ currentChapter.description }}</p>
        @for (paragraph of currentChapter.paragraphs; track paragraph) { <p>{{ paragraph }}</p> }
        <p><a [href]="href('/standard-setup')">{{ setupLabel }} →</a></p>
        @for (section of currentChapter.sections; track section.title) {
          <section><h2>{{ section.title }}</h2><p>{{ section.body }}</p></section>
        }
        @if (currentChapter.id === 'native-ui') {
          <h2>{{ copy.routes }}</h2>
          <table>
            <tbody>
              @for (entry of integrations; track entry.path) {
                <tr><th scope="row">{{ entry.label }}</th><td><a [href]="href(entry.path)">{{ entry.description }}</a></td></tr>
              }
            </tbody>
          </table>
        }
        <h2>{{ copy.next }}</h2>
        <ul>
          @for (link of currentChapter.links; track link.path) {
            <li><a [href]="href(link.path)">{{ link.label }}</a></li>
          }
        </ul>
        <nav class="mt-10 flex flex-wrap justify-between gap-4 border-t border-slate-200 pt-6" [attr.aria-label]="copy.guide">
          <a [href]="href(previous().path)">← {{ previous().title }}</a>
          <a [href]="href(next().path)">{{ next().title }} →</a>
        </nav>
      </article>
    }
  `,
})
export class GuidePageComponent {
  readonly #locale = inject(LOCALE_ID);
  readonly #seo = inject(SeoService);
  readonly #data = toSignal(inject(ActivatedRoute).data);
  protected readonly chapters = guideChaptersForLocale(this.#locale);
  protected readonly copy = guideCopyForLocale(this.#locale);
  protected readonly setupLabel = STANDARD_SETUP_LABELS[resolveDocsLocale(this.#locale)];
  protected readonly index = computed(() => this.chapters.findIndex(chapter => chapter.id === this.#data()?.['chapter']));
  protected readonly chapter = computed(() => this.chapters[this.index()]);
  protected readonly previous = computed(() => this.chapters[this.index() - 1] ?? {path: '/standard-setup', title: this.setupLabel});
  protected readonly next = computed(() => this.chapters[this.index() + 1] ?? {path: '/#packages', title: this.copy.reference});
  protected readonly integrations = [
    { label: {en: 'Ionic setup', ja: 'Ionicでの導入', fr: 'Installation Ionic', de: 'Ionic-Einrichtung'}[resolveDocsLocale(this.#locale)], path: '/projects/capacitor-native-ui/docs/setup', description: {en: 'Use the iOS 27 theme', ja: 'iOS 27テーマを使う', fr: 'Utiliser le thème iOS 27', de: 'Das iOS-27-Theme verwenden'}[resolveDocsLocale(this.#locale)] },
    { label: {en: 'Existing-theme setup', ja: '既存テーマでの導入', fr: 'Installation avec un thème existant', de: 'Einrichtung mit bestehendem Theme'}[resolveDocsLocale(this.#locale)], path: '/projects/capacitor-native-ui/docs/ionic-vertical-bars', description: {en: 'Keep an existing Web theme', ja: '既存のWebテーマを使う', fr: 'Conserver un thème Web existant', de: 'Ein bestehendes Web-Theme behalten'}[resolveDocsLocale(this.#locale)] },
    { label: {en: 'HTML setup', ja: 'HTMLでの導入', fr: 'Installation HTML', de: 'HTML-Einrichtung'}[resolveDocsLocale(this.#locale)], path: '/projects/capacitor-native-ui/docs/framework-independent', description: {en: 'Use HTML without Ionic', ja: 'Ionicを使わずHTMLで導入する', fr: 'Utiliser HTML sans Ionic', de: 'HTML ohne Ionic verwenden'}[resolveDocsLocale(this.#locale)] },
  ];
  constructor() {
    effect(() => {
      const chapter = this.chapter();
      if (!chapter) return;
      this.#seo.setPage({title: chapter.title, description: chapter.description, path: chapter.path,
        structuredData: docsBreadcrumbStructuredData(this.#locale, [
          {name: 'WebView Native UI', path: '/'}, {name: chapter.title, path: chapter.path},
        ])});
    });
  }
  protected href(path: string): string { return localizedPublicPath(this.#locale, path); }
}
