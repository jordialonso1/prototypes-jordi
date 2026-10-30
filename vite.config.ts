import { cpSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const root = import.meta.dirname

/* Every prototype is a folder with its own index.html. Add new ones here. */
const prototypes = ['ai-label-prototype', 'signup-login-flow']

/* Extra bundled HTML entries (React prototypes rendered inside an iframe). */
const extraInputs = { 'signup-login-flow-prototype': 'signup-login-flow/prototype/index.html' }

/* uds-react is consumed from its source clone (it is not on a public
   registry). Keep in sync with the "paths" in tsconfig.app.json. */
const udsSrc = '/Users/jordi/claude-projects/uds-react/src'

/* Plain static folders (not bundled, e.g. HTML loaded in an iframe) that must
   be copied as-is into dist. In dev Vite already serves them from the root. */
const staticDirs = ['ai-label-prototype/prototype']

function copyStaticDirs(): Plugin {
  return {
    name: 'copy-static-dirs',
    apply: 'build',
    closeBundle() {
      for (const dir of staticDirs) {
        const from = resolve(root, dir)
        if (existsSync(from)) {
          cpSync(from, resolve(root, 'dist', dir), { recursive: true })
        }
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react(), copyStaticDirs()],
  // Relative base so the built site works under a sub-path (GitHub Pages).
  base: command === 'build' ? './' : '/',
  resolve: {
    alias: { '@shared': resolve(root, 'shared-design-system'), '@uds': udsSrc },
    // uds-react sources live outside this repo: resolve their bare imports here.
    dedupe: ['react', 'react-dom', 'classnames', 'uuid'],
  },
  server: { fs: { allow: [root, udsSrc] } },
  // uds-react's own tsconfig extends a private package. A string tsconfigRaw
  // makes Vite skip the per-file tsconfig lookup.
  esbuild: { tsconfigRaw: JSON.stringify({ compilerOptions: { jsx: 'react-jsx' } }) },
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        ...Object.fromEntries(
          prototypes.map((name) => [name, resolve(root, name, 'index.html')]),
        ),
        ...Object.fromEntries(
          Object.entries(extraInputs).map(([name, file]) => [name, resolve(root, file)]),
        ),
      },
    },
  },
}))
