import { afterNextRender, Component, inject, Injector, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { catalog } from '../generated/ionic-components/catalog';

@Component({
  selector: 'app-ionic-components-navigation',
  imports: [RouterLink, RouterLinkActive],
  styleUrl: './project-navigation.css',
  template: `
    <div class="project-navigation-heading">
      <button type="button" class="project-navigation-back" (click)="back.emit()">
        <span aria-hidden="true">‹</span><span i18n="@@documentation">Documentation</span>
      </button>
      <div class="project-navigation-title"><p>Components</p></div>
    </div>
    <nav class="project-navigation-pages" aria-label="Components">
      @for (item of catalog; track item.slug) {
        <a #link [routerLink]="['/components', item.slug]" routerLinkActive="is-active"
          ariaCurrentWhenActive="page" (isActiveChange)="reveal($event, link)">{{ item.title }}</a>
      }
    </nav>
  `,
})
export class IonicComponentsNavigation {
  readonly catalog = catalog;
  readonly back = output<void>();
  readonly #injector = inject(Injector);
  reveal(active: boolean, link: HTMLAnchorElement) {
    if (active) afterNextRender(() => {
      const list = link.parentElement;
      if (!list) return;
      const row = link.getBoundingClientRect();
      const bounds = list.getBoundingClientRect();
      if (row.bottom > bounds.bottom) list.scrollTop += row.bottom - bounds.bottom + 12;
      else if (row.top < bounds.top) list.scrollTop -= bounds.top - row.top + 12;
    }, {injector:this.#injector});
  }
}
