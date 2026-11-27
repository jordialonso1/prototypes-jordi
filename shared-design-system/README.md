# shared-design-system

Components and global styles shared by every prototype in this repo.

- `styles/base.css`: reset, page background, default font. Import once per prototype's `main.tsx`.
- `components/`: `Button` (variants `default`, `primary`, `icon`) and `Checkbox`.
- `index.ts`: barrel export. Use `import { Button } from '@shared'`.

`@shared` is an alias for this folder (set in `vite.config.ts` and `tsconfig.app.json`).

## pintxo/ (CSS components for plain-HTML prototypes)

`pintxo/pintxo.css` holds Pintxo-styled components for prototypes that are plain HTML in an iframe (they can't import the React components above). Values come from uds-react and the tokens of the V2 boilerplate, so keep the boilerplate `<style>` in the prototype.

Link it after the boilerplate styles (adjust the `../` count to the prototype's depth):

```html
<link rel="stylesheet" href="../../shared-design-system/pintxo/pintxo.css" />
```

`vite.config.ts` copies `shared-design-system/pintxo` into `dist` (see `staticDirs`).

| Component | Classes | Notes |
|---|---|---|
| Button | `pintxo-button`, `--primary`, `--s` `--m` `--l`, `--trailing-icon`, `--block` | Neutral by default; `disabled` attribute greys it |
| Icon button | `pintxo-icon-button`, `--s` (32px), `--floating` | 40px with 24px icon by default |
| Counter | `pintxo-counter`, `__button`, `__label`, `--l`, `--collapsed` | xs (32px) by default; `--l` is the 48px one; `--collapsed` is only the trailing "+" (neutral) |
| Banner | `pintxo-banner[data-style]`, `__content`, `__title`, `__description`, `__accessory`, `__blob`, `__art` | neutral, positive, critical, warning, marketing, loyalty, promotion (with illustration) |
| Icon blob | `pintxo-icon-blob[data-style]` | warning, critical (exclamation triangle, 24px) |
| Radio button | `pintxo-radio-button`, `__input`, `__label`, `data-align="right"` | Native input restyled; sync `data-checked`, `data-error`, `data-disabled` |
| Checkbox | `pintxo-checkbox`, `__input`, `__label` | Sync `data-state` (checked, unchecked, indeterminate), `data-error`, `data-disabled` |
| Tag | `pintxo-tag[data-style][data-variant]` | neutral, positive, critical, warning, contrast; primary or secondary |
| Section header | `pintxo-section-header`, `__text`, `__title`, `__description`, `__trailing` | Description and trailing slot optional; `data-state="error"` reds the description |
| Status bar | `pintxo-status-bar`, `__time`, `__levels` | 62px iOS bar; icons in `pintxo/assets/status-bar-*.svg` |
| Text field | `pintxo-text-field`, `__label`, `__control` | 56px input with label; optional trailing icon; focus border green |
| Text button | `pintxo-text-button` | Borderless 14/20 secondary action, optional 16px icon |
| Button group | `pintxo-button-group` | Buttons share the row equally; also icon-only sign-in buttons |
| Home indicator | `pintxo-home-indicator` | iOS 144 x 5 bar; position it yourself |

Usage examples are in the comment above each component in `pintxo.css`. When a prototype needs a new variant, add it there instead of writing local CSS. Used so far by `pna-cna-replacements`; `ai-label-prototype` and `signup-login-flow` still have their own copies.

A live gallery of everything here is at `component-library/` (`/component-library/` in dev). Update it when you add a component.
