import { APP_BASE_HREF } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { PUBLISHED_DOCS_LOCALES } from '../../../../../shared/docs-locales';
import { GUIDE_CHAPTERS, guideCopyForLocale } from '../../../../../shared/guide-navigation';
import { GuidePageComponent } from './guide-page';

const cases = PUBLISHED_DOCS_LOCALES.flatMap((locale) =>
  GUIDE_CHAPTERS.map((chapter) => ({ ...locale, chapter })),
);

describe('Task guides', () => {
  afterEach(() => vi.restoreAllMocks());

  it.each(cases)(
    'renders actionable $code/$chapter.id content with working step destinations',
    async ({ code, subPath, chapter }) => {
      const prefix = subPath ? `/${subPath}` : '';
      vi.spyOn(document, 'baseURI', 'get').mockReturnValue(`http://localhost${prefix}/`);
      TestBed.configureTestingModule({
        providers: [
          { provide: LOCALE_ID, useValue: code },
          { provide: APP_BASE_HREF, useValue: `${prefix}/` },
          provideRouter(
            GUIDE_CHAPTERS.map((item) => ({
              path: `guides/${item.id}`,
              component: GuidePageComponent,
              data: { chapter: item.id },
            })),
          ),
        ],
      });
      const harness = await RouterTestingHarness.create(`/guides/${chapter.id}`);
      const page = harness.routeNativeElement!;
      expect(page.querySelector('h1')?.textContent).toBe(chapter.title[code]);
      const copy = guideCopyForLocale(code);
      expect(page.querySelector('.guide-kind')?.textContent?.trim()).toBe(
        chapter.kind === 'migration' ? copy.migrationGroup : copy.guideTitle,
      );
      const steps = page.querySelectorAll('article h2[id]');
      expect(steps.length).toBeGreaterThanOrEqual(4);
      expect(page.querySelectorAll('article pre code').length).toBeGreaterThanOrEqual(2);
      const links = page.querySelectorAll<HTMLAnchorElement>('.setup-toc a');
      expect(links.length).toBe(steps.length);
      for (const link of links) {
        const url = new URL(link.href);
        expect(url.pathname).toBe(`${prefix}/guides/${chapter.id}`);
        expect(
          Array.from(steps).some(
            (heading) =>
              heading.id === url.hash.slice(1) ||
              decodeURIComponent(heading.id) === decodeURIComponent(url.hash.slice(1)),
          ),
        ).toBe(true);
      }
      if (chapter.kind === 'task') {
        expect(page.querySelector('article a[href="' + prefix + '/standard-setup"]')).not.toBeNull();
      }
      expect(
        page.querySelector(
          'article a[href^="https://github.com/webview-native-ui/docs/edit/main/projects/docs/src/guides/' +
            code +
            '/"]',
        ),
      ).not.toBeNull();
    },
  );
});
