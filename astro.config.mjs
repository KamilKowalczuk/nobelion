// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';

import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({

  site: 'https://nobelion.pl',
  integrations: [svelte(), sitemap()],

  build: {
    // CSS w <head> blokował renderowanie (~1,1 s na 4G) — inline eliminuje
    // dodatkowe round-tripy i pozwala od razu odkryć fonty.
    inlineStylesheets: 'always',
  },

  vite: {
    plugins: [tailwindcss()],
  },
  adapter: netlify(),
});
