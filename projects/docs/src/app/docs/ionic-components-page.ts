import { Component, computed, effect, inject, LOCALE_ID, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catalog, revision } from '../generated/ionic-components/catalog';
import { localizedPublicPath } from '../locale-path';
import { IonicComponentDemo, type IonicDemo } from './ionic-component-demo';
import { SeoService } from './seo.service';

import { IonicArticleTabs, type ArticleTabs } from './ionic-article-tabs';

type Block = ArticleTabs | IonicDemo | {kind:'html';html:string} | {kind:'heading';id:string;level:number;text:string};

@Component({
  imports: [IonicComponentDemo, IonicArticleTabs, RouterLink, NgTemplateOutlet],
  styleUrls: ['./guide-article.css','./ionic-components-page.css'],
  template: `
    <ng-template #sourceNote>
      <aside class="source-note" [attr.lang]="locale">
        <div class="source-copy">
          <span class="source-title" i18n="@@ionicComponentSourceTitle">From the official Ionic Docs</span>
          <span i18n="@@ionicComponentDemoCredit">Live demos use WebView Native UI themes.</span>
        </div>
        <a [href]="officialUrl()"><span i18n="@@ionicComponentOriginal">View original</span><span aria-hidden="true">↗</span></a>
      </aside>
    </ng-template>
    @if (entry(); as item) {
      <div class="setup-layout" lang="en">
        <header class="setup-header"><ng-container [ngTemplateOutlet]="sourceNote" /><a class="guide-kind" routerLink="/components">Components</a><h1>{{ item.title }}</h1></header>
        <nav class="setup-toc" aria-label="On this page"><p>On this page</p><ol>
          @for (b of blocks(); track $index) { @if (b.kind==='heading' && b.level===2) {
            <li><a [href]="path()+'#'+b.id">{{ b.text }}</a></li>
          } }
        </ol></nav>
        <article class="docs-page-article znc min-w-0">
          @for (b of blocks(); track $index) {
            @switch (b.kind) {
              @case ('html') { <div [innerHTML]="b.html"></div> }
              @case ('heading') {
                @switch (b.level) {
                  @case (2) {<h2 [id]="b.id">{{ b.text }}</h2>}
                  @case (3) {<h3 [id]="b.id">{{ b.text }}</h3>}
                  @default {<h4 [id]="b.id">{{ b.text }}</h4>}
                }
              }
              @case ('tabs') {<app-ionic-article-tabs [group]="b"/>}
              @case ('demo') {<app-ionic-component-demo [demo]="b"/>}
            }
          }
          <footer><a [href]="source+item.slug+'.mdx'">Source on Ionic Docs</a> · <a href="/assets/ionic-components/LICENSE">Apache 2.0</a> · <a href="/assets/ionic-components/NOTICE.txt">Third-party notices</a></footer>
        </article>
      </div>
    } @else {
      <div class="directory"><header class="setup-header"><ng-container [ngTemplateOutlet]="sourceNote" /><h1>Components</h1></header>
        <input type="search" aria-label="Filter components" placeholder="Filter components" [value]="query()" (input)="query.set($any($event.target).value)"/>
        <ul>@for (item of filtered(); track item.slug) {<li><a [routerLink]="['/components',item.slug]">{{ item.title }}</a></li>}</ul>
      </div>
    }
  `,
})
export class IonicComponentsPage {
  readonly catalog = catalog;
  readonly query = signal('');
  readonly filtered = computed(() => this.catalog.filter(item => item.title.toLowerCase().includes(this.query().trim().toLowerCase())));
  readonly source = 'https://github.com/ionic-team/ionic-docs/blob/'+revision+'/docs/api/';
  readonly #locale = inject(LOCALE_ID);
  readonly #data = toSignal(inject(ActivatedRoute).data);
  readonly entry = computed(() => this.catalog.find(e=>e.slug===this.#data()?.['slug']));
  protected readonly locale = this.#locale;
  readonly officialUrl = computed(() => 'https://ionicframework.com/docs/' + (this.entry() ? 'api/' + this.entry()!.slug : 'components'));
  readonly path = computed(() => localizedPublicPath(this.#locale,'/components'+(this.entry()?'/'+this.entry()!.slug:'')));
  readonly blocks = computed(() => {
    const articlePath = this.path();
    const directoryPath = localizedPublicPath(this.#locale, '/components');
    // A fragment in generated HTML otherwise resolves against the site's <base>.
    const localizeLinks = (html: string) => html.replace(
      /(<a\b[^>]*?\shref=")(#|\/components\/)/gi,
      (_, start: string, target: string) => start + (target === '#' ? articlePath + '#' : directoryPath + '/'),
    );
    const blocks = (this.#data()?.['blocks'] ?? []) as Block[];
    return blocks.map(block => {
      if (block.kind === 'html') return { ...block, html: localizeLinks(block.html) };
      if (block.kind === 'tabs') return {
        ...block,
        panels: block.panels.map(panel => ({ ...panel, html: localizeLinks(panel.html) })),
      };
      return block;
    });
  });
  readonly #seo = inject(SeoService);
  constructor() {
    effect(()=>this.#seo.setPage({title:this.entry()?.title ?? 'Components',description:this.entry()?.description ?? 'Ionic components with iOS and Material Design theme previews.',path:'/components'+(this.entry()?'/'+this.entry()!.slug:'')}));
  }
}
