// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // sitemap integration will be added once @astrojs/sitemap finishes installing
  site: 'https://centedge.co.in',

  integrations: [sitemap()]
});