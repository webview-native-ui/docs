import { Component, LOCALE_ID, inject } from '@angular/core';
import { guideCopyForLocale } from '../../../../../shared/guide-navigation';
import { localizedPublicPath } from '../locale-path';

@Component({
  selector: 'app-guide-context',
  template: `<aside class="border-b border-slate-200 px-6 py-3 text-sm text-slate-600" data-pagefind-ignore><a [href]="home">{{ copy.overview }}</a> · <a [href]="setup"><span i18n="@@combinedSetupContext">Ionic + Capacitor standard setup</span></a></aside>`,
})
export class GuideContextComponent {
  readonly #locale = inject(LOCALE_ID);
  protected readonly copy = guideCopyForLocale(this.#locale);
  protected readonly home = localizedPublicPath(this.#locale, '/');
  protected readonly setup = localizedPublicPath(this.#locale, '/standard-setup');
}
