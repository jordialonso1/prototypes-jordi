# Screen library

Reusable screens from the prototypes, each one a self-contained module.

```
screens-library/screens/
  _base/          fonts, Pintxo tokens + typography (base.css), small behaviours (base.js)
  <screen>/       index.html, screen.css (pruned to what the screen uses), assets/
```

## Using a screen in a prototype (rules for Claude)
- **Default: embed.** Load the library module as it is (for example an iframe to `screens-library/screens/<screen>/index.html`, same pattern as the library page). Do not copy it. The screen then stays in sync with the library.
- **Iterating on a screen: do it at prototype level.** If the user wants changes to a screen inside a prototype, copy `screens/<screen>/` and `screens/_base/` into that prototype (keep them side by side, since the pages link `../_base/`) and edit the copy. The copy no longer follows the library.
- **Never modify `screens-library/screens/` unless the user explicitly says to change the shared screen.** A change there affects every prototype that embeds it.
- Navigation is intentionally not wired in the modules: a prototype adds its own click handlers around the embed or on its copy.

Cart also links the shared Pintxo components (`shared-design-system/pintxo/pintxo.css`).

## Add a screen
Create `screens/<id>/` with the same files and add an entry to `src/screens.ts`.
