# Screen library

Reusable screens from the prototypes, each one a self-contained module.

```
screens-library/screens/
  _base/          fonts, Pintxo tokens + typography (base.css), small behaviours (base.js)
  <screen>/       index.html, screen.css (pruned to what the screen uses), assets/
```

## Reuse a screen in a new prototype
1. Copy `screens/<screen>/` and `screens/_base/` next to your prototype (keep them side by side, since the pages link `../_base/`).
2. Open or embed `<screen>/index.html`, or paste its `.prototype-viewport` markup into your page and keep `screen.css`.
3. Navigation is intentionally not wired: add your own `click` handlers.

Cart also links the shared Pintxo components (`shared-design-system/pintxo/pintxo.css`).

## Add a screen
Create `screens/<id>/` with the same files and add an entry to `src/screens.ts`.
