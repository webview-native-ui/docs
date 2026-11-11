import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { routes } from './app.routes';
import { projectCatalog } from './docs/docs-data';
import { NotFoundComponent } from './docs/not-found';
import { PluginIndexComponent } from './docs/plugin-index';

describe('routes', () => {
  it('exposes one canonical project index and redirects its alias', () => {
    expect(routes.find((route) => route.path === '')?.component).toBe(PluginIndexComponent);
    expect(routes.find((route) => route.path === 'projects')?.redirectTo).toBe('');
  });

  it('lazy-loads the shared support page outside individual project documentation', () => {
    const supportRoute = routes.find((route) => route.path === 'support');
    expect(supportRoute).toBeDefined();
    expect(supportRoute!.component).toBeUndefined();
    expect(supportRoute!.loadComponent).toBeTypeOf('function');
  });

  it('keeps canonical and legacy routes for every migrated project', () => {
    expect(projectCatalog).toHaveLength(6);
    for (const project of projectCatalog) {
      expect(
        routes.find((route) => route.path === `projects/${project.slug}`)?.component,
      ).toBeDefined();
      expect(routes.find((route) => route.path === project.id)?.redirectTo).toBe(project.path);
      for (const page of project.pages) {
        expect(
          routes.find((route) => route.path === `${project.id}/docs/${page.slug}`)?.redirectTo,
        ).toBe(page.path);
      }
    }
  });

  it('navigates legacy routes to the canonical target', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/capacitor-native-ui/docs/setup');
    expect(router.url).toBe('/projects/capacitor-native-ui/docs/setup');
  });

  it('renders a real not-found component instead of redirecting unknown paths to Stripe', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/does-not-exist');
    expect(router.routerState.snapshot.root.firstChild?.component).toBe(NotFoundComponent);
  });
});
