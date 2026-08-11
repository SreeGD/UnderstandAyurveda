import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

/**
 * Emits the SPA fallbacks a static host needs, so the same `dist/` deploys to
 * GitHub Pages or Netlify with no server configuration (research.md R6).
 *   - 404.html  : GitHub Pages serves this for unknown paths; it is index.html.
 *   - _redirects: Netlify rewrites everything to index.html with a 200.
 */
function staticHostFallbacks(): Plugin {
  return {
    name: 'static-host-fallbacks',
    apply: 'build',
    closeBundle() {
      const index = resolve(__dirname, 'dist/index.html')
      if (existsSync(index)) {
        copyFileSync(index, resolve(__dirname, 'dist/404.html'))
      }
    },
  }
}

/**
 * Where the site is served from.
 *
 * A GitHub Pages *project* site lives at a subpath
 * (sreegd.github.io/UnderstandAyurveda/), so assets and routes need that prefix.
 * A *custom domain* serves from the root, and keeping the subpath there would
 * 404 every asset.
 *
 * `public/CNAME` is the single source of truth: GitHub requires that file to
 * serve a custom domain, so its presence is exactly the condition under which
 * the base must be '/'. Adding the domain is therefore one file, and the two
 * settings cannot drift out of step.
 */
const customDomain = existsSync(resolve(__dirname, 'public/CNAME'))
const base = customDomain ? '/' : (process.env.PAGES_BASE ?? '/')

export default defineConfig({
  base,
  plugins: [
    react(),
    staticHostFallbacks(),
    VitePWA({
      registerType: 'autoUpdate',
      // Precache the entire build. There are no external requests to cache at
      // runtime — the app never talks to a network (Principle V), so
      // precache-everything is both the simplest and the complete strategy.
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        runtimeCaching: [],
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: 'UnderstandAyurveda',
        short_name: 'Ayurveda',
        description:
          'Learn Ayurveda fundamentals, discover your dosha profile, adjust your lifestyle. Educational, not medical advice.',
        theme_color: '#1f4d3d',
        background_color: '#fbf9f4',
        display: 'standalone',
        start_url: base,
        icons: [],
      },
    }),
  ],
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
  build: {
    target: 'es2022',
    // Bundle budget from plan.md: 250KB gzipped JS excluding content data.
    // Vite reports gzip sizes; this warns well before we approach it.
    chunkSizeWarningLimit: 700,
  },
})
