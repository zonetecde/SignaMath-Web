// src/lib/i18n/index.ts
import { browser } from '$app/environment';
import { init, register } from 'svelte-i18n';

const defaultLocale = 'fr';

register('fr', () => import('./locales/fr.json'));
register('en', () => import('./locales/en.json'));
register('de', () => import('./locales/de.json'));
register('es', () => import('./locales/es.json'));
register('cn', () => import('./locales/cn.json'));

init({
	fallbackLocale: defaultLocale,
	initialLocale: browser ? window.navigator.language : defaultLocale
});
