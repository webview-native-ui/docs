import { Component, LOCALE_ID, PLATFORM_ID, TransferState } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App, INITIAL_DOCS_URL } from './app';
import { projectsForLocale } from './docs/docs-data';

@Component({ standalone: true, template: '<p data-route-content>Current documentation</p>' })
class StubPage {}

function deferred() {
  let resolve!: (value: boolean) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<boolean>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

type GoogleAnalyticsWindow = Window & {
  gtag?: (...args: unknown[]) => void;
};

function mockMatchMedia(initialMatches: boolean) {
  let matches = initialMatches;
  let changeListener: ((event: MediaQueryListEvent) => void) | undefined;
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: () => ({
      get matches() {
        return matches;
      },
      addEventListener: vi.fn((_type: string, listener: (event: MediaQueryListEvent) => void) => {
        changeListener = listener;
      }),
      removeEventListener: vi.fn(),
    }),
  });
  return {
    setMatches(next: boolean) {
      matches = next;
      changeListener?.({ matches: next } as MediaQueryListEvent);
    },
  };
}

describe('App', () => {
  beforeEach(async () => {
    mockMatchMedia(false);
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      queueMicrotask(() => callback(0));
      return 1;
    });
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([
          { path: '', pathMatch: 'full', component: StubPage },
          { path: 'support', component: StubPage },
          { path: 'projects/capacitor-native-ui', component: StubPage },
          { path: 'projects/capacitor-native-ui/docs/setup', component: StubPage },
          { path: 'projects/ionic-theme-ios27', component: StubPage },
          { path: 'projects/webview-native-ui-engine/docs/getting-started', component: StubPage },
          {
            path: 'projects/webview-native-ui-engine/docs/getting-started/capacitor',
            component: StubPage,
          },
          {
            path: 'projects/webview-native-ui-engine',
            component: StubPage,
            canActivate: [() => false],
          },
        ]),
      ],
    }).compileComponents();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete (window as GoogleAnalyticsWindow).gtag;
    document.querySelector('dialog[data-search-test]')?.remove();
  });

  it('sends one page_view for each completed router navigation', async () => {
    const gtag = vi.fn();
    (window as GoogleAnalyticsWindow).gtag = gtag;
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    document.title = 'Tracked page';

    await router.navigateByUrl('/projects/ionic-theme-ios27?source=test');

    expect(gtag).toHaveBeenCalledTimes(1);
    expect(gtag).toHaveBeenCalledWith('event', 'page_view', {
      page_title: 'Tracked page',
      page_location: window.location.href,
      page_path: '/projects/ionic-theme-ios27?source=test',
    });
    fixture.destroy();
  });

  it('keeps the skip link on the current document after navigation', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    const path = '/projects/capacitor-native-ui/docs/setup?from=search';
    await router.navigateByUrl(`${path}#requirements-and-support`);
    fixture.detectChanges();
    const skipLink = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(skipLink.getAttribute('href')).toBe(`${path}#main-content`);
    await router.navigateByUrl('/support');
    fixture.detectChanges();
    expect(skipLink.getAttribute('href')).toBe('/support#main-content');
  });

  it('preserves the logo, global links, footer, and complete library catalog', async () => {
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('header .docs-brand img')?.getAttribute('src')).toBe(
      '/assets/brand/webview-native-ui-logo.png',
    );
    expect(compiled.querySelector('header .docs-brand')?.textContent).toContain(
      'WebView Native UI',
    );
    const projects = projectsForLocale('en').filter((project) => !project.hostedUrl);
    const links = compiled.querySelectorAll<HTMLAnchorElement>(
      'app-library-picker a[id^="project-link-"]',
    );
    expect(Array.from(links, (link) => link.id).sort()).toEqual(
      projects.map((project) => `project-link-${project.id}`).sort(),
    );
    for (const project of projects) {
      expect(compiled.querySelector(`#project-link-${project.id}`)?.getAttribute('href')).toBe(
        project.path,
      );
    }
    expect(compiled.querySelector('.guide-navigation a[href="/standard-setup"]')).not.toBeNull();
    expect(compiled.querySelector('.reference-navigation')?.hasAttribute('open')).toBe(false);
    expect(compiled.querySelector('app-project-navigation')).toBeNull();
    expect(compiled.querySelector('footer')?.textContent).toContain(
      'Web and Native UI. One experience. Maintained by rdlabo',
    );
    expect(compiled.querySelector('footer')?.textContent).toMatch(/© \d{4} rdlabo/);
  });

  it('keeps the prerendered project navigation during startup before the router finishes', async () => {
    const state = TestBed.inject(TransferState);
    const path = '/projects/capacitor-native-ui/docs/setup';
    state.set(INITIAL_DOCS_URL, path);
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const track = compiled.querySelector('.docs-navigation-track')!;
    expect(TestBed.inject(Router).url).toBe('/');
    expect(track.classList.contains('is-detail')).toBe(true);
    expect(track.classList.contains('animate-ready')).toBe(false);
    expect(compiled.querySelector('.docs-active-project')?.textContent).toContain('Native UI');
    expect(compiled.querySelector('app-library-picker a.is-active')?.getAttribute('href')).toBe(
      path,
    );
    expect(compiled.querySelector('app-library-picker')?.textContent).not.toContain(
      'Workers WebView Native UI Engine',
    );
    expect(state.hasKey(INITIAL_DOCS_URL)).toBe(false);

    await TestBed.inject(Router).navigateByUrl(path);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(track.classList.contains('is-detail')).toBe(true);
    compiled.querySelector<HTMLButtonElement>('.project-navigation-back')!.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(track.classList.contains('is-detail')).toBe(false);
    expect(track.classList.contains('animate-ready')).toBe(true);
  });

  it('transfers the resolved server route rather than the router startup path', async () => {
    TestBed.overrideProvider(PLATFORM_ID, { useValue: 'server' });
    const fixture = TestBed.createComponent(App);
    const path = '/projects/capacitor-native-ui/docs/setup';
    await TestBed.inject(Router).navigateByUrl(path);
    fixture.detectChanges();
    expect(JSON.parse(TestBed.inject(TransferState).toJson())[INITIAL_DOCS_URL]).toBe(path);
  });

  it('renders only the current project pages when entering a deep link directly', async () => {
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/projects/capacitor-native-ui/docs/setup');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-project-navigation')?.textContent).toContain('Native UI');
    expect(compiled.querySelector('app-project-navigation')?.textContent).toContain('Native UI');
    expect(compiled.querySelector('app-project-navigation')?.textContent).toContain(
      'App-local Native UI extensions (experimental)',
    );
    expect(compiled.querySelector('.docs-navigation-track')?.classList.contains('is-detail')).toBe(
      true,
    );
    expect(
      compiled
        .querySelector('app-library-picker')
        ?.closest('.docs-navigation-slide')
        ?.hasAttribute('inert'),
    ).toBe(true);
  });

  it('marks only the current nested page, including query and fragment navigation', async () => {
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl(
      '/projects/webview-native-ui-engine/docs/getting-started/capacitor?source=search#example',
    );
    fixture.detectChanges();
    await fixture.whenStable();
    const links = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '.project-navigation-pages [aria-current="page"]',
    );
    expect(links).toHaveLength(1);
    expect(links[0]?.textContent?.trim()).toBe('Capacitor plugin integration');
  });

  it('opens the library picker without navigating and keeps the current page when reselecting its library', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/projects/capacitor-native-ui/docs/setup');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelector<HTMLButtonElement>('.project-navigation-back')!.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(router.url).toBe('/projects/capacitor-native-ui/docs/setup');
    expect(document.activeElement).toBe(
      compiled.querySelector('#project-link-capacitor-native-ui'),
    );
    expect(
      compiled
        .querySelector('app-project-navigation')
        ?.closest('.docs-navigation-slide')
        ?.hasAttribute('inert'),
    ).toBe(true);
    expect(compiled.querySelector('.docs-rail')?.hasAttribute('inert')).toBe(false);
    const link = compiled.querySelector<HTMLAnchorElement>('#project-link-capacitor-native-ui')!;
    expect(link.getAttribute('href')).toBe(router.url);
    link.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(router.url).toBe('/projects/capacitor-native-ui/docs/setup');
    expect(compiled.querySelector('.docs-navigation-track')?.classList.contains('is-detail')).toBe(
      true,
    );
    expect(document.activeElement).toBe(
      compiled.querySelector('.project-navigation-pages [aria-current="page"]'),
    );
  });

  it('closes only the language menu on Escape while keeping the desktop library picker open', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/projects/capacitor-native-ui/docs/setup');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelector<HTMLButtonElement>('.project-navigation-back')!.click();
    fixture.detectChanges();
    await fixture.whenStable();
    const details = compiled.querySelector<HTMLDetailsElement>('app-language-menu details')!;
    const summary = details.querySelector('summary')!;
    for (const target of [summary, document.body]) {
      details.open = true;
      details.dispatchEvent(new Event('toggle'));
      summary.focus();
      target.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      );
      await fixture.whenStable();
      fixture.detectChanges();
      expect(details.open).toBe(false);
      expect(
        compiled.querySelector('.docs-navigation-track')?.classList.contains('is-detail'),
      ).toBe(false);
      expect(document.activeElement).toBe(summary);
      expect(router.url).toBe('/projects/capacitor-native-ui/docs/setup');
    }
  });

  it('collapses the library catalog after navigating to a different library', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelector<HTMLAnchorElement>('#project-link-capacitor-native-ui')!.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(router.url).toBe('/projects/capacitor-native-ui');
    expect(compiled.querySelector('app-project-navigation')?.textContent).toContain('Native UI');
    expect(compiled.querySelector('.docs-navigation-track')?.classList.contains('is-detail')).toBe(
      true,
    );
    compiled
      .querySelector<HTMLButtonElement>(
        '.docs-rail-categories button[aria-label="Capacitor plugins"]',
      )!
      .click();
    fixture.detectChanges();
    compiled
      .querySelector<HTMLButtonElement>('.docs-rail-categories button[aria-label="Themes"]')!
      .click();
    fixture.detectChanges();
    compiled.querySelector<HTMLAnchorElement>('#project-link-ionic-theme-ios27')!.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(router.url).toBe('/projects/ionic-theme-ios27');
    expect(compiled.querySelector('app-project-navigation')?.textContent).toContain('Animation');
    expect(compiled.querySelector('app-project-navigation')?.textContent).not.toContain(
      'App-local Native UI extensions (experimental)',
    );
    expect(compiled.querySelector('.docs-navigation-track')?.classList.contains('is-detail')).toBe(
      true,
    );
  });

  it('opens a library menu while its body resolver is still loading', async () => {
    const hold = deferred();
    const resolver = vi.fn(() => hold.promise);
    const router = TestBed.inject(Router);
    router.resetConfig(
      router.config.map((route) =>
        route.path === 'projects/capacitor-native-ui'
          ? { ...route, resolve: { body: resolver } }
          : route,
      ),
    );
    const fixture = TestBed.createComponent(App);
    await router.navigateByUrl('/');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const currentContent = compiled.querySelector('[data-route-content]')!;
    compiled.querySelector<HTMLAnchorElement>('#project-link-capacitor-native-ui')!.click();
    await vi.waitFor(() => expect(resolver).toHaveBeenCalledOnce());
    fixture.detectChanges();
    expect(router.url).toBe('/');
    expect(compiled.querySelector('app-project-navigation')?.textContent).toContain('Native UI');
    expect(compiled.querySelector('.docs-navigation-track')?.classList.contains('is-detail')).toBe(
      true,
    );
    expect(compiled.querySelector('#main-content')?.getAttribute('aria-busy')).toBe('true');
    expect(compiled.querySelector('#main-content')?.contains(currentContent)).toBe(true);
    expect(currentContent.closest('[inert], [aria-hidden="true"]')).toBeNull();
    expect(compiled.querySelector('.docs-loading')).toBeNull();
    expect(document.activeElement).toBe(compiled.querySelector('.project-navigation-pages a'));

    compiled.querySelector<HTMLButtonElement>('.project-navigation-back')!.click();
    fixture.detectChanges();
    expect(compiled.querySelector('#project-link-capacitor-native-ui')?.getAttribute('href')).toBe(
      '/projects/capacitor-native-ui',
    );
    const selected = compiled.querySelector('#project-link-capacitor-native-ui')!;
    expect(selected.querySelectorAll('.library-selected')).toHaveLength(1);
    expect(selected.querySelector('.library-next')).toBeNull();
    hold.resolve(true);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(router.url).toBe('/projects/capacitor-native-ui');
    expect(compiled.querySelector('.docs-navigation-track')?.classList.contains('is-detail')).toBe(
      false,
    );
    expect(document.activeElement).toBe(selected);
    expect(compiled.querySelector('.docs-loading')).toBeNull();
    expect(compiled.querySelector('#main-content')?.hasAttribute('aria-busy')).toBe(false);
  });

  it('keeps the newest library menu when a slower library navigation is superseded', async () => {
    const stripe = deferred();
    const admob = deferred();
    const stripeResolver = vi.fn(() => stripe.promise);
    const admobResolver = vi.fn(() => admob.promise);
    const router = TestBed.inject(Router);
    router.resetConfig(
      router.config.map((route) => {
        const resolver =
          route.path === 'projects/capacitor-native-ui'
            ? stripeResolver
            : route.path === 'projects/ionic-theme-ios27'
              ? admobResolver
              : undefined;
        return resolver ? { ...route, resolve: { body: resolver } } : route;
      }),
    );
    const fixture = TestBed.createComponent(App);
    await router.navigateByUrl('/');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    compiled.querySelector<HTMLAnchorElement>('#project-link-capacitor-native-ui')!.click();
    await vi.waitFor(() => expect(stripeResolver).toHaveBeenCalledOnce());
    fixture.detectChanges();
    compiled.querySelector<HTMLButtonElement>('.project-navigation-back')!.click();
    fixture.detectChanges();
    compiled
      .querySelector<HTMLButtonElement>('.docs-rail-categories button[aria-label="Themes"]')!
      .click();
    fixture.detectChanges();
    compiled.querySelector<HTMLAnchorElement>('#project-link-ionic-theme-ios27')!.click();
    await vi.waitFor(() => expect(admobResolver).toHaveBeenCalledOnce());
    fixture.detectChanges();
    stripe.resolve(true);
    await stripe.promise;
    fixture.detectChanges();
    expect(compiled.querySelector('app-project-navigation')?.textContent).toContain('Animation');
    expect(compiled.querySelector('app-project-navigation')?.textContent).not.toContain(
      'App-local Native UI extensions (experimental)',
    );
    expect(compiled.querySelector('#main-content')?.getAttribute('aria-busy')).toBe('true');
    expect(compiled.querySelector('.docs-loading')).toBeNull();
    admob.resolve(true);
    await fixture.whenStable();
    expect(router.url).toBe('/projects/ionic-theme-ios27');
    expect(compiled.querySelector('.docs-loading')).toBeNull();
  });

  it('lets a mobile user choose a document before the library body has loaded', async () => {
    mockMatchMedia(true);
    const hold = deferred();
    const resolver = vi.fn(() => hold.promise);
    const router = TestBed.inject(Router);
    router.resetConfig(
      router.config.map((route) =>
        route.path?.startsWith('projects/capacitor-native-ui')
          ? { ...route, resolve: { body: resolver } }
          : route,
      ),
    );
    const fixture = TestBed.createComponent(App);
    await router.navigateByUrl('/');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const toggle = compiled.querySelector<HTMLButtonElement>(
      'button[aria-controls="docs-sidebar"]',
    )!;
    toggle.click();
    fixture.detectChanges();
    compiled.querySelector<HTMLAnchorElement>('#project-link-capacitor-native-ui')!.click();
    await vi.waitFor(() => expect(resolver).toHaveBeenCalledOnce());
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    compiled
      .querySelector<HTMLAnchorElement>(
        '.project-navigation-pages a[href="/projects/capacitor-native-ui/docs/setup"]',
      )!
      .click();
    await vi.waitFor(() => expect(resolver).toHaveBeenCalledTimes(2));
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(compiled.querySelector('#main-content')?.getAttribute('aria-busy')).toBe('true');
    expect(compiled.querySelector('.docs-loading')).toBeNull();
    hold.resolve(true);
    await fixture.whenStable();
    expect(router.url).toBe('/projects/capacitor-native-ui/docs/setup');
    expect(document.activeElement).toBe(toggle);
    expect(compiled.querySelector('.docs-loading')).toBeNull();
  });

  it.each([false, true])(
    'restores the committed view after a failed load (mobile=%s)',
    async (mobile) => {
      mockMatchMedia(mobile);
      const hold = deferred();
      const resolver = vi.fn(() => hold.promise);
      const router = TestBed.inject(Router);
      router.resetConfig(
        router.config.map((route) =>
          route.path === 'projects/ionic-theme-ios27'
            ? { ...route, resolve: { body: resolver } }
            : route,
        ),
      );
      const fixture = TestBed.createComponent(App);
      await router.navigateByUrl('/projects/capacitor-native-ui/docs/setup');
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const toggle = compiled.querySelector<HTMLButtonElement>(
        'button[aria-controls="docs-sidebar"]',
      )!;
      if (mobile) {
        toggle.click();
        fixture.detectChanges();
      }
      compiled.querySelector<HTMLButtonElement>('.project-navigation-back')!.click();
      fixture.detectChanges();
      compiled
        .querySelector<HTMLButtonElement>('.docs-rail-categories button[aria-label="Themes"]')!
        .click();
      fixture.detectChanges();
      compiled.querySelector<HTMLAnchorElement>('#project-link-ionic-theme-ios27')!.click();
      await vi.waitFor(() => expect(resolver).toHaveBeenCalledOnce());
      fixture.detectChanges();
      expect(compiled.querySelector('app-project-navigation')?.textContent).toContain('Animation');
      hold.reject(new Error('chunk unavailable'));
      await fixture.whenStable();
      fixture.detectChanges();
      expect(router.url).toBe('/projects/capacitor-native-ui/docs/setup');
      expect(compiled.querySelector('app-project-navigation')?.textContent).toContain('Native UI');
      expect(
        compiled.querySelector('.docs-navigation-track')?.classList.contains('is-detail'),
      ).toBe(mobile);
      expect(compiled.querySelector('.docs-loading')).toBeNull();
      expect(compiled.querySelector('[role="alert"]')?.textContent).toContain(
        'Reload the documentation',
      );
      expect(compiled.querySelector('[role="alert"] a')?.getAttribute('href')).toBe(
        '/projects/ionic-theme-ios27',
      );
      expect(document.activeElement).toBe(
        mobile ? toggle : compiled.querySelector('#project-link-ionic-theme-ios27'),
      );
      expect(compiled.querySelector('[role="alert"]')?.closest('main')).toBeNull();
      compiled.querySelector<HTMLButtonElement>('.docs-load-error-dismiss')!.click();
      fixture.detectChanges();
      expect(compiled.querySelector('[role="alert"]')).toBeNull();
      expect(document.activeElement).toBe(
        mobile ? toggle : compiled.querySelector('#project-link-ionic-theme-ios27'),
      );
    },
  );

  it('uses the primary category rail to show libraries without a filter field', async () => {
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    compiled
      .querySelector<HTMLButtonElement>(
        '.docs-rail-categories button[aria-label="Developer tools"]',
      )!
      .click();
    await fixture.whenStable();
    fixture.detectChanges();
    const links = compiled.querySelectorAll('app-library-picker a');
    expect(links).toHaveLength(
      projectsForLocale('en').filter(
        (project) => project.category === 'developer-tools' && !project.hostedUrl,
      ).length,
    );
    expect(compiled.querySelector('#project-link-webview-native-ui-engine')).not.toBeNull();
    expect(compiled.querySelector('#project-link-capacitor-native-ui')).toBeNull();
    expect(compiled.querySelector('app-library-picker input')).toBeNull();
    compiled
      .querySelector<HTMLButtonElement>(
        '.docs-rail-categories button[aria-label="Browse all libraries"]',
      )!
      .click();
    await fixture.whenStable();
    expect(compiled.querySelector('#project-link-capacitor-native-ui')).not.toBeNull();
  });

  it('keeps the picker and current page when a library navigation is cancelled', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/projects/capacitor-native-ui/docs/setup');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelector<HTMLButtonElement>('.docs-rail-categories button')!.click();
    fixture.detectChanges();
    compiled.querySelector<HTMLAnchorElement>('#project-link-webview-native-ui-engine')!.click();
    await fixture.whenStable();
    expect(router.url).toBe('/projects/capacitor-native-ui/docs/setup');
    expect(compiled.querySelector('.docs-navigation-track')?.classList.contains('is-detail')).toBe(
      false,
    );
    expect(compiled.querySelector('app-project-navigation')?.textContent).toContain('Native UI');
  });

  it('keeps native modifier-click behavior while the picker is open', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/projects/capacitor-native-ui/docs/setup');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelector<HTMLButtonElement>('.project-navigation-back')!.click();
    fixture.detectChanges();
    compiled
      .querySelector<HTMLButtonElement>('.docs-rail-categories button[aria-label="Themes"]')!
      .click();
    fixture.detectChanges();
    const link = compiled.querySelector<HTMLAnchorElement>('#project-link-ionic-theme-ios27')!;
    let nativeClick = false;
    link.addEventListener(
      'click',
      (event) => {
        nativeClick = !event.defaultPrevented;
        // jsdom cannot open another document; inspect the native event before cancelling it.
        event.preventDefault();
      },
      { once: true },
    );
    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true }));
    await fixture.whenStable();
    expect(nativeClick).toBe(true);
    expect(router.url).toBe('/projects/capacitor-native-ui/docs/setup');
    expect(compiled.querySelector('.docs-navigation-track')?.classList.contains('is-detail')).toBe(
      false,
    );
  });

  it('links to the matching Japanese route', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/projects/capacitor-native-ui/docs/setup');
    fixture.detectChanges();

    expect(
      (fixture.nativeElement as HTMLElement)
        .querySelector<HTMLAnchorElement>('a[hreflang="ja"]')
        ?.getAttribute('href'),
    ).toBe('/ja/projects/capacitor-native-ui/docs/setup');
  });

  it('switches EN home language to /ja without a trailing slash', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/');
    fixture.detectChanges();

    expect(
      (fixture.nativeElement as HTMLElement)
        .querySelector<HTMLAnchorElement>('a[hreflang="ja"]')
        ?.getAttribute('href'),
    ).toBe('/ja');
  });

  it('uses slashless locale home links in the header and sidebar', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: LOCALE_ID, useValue: 'ja' },
        provideRouter([
          { path: '', pathMatch: 'full', component: StubPage },
          { path: 'projects/capacitor-native-ui', component: StubPage },
          { path: 'projects/capacitor-native-ui/docs/setup', component: StubPage },
          { path: 'projects/ionic-theme-ios27', component: StubPage },
        ]),
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const brand = compiled.querySelector<HTMLAnchorElement>('header a.docs-brand')!;
    const docsHome = compiled.querySelector<HTMLAnchorElement>('header a.docs-home-link')!;
    const allProjects = compiled.querySelector<HTMLAnchorElement>('.guide-navigation > a')!;
    expect(brand.getAttribute('href')).toBe('/ja');
    expect(brand.target).toBe('');
    expect(docsHome.getAttribute('href')).toBe('/ja');
    expect(docsHome.textContent?.trim()).toBe('docs');
    expect(allProjects.getAttribute('href')).toBe('/ja');
    expect(allProjects.getAttribute('aria-current')).toBe('page');
    await router.navigateByUrl('/projects/capacitor-native-ui/docs/setup');
    fixture.detectChanges();
    expect(compiled.querySelector('a')?.getAttribute('href')).toBe(
      '/ja/projects/capacitor-native-ui/docs/setup#main-content',
    );
  });

  it('links the Japanese header brand to the documentation home in the same tab', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: LOCALE_ID, useValue: 'ja' },
        provideRouter([
          { path: '', pathMatch: 'full', component: StubPage },
          { path: 'projects/capacitor-native-ui', component: StubPage },
          { path: 'projects/capacitor-native-ui/docs/setup', component: StubPage },
          { path: 'projects/ionic-theme-ios27', component: StubPage },
        ]),
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/projects/capacitor-native-ui');
    fixture.detectChanges();

    const brand = (fixture.nativeElement as HTMLElement).querySelector<HTMLAnchorElement>(
      'header a.docs-brand',
    )!;
    const docsHome = (fixture.nativeElement as HTMLElement).querySelector<HTMLAnchorElement>(
      'header a.docs-home-link',
    )!;
    expect(brand.getAttribute('href')).toBe('/ja');
    expect(brand.target).toBe('');
    expect(docsHome.getAttribute('href')).toBe('/ja');
    expect(router.url).toBe('/projects/capacitor-native-ui');
  });

  it('links the English header brand to the documentation home in the same tab', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/projects/capacitor-native-ui');
    fixture.detectChanges();

    const brand = (fixture.nativeElement as HTMLElement).querySelector<HTMLAnchorElement>(
      'header a.docs-brand',
    )!;
    const docsHome = (fixture.nativeElement as HTMLElement).querySelector<HTMLAnchorElement>(
      'header a.docs-home-link',
    )!;
    expect(brand.getAttribute('href')).toBe('/');
    expect(brand.target).toBe('');
    expect(docsHome.getAttribute('href')).toBe('/');
    expect(docsHome.textContent?.trim()).toBe('docs');
    expect(router.url).toBe('/projects/capacitor-native-ui');
  });

  it('marks exactly one sidebar location with aria-current for each docs route kind', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    const compiled = fixture.nativeElement as HTMLElement;
    const currentLinks = () =>
      Array.from(
        compiled.querySelectorAll<HTMLAnchorElement>('#docs-sidebar a[aria-current="page"]'),
      );

    await router.navigateByUrl('/');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(currentLinks().map((link) => link.textContent?.trim())).toEqual(['Overview']);

    await router.navigateByUrl('/support');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(currentLinks().map((link) => link.textContent?.trim())).toEqual(['Sponsor']);

    await router.navigateByUrl('/projects/capacitor-native-ui');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(currentLinks().map((link) => link.textContent?.trim())).toEqual(['Overview']);

    await router.navigateByUrl('/projects/capacitor-native-ui/docs/setup');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(currentLinks()).toHaveLength(1);
    expect(currentLinks()[0]?.textContent?.trim()).toBe('Ionic setup');
    expect(
      compiled
        .querySelector<HTMLAnchorElement>('a[href="/projects/capacitor-native-ui"]')
        ?.getAttribute('aria-current'),
    ).toBeNull();
  });

  it('keeps the empty pagefind search host in the DOM for production injection', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const trigger = (fixture.nativeElement as HTMLElement).querySelector('pagefind-modal-trigger');
    expect(trigger).not.toBeNull();
    expect(trigger?.childElementCount).toBe(0);
  });

  it('removes a closed mobile menu from focus order and restores focus on Escape', async () => {
    mockMatchMedia(true);
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const menu = compiled.querySelector<HTMLElement>('#docs-sidebar')!;
    const button = compiled.querySelector<HTMLButtonElement>(
      'button[aria-controls="docs-sidebar"]',
    )!;

    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(menu.hasAttribute('inert')).toBe(true);
    expect(menu.getAttribute('aria-hidden')).toBe('true');
    button.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(menu.hasAttribute('inert')).toBe(false);
    expect(document.activeElement).toBe(menu.querySelector('.guide-navigation a'));

    button.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(menu.hasAttribute('inert')).toBe(true);
    expect(document.activeElement).toBe(button);

    button.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(menu.hasAttribute('inert')).toBe(false);
    expect(document.activeElement).toBe(menu.querySelector('.guide-navigation a'));

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(menu.hasAttribute('inert')).toBe(true);
    expect(document.activeElement).toBe(button);
  });

  it('moves through every visible drawer control in both directions without reaching header links', async () => {
    mockMatchMedia(true);
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector<HTMLButtonElement>(
      'button[aria-controls="docs-sidebar"]',
    )!;
    button.click();
    fixture.detectChanges();
    await fixture.whenStable();
    const sidebar = compiled.querySelector<HTMLElement>('#docs-sidebar')!;
    const controls = [
      button,
      ...Array.from(
        sidebar.querySelectorAll<HTMLElement>('a[href], button, input, summary, [tabindex]'),
      ).filter(
        (element) =>
          element.tabIndex >= 0 &&
          !element.matches(':disabled') &&
          !element.closest('[inert], [hidden], [aria-hidden="true"]') &&
          (!element.closest('details:not([open])') || element.tagName === 'SUMMARY'),
      ),
    ];
    button.focus();
    for (const shiftKey of [false, true]) {
      for (let step = 1; step <= controls.length; step++) {
        const event = new KeyboardEvent('keydown', {
          key: 'Tab',
          shiftKey,
          bubbles: true,
          cancelable: true,
        });
        document.activeElement!.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
        const index = (shiftKey ? controls.length - step : step) % controls.length;
        expect(document.activeElement).toBe(controls[index]);
      }
    }
    expect(compiled.querySelector('.docs-navigation-pane')?.scrollLeft).toBe(0);
  });

  it('waits for the opening frame and cancels stale focus when the drawer closes', async () => {
    const frames: FrameRequestCallback[] = [];
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      frames.push(callback);
      return frames.length;
    });
    const cancel = vi.spyOn(window, 'cancelAnimationFrame');
    mockMatchMedia(true);
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector<HTMLButtonElement>(
      'button[aria-controls="docs-sidebar"]',
    )!;
    button.focus();
    button.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(document.activeElement).toBe(button);
    expect(frames.length).toBeGreaterThan(0);
    button.click();
    fixture.detectChanges();
    await fixture.whenStable();
    const cancelledFrame = cancel.mock.calls.at(-1)?.[0];
    expect(cancelledFrame).toBeDefined();
    frames[cancelledFrame! - 1]!(0);
    expect(document.activeElement).toBe(button);
    const previousFrameCount = frames.length;
    button.click();
    fixture.detectChanges();
    await fixture.whenStable();
    for (const frame of frames.slice(previousFrameCount)) frame(0);
    expect(document.activeElement).toBe(compiled.querySelector('.guide-navigation a'));
  });

  it('reveals the current document when opening or reselecting its library after the viewport shrinks', async () => {
    mockMatchMedia(true);
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl(
      '/projects/webview-native-ui-engine/docs/getting-started/capacitor',
    );
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const navigation = compiled.querySelector<HTMLElement>('.project-navigation-pages')!;
    const current = navigation.querySelector<HTMLAnchorElement>('[aria-current="page"]')!;
    navigation.scrollTop = 600;
    vi.spyOn(navigation, 'getBoundingClientRect').mockReturnValue(new DOMRect(64, 170, 255, 398));
    vi.spyOn(current, 'getBoundingClientRect').mockImplementation(
      () => new DOMRect(74, 1400 - navigation.scrollTop, 235, 40),
    );

    compiled.querySelector<HTMLButtonElement>('button[aria-controls="docs-sidebar"]')!.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.activeElement).toBe(current);
    expect(navigation.scrollTop).toBe(884);
    expect(navigation.scrollLeft).toBe(0);
    expect(compiled.querySelector('.docs-navigation-pane')?.scrollLeft).toBe(0);

    compiled
      .querySelector<HTMLButtonElement>(
        '.docs-rail-categories button[aria-label="Developer tools"]',
      )!
      .click();
    fixture.detectChanges();
    await fixture.whenStable();
    navigation.scrollTop = 600;
    compiled.querySelector<HTMLAnchorElement>('#project-link-webview-native-ui-engine')!.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(document.activeElement).toBe(current);
    expect(navigation.scrollTop).toBe(884);
    expect(compiled.querySelector('.docs-navigation-pane')?.scrollLeft).toBe(0);
  });

  it('keeps the mobile menu open after library selection and closes it after page selection', async () => {
    mockMatchMedia(true);
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const menu = compiled.querySelector<HTMLElement>('#docs-sidebar')!;
    const button = compiled.querySelector<HTMLButtonElement>(
      'button[aria-controls="docs-sidebar"]',
    )!;
    button.click();
    fixture.detectChanges();
    await fixture.whenStable();
    compiled.querySelector<HTMLAnchorElement>('#project-link-capacitor-native-ui')!.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(router.url).toBe('/projects/capacitor-native-ui');
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(menu.hasAttribute('inert')).toBe(false);
    expect(document.activeElement).toBe(compiled.querySelector('app-project-navigation a'));
    compiled
      .querySelector<HTMLAnchorElement>(
        'app-project-navigation a[href="/projects/capacitor-native-ui/docs/setup"]',
      )!
      .click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(router.url).toBe('/projects/capacitor-native-ui/docs/setup');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(menu.hasAttribute('inert')).toBe(true);
    expect(document.activeElement).toBe(button);
  });

  it('closes the mobile drawer when choosing a language without moving focus', async () => {
    mockMatchMedia(true);
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector<HTMLButtonElement>(
      'button[aria-controls="docs-sidebar"]',
    )!;
    button.click();
    fixture.detectChanges();
    await fixture.whenStable();
    const details = compiled.querySelector<HTMLDetailsElement>('app-language-menu details')!;
    const summary = details.querySelector('summary')!;
    summary.focus();
    details.open = true;
    details.dispatchEvent(new Event('toggle'));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(summary);
    const tab = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    summary.dispatchEvent(tab);
    expect(tab.defaultPrevented).toBe(false);
    summary.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(details.open).toBe(false);
    expect(document.activeElement).toBe(summary);
  });

  it('lets the search dialog own Tab and Escape while the mobile menu is open', async () => {
    mockMatchMedia(true);
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const button = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
      'button[aria-controls="docs-sidebar"]',
    )!;
    button.click();
    fixture.detectChanges();
    await fixture.whenStable();
    const dialog = document.createElement('dialog');
    dialog.setAttribute('open', '');
    dialog.dataset['searchTest'] = '';
    const input = document.createElement('input');
    dialog.appendChild(input);
    document.body.appendChild(dialog);
    input.focus();
    const tab = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    input.dispatchEvent(tab);
    expect(tab.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(input);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(input);
  });

  it('ignores Escape on desktop, then closes and restores focus when the viewport becomes mobile', async () => {
    const media = mockMatchMedia(false);
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const menu = compiled.querySelector<HTMLElement>('#docs-sidebar')!;
    const button = compiled.querySelector<HTMLButtonElement>(
      'button[aria-controls="docs-sidebar"]',
    )!;
    const link = menu.querySelector<HTMLAnchorElement>('a')!;

    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(menu.hasAttribute('inert')).toBe(false);
    link.focus();
    expect(document.activeElement).toBe(link);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(menu.hasAttribute('inert')).toBe(false);
    expect(menu.hasAttribute('aria-hidden')).toBe(false);
    expect(document.activeElement).toBe(link);

    media.setMatches(true);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(menu.hasAttribute('inert')).toBe(true);
    expect(menu.getAttribute('aria-hidden')).toBe('true');
    expect(document.activeElement).toBe(button);
  });
});
