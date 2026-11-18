import { GUIDE_CHAPTERS } from '../../../../shared/guide-navigation';
import { inject, LOCALE_ID } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { DocsPageComponent } from './docs/docs-page';
import { LandingPageComponent } from './docs/landing-page';
import { NotFoundComponent } from './docs/not-found';
import { PluginIndexComponent } from './docs/plugin-index';
import { projectCatalog } from './docs/docs-data';
import { projectResolver } from './docs/project.resolver';

import { catalog as ionicComponents } from './generated/ionic-components/catalog';

const componentPage = () =>
  import('./docs/ionic-components-page').then((m) => m.IonicComponentsPage);
const portalProjects = projectCatalog.filter((project) => !project.hostedUrl);

const projectRoutes: Routes = portalProjects.flatMap((project) => [
  {
    path: `projects/${project.slug}`,
    component: LandingPageComponent,
    data: { projectId: project.id },
    resolve: { project: projectResolver },
  },
  ...project.pages.map((page) => ({
    path: `projects/${project.slug}/docs/${page.slug}`,
    component: DocsPageComponent,
    data: { projectId: project.id, pageSlug: page.slug },
    resolve: { project: projectResolver },
  })),
]);

const projectLegacyRoutes: Routes = portalProjects.flatMap((project) => [
  {
    path: project.id,
    redirectTo: project.path,
    pathMatch: 'full' as const,
  },
  ...project.pages.map((page) => ({
    path: `${project.id}/docs/${page.slug}`,
    redirectTo: page.path,
    pathMatch: 'full' as const,
  })),
]);

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: PluginIndexComponent },
  { path: 'projects', pathMatch: 'full', redirectTo: '' },
  {
    path: 'support',
    loadComponent: () =>
      import('./docs/support-page').then(({ SupportPageComponent }) => SupportPageComponent),
  },
  {
    path: 'standard-setup',
    loadComponent: () =>
      import('./docs/standard-setup-page').then((module) => module.StandardSetupPageComponent),
  },
  ...['native-ui', 'device-layout'].map((id) => ({
    path: `guides/${id}`,
    pathMatch: 'full' as const,
    redirectTo: () =>
      inject(Router).createUrlTree(['/standard-setup'], { fragment: 'verify-installation' }),
  })),
  ...GUIDE_CHAPTERS.map((chapter) => ({
    path: `guides/${chapter.id}`,
    data: { chapter: chapter.id },
    loadComponent: () => import('./docs/guide-page').then((module) => module.GuidePageComponent),
  })),
  { path: 'components', loadComponent: componentPage },
  ...ionicComponents.map((item) => ({
    path: 'components/' + item.slug,
    data: { slug: item.slug },
    resolve: {
      blocks: () =>
        inject(LOCALE_ID).split('-')[0] === 'ja'
          ? import('./generated/ionic-components/ja/catalog').then(({ catalog }) =>
              catalog.find((entry) => entry.slug === item.slug)!.load(),
            )
          : item.load(),
    },
    loadComponent: componentPage,
  })),
  ...projectLegacyRoutes,
  ...projectRoutes,
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent },
];
