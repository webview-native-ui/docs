import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { StandardSetupPageComponent } from './standard-setup-page';
import { guideCopyForLocale } from '../../../../../shared/guide-navigation';
import { PUBLISHED_DOCS_LOCALES } from '../../../../../shared/docs-locales';

describe('Standard setup navigation', () => {
  it.each(PUBLISHED_DOCS_LOCALES)(
    'links each $code step to its rendered heading',
    async ({ code, subPath }) => {
      TestBed.configureTestingModule({
        imports: [StandardSetupPageComponent],
        providers: [provideRouter([]), { provide: LOCALE_ID, useValue: code }],
      });
      const fixture = TestBed.createComponent(StandardSetupPageComponent);
      fixture.detectChanges();
      const copy = guideCopyForLocale(code);
      expect(fixture.nativeElement.querySelector('.guide-kind')?.textContent?.trim()).toBe(copy.setupGroup);
      expect(fixture.nativeElement.querySelector('.guide-reading-hint')?.textContent?.trim()).toBe(copy.setupReading);
      await fixture.whenStable();
      const page = fixture.nativeElement as HTMLElement;
      const links = page.querySelectorAll<HTMLAnchorElement>('.setup-toc a');
      const headings = page.querySelectorAll('article h2[id]');
      expect(links.length).toBe(headings.length);
      expect(links.length).toBeGreaterThan(4);
      for (const link of links) {
        const url = new URL(link.href);
        expect(url.pathname).toBe(`${subPath ? '/' + subPath : ''}/standard-setup`);
        const id = decodeURIComponent(url.hash.slice(1));
        expect(
          Array.from(headings).some(
            (heading) => heading.id === id || decodeURIComponent(heading.id) === id,
          ),
        ).toBe(true);
      }
      expect(page.querySelectorAll('h1')).toHaveLength(1);
      expect(page.textContent).toContain('@rdlabo/ionic-theme-ios26');
      expect(page.textContent).toContain('ios27ThemeConfig');
      expect(page.textContent).not.toContain('ios26ThemeConfig');
      expect(page.textContent).not.toContain('CSS.supports');
    },
  );
});
