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
          <p class="product-name brand-wordmark">{{ copy.title }}</p>
          <h1>{{ copy.heroHeadline }}</h1>
          <p class="catalog-hero__lead">{{ copy.heroDefinition }}</p>
          <p class="guide-actions"><a class="guide-start" [href]="standardSetupHref">{{ standardSetupLabel }} →</a></p>
          <p class="hero-setup-note">{{ copy.standardAudience }}</p>
        </div>
        <figure class="app-showcase">
          <div class="showcase-screens">
            <div class="showcase-device"><p>iOS · Liquid Glass</p><div class="device-capture device-capture--iphone"><img class="showcase-library" src="/assets/showcase/iphone-library.jpg" width="690" height="1520" [alt]="copy.showcaseLibrary" fetchpriority="high" /></div><small>iPhone 15 Pro Max · iOS 27.2</small></div>
            <div class="showcase-device"><p>Android · <span class="platform-name">Material Design 3</span></p><div class="device-capture device-capture--pixel"><img src="/assets/showcase/pixel-library.jpg" width="1080" height="2400" [alt]="copy.showcaseAndroid" fetchpriority="high" /></div><small>Pixel 8a · Android 17</small></div>
          </div>
          <figcaption><span id="theme-preview-title">{{ copy.showcaseCaption }}</span></figcaption>
        </figure>
      </header>

      <section class="component-gallery" id="theme-demos" aria-labelledby="component-gallery-title">
        <h2 id="component-gallery-title" lang="en">Modern UI paradigms.<br />Ready for mobile.</h2>
        <p>{{ copy.componentPreview }}</p>
        <div class="theme-preview">
          <section>
            <header><h3>iOS 27</h3><a [href]="iosDemoUrl" target="_blank" rel="noopener noreferrer" [attr.aria-label]="copy.tryIos">{{ copy.fullDemo }} ↗</a></header>
            <iframe src="/assets/theme-preview/index.html#ios" [lang]="previewLocale" title="iOS 27" loading="lazy"></iframe>
          </section>
          <section>
            <header><h3>Material Design 3</h3><a [href]="androidDemoUrl" target="_blank" rel="noopener noreferrer" [attr.aria-label]="copy.tryAndroid">{{ copy.fullDemo }} ↗</a></header>
            <iframe src="/assets/theme-preview/index.html#md" [lang]="previewLocale" title="Material Design 3" loading="lazy"></iframe>
          </section>
        </div>
      </section>

      <section class="native-story" aria-labelledby="how-it-fits">
        <header>
          <h2 id="how-it-fits" lang="en">Go native where it matters.</h2>
          <p>{{ copy.approach }}</p>
        </header>
        <figure>
          <img src="/assets/showcase/ios-tab-drag.jpg" [alt]="copy.dragDetail" width="920" height="2000" loading="lazy" />
          <figcaption>{{ copy.dragCaption }}</figcaption>
        </figure>
        <div class="native-details">
          <h3>{{ copy.iosBenefit }}</h3>
          <p>{{ copy.iosDetail }}</p>
          <a [href]="guideHref('/projects/capacitor-native-ui/docs/native-ui')">{{ copy.howTitle }} →</a>
          <h3>{{ copy.androidBenefit }}</h3>
          <p>{{ copy.androidDetail }}</p>

        </div>
      </section>
      <section id="choose-setup" class="setup-section" aria-labelledby="standard-entry">
        <header>
          <h2 id="standard-entry">{{ copy.start }}</h2>
          <p>{{ copy.startDescription }}</p>
          <p><a class="guide-start" [href]="standardSetupHref">{{ standardSetupLabel }} →</a></p>
        </header>
          <nav class="setup-alternatives" [attr.aria-label]="copy.otherSetups">
            <strong>{{ copy.otherSetups }}</strong>
            <div class="themes-only">
            <span>{{ copy.themeOnly }}:</span>
            <a [href]="guideHref('/projects/ionic-theme-ios26/docs/setup')">iOS 26</a>
            <a [href]="guideHref('/projects/ionic-theme-ios27/docs/setup')">iOS 27</a>
            <a [href]="guideHref('/projects/ionic-theme-md3/docs/setup')">MD3</a></div>
            <a [href]="guideHref('/projects/capacitor-native-ui/docs/ionic-vertical-bars')">{{ copy.existingTheme }}</a>
            <a [href]="guideHref('/projects/capacitor-native-ui/docs/framework-independent')">{{ copy.htmlSetup }}</a>
          </nav>
      </section>
      <header class="chapter-heading"><h2>{{ copy.guideTitle }}</h2></header>
      <section class="guide-chapters" [attr.aria-label]="copy.guide">
        @for (chapter of taskGuides; track chapter.id) {
          <section class="guide-chapter">
            <h3><a [href]="guideHref(chapter.path)">{{ chapter.title }} →</a></h3>
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
  styleUrls: ['./plugin-index.css', './catalog-hero.css', './component-gallery.css'],

})
export class PluginIndexComponent implements OnInit {
  readonly #seo = inject(SeoService);
  readonly #locale = inject(LOCALE_ID);
  protected readonly previewLocale = resolveDocsLocale(this.#locale);
  protected readonly copy = guideCopyForLocale(this.#locale);
  protected readonly chapters = guideChaptersForLocale(this.#locale);
  protected readonly taskGuides = this.chapters.filter((chapter) => chapter.kind === 'task');
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
