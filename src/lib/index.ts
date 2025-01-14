import { writable, type Writable } from 'svelte/store';

export const resultatDirect = writable(false);
export const isFetching = writable(false);

export const functionNameHook = writable('f');
export const variableNameHook = writable('x');
