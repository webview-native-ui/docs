import { guideChaptersForLocale, guideCopyForLocale } from '../../../../../shared/guide-navigation';
import { STANDARD_SETUP_LABELS, STANDARD_SETUP_PATH } from '../../../../../shared/standard-setup';
import { resolveDocsLocale } from '../../../../../shared/docs-locales';
import { Component, LOCALE_ID, OnInit, inject } from '@angular/core';
import { projectGroupsForLocale, type ProjectSummary } from './docs-data';
import { localizedPublicPath } from '../locale-path';
import { ProjectIconComponent } from './project-icon';
import { docsHomeStructuredData } from './seo-json-ld';
import { SeoService } from './seo.service';

@Component({
  selector: 'app-project-index',
  imports: [ProjectIconComponent],
  template: `
    <div class="catalog">
      <header class="catalog-hero">
        <div class="hero-introduction">
          <p class="eyebrow" i18n="@@openSourceDocumentation">Open source documentation</p>
          <h1>{{ copy.title }}</h1>
          <p class="catalog-hero__lead">{{ copy.heroDefinition }}</p>
          <p class="hero-audience">{{ copy.heroAudience }}</p>
          <p class="guide-actions"><a class="guide-start" [href]="standardSetupHref">{{ standardSetupLabel }} →</a><a href="#theme-demos">{{ copy.previewTitle }} ↓</a></p>
          <p class="hero-setup-note">{{ copy.standardAudience }}</p>
        </div>
        <figure class="app-showcase">
          <div class="showcase-screens">
            <img class="showcase-library" src="/assets/showcase/library.jpg" width="390" height="844" [alt]="copy.showcaseLibrary" fetchpriority="high" />
            <img class="showcase-player" src="/assets/showcase/now-playing.jpg" width="390" height="844" [alt]="copy.showcasePlayer" />
          </div>
          <figcaption><span id="theme-preview-title">{{ copy.showcaseCaption }}</span><a [href]="iosDemoUrl" target="_blank" rel="noopener noreferrer">{{ copy.showcaseExplore }} ↗</a></figcaption>
        </figure>
      </header>

      <section class="experience-explanation" aria-labelledby="how-it-fits">
        <header><p class="eyebrow">01</p><h2 id="how-it-fits">{{ copy.howTitle }}</h2></header>
        <div>
          <p>{{ copy.intro }}</p>
          <p>{{ copy.approach }}</p>
          <div class="platform-outcomes">
            <section><h3>{{ copy.iosBenefit }}</h3><p>{{ copy.iosDetail }}</p></section>
            <section><h3>{{ copy.androidBenefit }}</h3><p>{{ copy.androidDetail }}</p></section>
          </div>
        </div>
      </section>
      <section class="setup-section" aria-labelledby="standard-entry">
        <header><p class="eyebrow">02</p><h2 id="standard-entry">{{ copy.start }}</h2></header>
        <div>
          <p>{{ copy.startDescription }}</p>
          <p><a class="guide-start" [href]="standardSetupHref">{{ standardSetupLabel }} →</a></p>
          <nav class="setup-alternatives" [attr.aria-label]="copy.otherSetups">
            <span>{{ copy.otherSetups }}</span>
            <a [href]="guideHref('/guides/appearance')">{{ copy.themeOnly }}</a>
            <a [href]="guideHref('/projects/capacitor-native-ui/docs/framework-independent')">{{ copy.htmlSetup }}</a>
            <a [href]="guideHref('/projects/cordova-native-ui/docs/readme')">{{ copy.cordovaSetup }}</a>
          </nav>
          <nav id="theme-demos" class="theme-preview" [attr.aria-label]="copy.previewTitle">
            <a [href]="iosDemoUrl" target="_blank" rel="noopener noreferrer">{{ copy.tryIos }} ↗</a>
            <a [href]="androidDemoUrl" target="_blank" rel="noopener noreferrer">{{ copy.tryAndroid }} ↗</a>
          </nav>
        </div>
      </section>
      <header class="chapter-heading"><p class="eyebrow">03</p><h2>{{ copy.guideTitle }}</h2></header>
      <section class="guide-chapters" [attr.aria-label]="copy.guide">
        @for (chapter of chapters; track chapter.id) {
          <section class="guide-chapter">
            <h2><a [href]="guideHref(chapter.path)">{{ chapter.title }} →</a></h2>
            <p>{{ chapter.description }}</p>
          </section>
        }
      </section>
      <section id="packages" class="package-reference-intro">
        <h2>{{ copy.reference }}</h2>
        <p>{{ copy.referenceDescription }}</p>
        <nav class="category-nav" aria-label="Project categories" i18n-aria-label="@@projectCategoriesNav">
          @for (group of projectGroups; track group.id) {
            <a [href]="'#category-' + group.id">
              {{ group.label }} <span>{{ group.projects.length }}</span>
            </a>
          }
        </nav>
      </section>
      @for (group of projectGroups; track group.id) {
        <section class="catalog-group" [id]="'category-' + group.id" [attr.aria-labelledby]="'heading-' + group.id">
          @if (group.id === 'plugins') {
            <span id="category-capacitor-plugins" class="legacy-category-anchor" aria-hidden="true"></span>
            <span id="category-cordova-plugins" class="legacy-category-anchor" aria-hidden="true"></span>
          }
          <header class="catalog-group__heading">
            <h2 [id]="'heading-' + group.id">{{ group.label }} <span>{{ group.projects.length }}</span></h2>
            <p>{{ group.description }}</p>
          </header>
          <ul class="catalog-grid">
            @for (project of group.projects; track project.id) {
              <li>
                <a class="catalog-card" [href]="projectHref(project)"
                  [attr.target]="project.hostedUrl ? '_blank' : null"
                  [attr.rel]="project.hostedUrl ? 'noopener noreferrer' : null">
                  <span class="catalog-card__icon" aria-hidden="true"><app-project-icon [kind]="project.icon" /></span>
                  <span class="catalog-card__arrow" aria-hidden="true">{{ project.hostedUrl ? '↗' : '→' }}</span>
                  <h3>{{ project.shortName }}</h3>
                  <p class="catalog-card__package">{{ project.packageName }}</p>
                  <p class="catalog-card__description">{{ project.description }}</p>
                  <span class="catalog-card__cta" i18n="@@readDocumentation">Read documentation</span>
                </a>
              </li>
            }
          </ul>
        </section>
      }
      <footer class="catalog-footer">
        <p i18n="@@personalOwnershipNotice">WebView Native UI is an independent open-source initiative maintained by rdlabo.</p>
        <a class="external-link" href="https://github.com/webview-native-ui" target="_blank" rel="noopener noreferrer">GitHub</a>
      </footer>
    </div>
  `,
  styleUrl: './plugin-index.css',

})
export class PluginIndexComponent implements OnInit {
  readonly #seo = inject(SeoService);
  readonly #locale = inject(LOCALE_ID);
  protected readonly copy = guideCopyForLocale(this.#locale);
  protected readonly chapters = guideChaptersForLocale(this.#locale);
  protected guideHref(path: string): string { return localizedPublicPath(this.#locale, path); }
  protected readonly standardSetupLabel = STANDARD_SETUP_LABELS[resolveDocsLocale(this.#locale)];
  protected readonly standardSetupHref = localizedPublicPath(this.#locale, STANDARD_SETUP_PATH);
  protected readonly projectGroups = projectGroupsForLocale(this.#locale);

  protected readonly iosDemoUrl = 'https://ionic-theme-ios27.rdlabo.dev/';
  protected readonly androidDemoUrl = 'https://ionic-theme-md3.rdlabo.dev/';

  protected projectHref(project: ProjectSummary): string {
    return project.hostedUrl ?? localizedPublicPath(this.#locale, project.path);
  }

  ngOnInit(): void {
    const homeTitle = $localize`:@@docsHomeTitle:WebView Native UI Documentation`;
    const description = this.copy.intro;
    this.#seo.setPage({
      title: homeTitle,
      description,
      path: '/',
      structuredData: docsHomeStructuredData(this.#locale, description),
    });
  }
}
