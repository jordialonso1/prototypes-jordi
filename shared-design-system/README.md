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
| Counter | `pintxo-counter`, `__button`, `__label`, `--l` | xs (32px) by default; `--l` is the 48px one |
| Banner | `pintxo-banner[data-style]`, `__content`, `__title`, `__description` | neutral, positive, critical, warning, marketing, loyalty |
| Icon blob | `pintxo-icon-blob[data-style]` | warning, critical (exclamation triangle, 24px) |

Usage examples are in the comment above each component in `pintxo.css`. When a prototype needs a new variant, add it there instead of writing local CSS. Used so far by `pna-cna-replacements`; `ai-label-prototype` and `signup-login-flow` still have their own copies.

A live gallery of everything here is at `component-library/` (`/component-library/` in dev). Update it when you add a component.
