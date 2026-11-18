import { initialize } from '@ionic/core/components';
import { defineCustomElement as defineToggle } from '@ionic/core/components/ion-toggle.js';
import { defineCustomElement as defineRange } from '@ionic/core/components/ion-range.js';
import { defineCustomElement as defineCheckbox } from '@ionic/core/components/ion-checkbox.js';

const mode = location.hash === '#md' ? 'md' : 'ios';
const labels = {
  en: ['Notifications', 'Volume', 'Vibration'],
  ja: ['通知', '音量', 'バイブレーション'],
  fr: ['Notifications', 'Volume', 'Vibration'],
  de: ['Mitteilungen', 'Lautstärke', 'Vibration'],
};
const lang = window.frameElement?.getAttribute('lang') ?? 'en';
document.documentElement.lang = lang;
initialize({ mode });
const [notifications, volume, vibration] = labels[lang as keyof typeof labels] ?? labels.en;
const stylesheet = document.createElement('link');
stylesheet.rel = 'stylesheet';
stylesheet.href = mode + '.css';
document.head.append(stylesheet);
const toggle = document.querySelector('ion-toggle')!;
const range = document.querySelector('ion-range')!;
const checkbox = document.querySelector('ion-checkbox')!;
for (const element of [toggle, range, checkbox]) element.setAttribute('mode', mode);
toggle.textContent = notifications;
checkbox.textContent = vibration;
range.setAttribute('aria-label', volume);
document.querySelector('label')!.textContent = volume;
range.addEventListener('ionInput', (event) => {
  document.querySelector('output')!.textContent = String((event as CustomEvent).detail.value) + '%';
});
defineToggle();
defineRange();
defineCheckbox();
