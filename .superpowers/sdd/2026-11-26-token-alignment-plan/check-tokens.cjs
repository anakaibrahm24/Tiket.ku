const fs = require('fs');
const assert = require('assert');

const design = fs.readFileSync('DESIGN.md', 'utf8');
const css = fs.readFileSync('src/app.css', 'utf8');

const designTokens = [
  'light-inverse-surface',
  'light-inverse-on-surface',
  'light-outline-variant',
  'dark-outline-variant',
  'dark-surface-container',
  'gutter-xs',
  'gutter-xl',
  'page-margin',
  'display-lg',
  'headline-lg-mobile',
  'headline-md',
  'mono-sm',
  'DEFAULT',
];
for (const token of designTokens) {
  assert.ok(design.includes(token), `DESIGN.md missing token: ${token}`);
}

const cssTokens = [
  '--color-light-inverse-surface',
  '--color-light-inverse-on-surface',
  '--color-light-outline-variant',
  '--color-dark-outline-variant',
  '--color-dark-surface-container',
  '--spacing-gutter-xs',
  '--spacing-gutter-xl',
  '--text-headline-md',
  '--font-title',
  '@utility duration-state-change',
  '@utility ease-state-change',
];
for (const token of cssTokens) {
  assert.ok(css.includes(token), `app.css missing token: ${token}`);
}

console.log('token alignment OK');
