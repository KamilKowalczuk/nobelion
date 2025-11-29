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

  vite: {
    plugins: [tailwindcss()], // [cite: 15016]
  },
  output: 'static',
  adapter: netlify(),
});