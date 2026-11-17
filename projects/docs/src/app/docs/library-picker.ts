import { Component, LOCALE_ID, inject, input, output } from '@angular/core';
import { ProjectCategoryGroup, ProjectSummary } from './docs-data';
import { localizedPublicPath } from '../locale-path';

@Component({
  selector: 'app-library-picker',
  templateUrl: './library-picker.html',
  styleUrl: './library-picker.css',
})
export class LibraryPicker {
  readonly #locale = inject(LOCALE_ID);
  readonly groups = input.required<readonly ProjectCategoryGroup[]>();
  readonly activeProjectId = input<string>();
  readonly activePath = input('/');
  readonly selected = output<ProjectSummary>();
  protected hrefFor(project: ProjectSummary): string {
    return localizedPublicPath(
      this.#locale,
      project.id === this.activeProjectId() ? this.activePath() : project.path,
    );
  }

  protected choose(event: MouseEvent, project: ProjectSummary): void {
    if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    this.selected.emit(project);
  }
}
