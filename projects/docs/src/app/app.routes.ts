import { Routes } from '@angular/router';
import { DocsPageComponent } from './docs/docs-page';
import { LandingPageComponent } from './docs/landing-page';
import { NotFoundComponent } from './docs/not-found';
import { PluginIndexComponent } from './docs/plugin-index';
import { projectCatalog } from './docs/docs-data';
import { projectResolver } from './docs/project.resolver';

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
  ...projectLegacyRoutes,
  ...projectRoutes,
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent },
];
