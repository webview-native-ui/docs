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
        <p class="eyebrow" i18n="@@openSourceDocumentation">Open source documentation</p>
        <h1>{{ copy.title }}</h1>
        <p class="catalog-hero__lead">{{ copy.intro }}</p>
        <div class="platform-outcomes">
          <section><h2>{{ copy.iosBenefit }}</h2><p>{{ copy.iosDetail }}</p></section>
          <section><h2>{{ copy.androidBenefit }}</h2><p>{{ copy.androidDetail }}</p></section>
        </div>
        <h2>{{ copy.start }}</h2>
        <p class="catalog-hero__lead">{{ copy.startDescription }}</p>
        <p class="guide-actions"><a class="guide-start" [href]="standardSetupHref">{{ standardSetupLabel }} →</a><a href="#theme-preview-title">{{ copy.previewTitle }} ↓</a></p>
        <nav class="setup-alternatives" [attr.aria-label]="copy.otherSetups">
          <span>{{ copy.otherSetups }}</span>
          <a [href]="guideHref('/guides/appearance')">{{ copy.themeOnly }}</a>
          <a [href]="guideHref('/projects/capacitor-native-ui/docs/framework-independent')">{{ copy.htmlSetup }}</a>
          <a [href]="guideHref('/projects/cordova-native-ui/docs/readme')">{{ copy.cordovaSetup }}</a>
        </nav>
      </header>

      <section class="theme-preview" aria-labelledby="theme-preview-title">
        <h2 id="theme-preview-title">{{ copy.previewTitle }}</h2>
        <p>{{ copy.previewScope }}</p>
        <div class="theme-preview-grid">
          <figure>
            <img src="https://raw.githubusercontent.com/webview-native-ui/ionic-theme-ios27/c70beb9d1e5b39de696b2b2c47a3d9bc5ffcdfbe/screenshots/ios27-library.png" width="780" height="1688" loading="lazy" [alt]="copy.iosPreview" />
            <figcaption>{{ copy.iosPreview }}</figcaption>
            <a [href]="iosDemoUrl" target="_blank" rel="noopener noreferrer">{{ copy.tryIos }} ↗</a>
          </figure>
          <figure>
            <img src="https://raw.githubusercontent.com/webview-native-ui/ionic-theme-md3/v9.2.1/screenshots/md3.png" width="1848" height="974" loading="lazy" [alt]="copy.androidPreview" />
            <figcaption>{{ copy.androidPreview }}</figcaption>
            <a [href]="androidDemoUrl" target="_blank" rel="noopener noreferrer">{{ copy.tryAndroid }} ↗</a>
          </figure>
        </div>
      </section>
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
