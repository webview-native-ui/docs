import { initialize } from './vendor/ionic/components/index.js';
import { defineCustomElement as app } from './vendor/ionic/components/ion-app.js';
import { defineCustomElement as header } from './vendor/ionic/components/ion-header.js';
import { defineCustomElement as toolbar } from './vendor/ionic/components/ion-toolbar.js';
import { defineCustomElement as title } from './vendor/ionic/components/ion-title.js';
import { defineCustomElement as content } from './vendor/ionic/components/ion-content.js';
import { defineCustomElement as list } from './vendor/ionic/components/ion-list.js';
import { defineCustomElement as listHeader } from './vendor/ionic/components/ion-list-header.js';
import { defineCustomElement as label } from './vendor/ionic/components/ion-label.js';
import { defineCustomElement as item } from './vendor/ionic/components/ion-item.js';
import { defineCustomElement as itemGroup } from './vendor/ionic/components/ion-item-group.js';
import { defineCustomElement as badge } from './vendor/ionic/components/ion-badge.js';
import { defineCustomElement as toggle } from './vendor/ionic/components/ion-toggle.js';
import { defineCustomElement as button } from './vendor/ionic/components/ion-button.js';
import { defineCustomElement as footer } from './vendor/ionic/components/ion-footer.js';
import { defineCustomElement as segment } from './vendor/ionic/components/ion-segment.js';
import { defineCustomElement as segmentButton } from './vendor/ionic/components/ion-segment-button.js';

const params = new URLSearchParams(location.search);
const mode = params.get('mode') === 'md' ? 'md' : 'ios';
const themed = params.get('theme') === 'on';
const translations = {
  en: {
    settings: 'Settings',
    workspace: 'Workspace',
    team: 'Design team',
    members: '8 members',
    preferences: 'Preferences',
    notifications: 'Notifications',
    offline: 'Offline access',
    save: 'Save changes',
    saved: 'Changes saved in this preview.',
    home: 'Home',
    homeStatus: 'Home selected in this preview.',
  },
  ja: {
    settings: '設定',
    workspace: 'ワークスペース',
    team: 'デザインチーム',
    members: 'メンバー8人',
    preferences: '環境設定',
    notifications: '通知',
    offline: 'オフライン利用',
    save: '変更を保存',
    saved: 'プレビュー内で保存しました。',
    home: 'ホーム',
    homeStatus: 'プレビュー内でホームを選択しました。',
  },
  fr: {
    settings: 'Réglages',
    workspace: 'Espace de travail',
    team: 'Équipe design',
    members: '8 membres',
    preferences: 'Préférences',
    notifications: 'Notifications',
    offline: 'Accès hors ligne',
    save: 'Enregistrer',
    saved: 'Modifications enregistrées dans cet aperçu.',
    home: 'Accueil',
    homeStatus: 'Accueil sélectionné dans cet aperçu.',
  },
  de: {
    settings: 'Einstellungen',
    workspace: 'Arbeitsbereich',
    team: 'Designteam',
    members: '8 Mitglieder',
    preferences: 'Präferenzen',
    notifications: 'Mitteilungen',
    offline: 'Offline-Zugriff',
    save: 'Speichern',
    saved: 'Änderungen in dieser Vorschau gespeichert.',
    home: 'Start',
    homeStatus: 'Start in dieser Vorschau ausgewählt.',
  },
};
const locale = Object.hasOwn(translations, params.get('lang')) ? params.get('lang') : 'en';
const copy = translations[locale];
document.documentElement.lang = locale;
document.documentElement.classList.add(mode);
for (const element of document.querySelectorAll('[data-copy]'))
  element.textContent = copy[element.dataset.copy];
if (themed) {
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href =
    mode === 'ios' ? '/previews/theme/vendor/ios27.css' : '/previews/theme/vendor/md3.css';
  document.head.append(stylesheet);
  await new Promise((resolve, reject) => {
    stylesheet.onload = resolve;
    stylesheet.onerror = reject;
  });
}
initialize({ mode, animated: !matchMedia('(prefers-reduced-motion: reduce)').matches });
for (const define of [
  app,
  header,
  toolbar,
  title,
  content,
  list,
  listHeader,
  label,
  item,
  itemGroup,
  badge,
  toggle,
  button,
  footer,
  segment,
  segmentButton,
])
  define();
document.querySelector('#save').addEventListener('click', () => {
  document.querySelector('#status').textContent = copy.saved;
});
document.querySelector('ion-segment').addEventListener('ionChange', (event) => {
  document.querySelector('#status').textContent =
    event.detail.value === 'home' ? copy.homeStatus : '';
});
