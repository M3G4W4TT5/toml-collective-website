import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { loadEnv } from 'vite';
import { readSiteConfig } from './config/site.mjs';

const site = readSiteConfig(loadEnv(process.env.NODE_ENV || 'production', process.cwd(), ''));

export default defineConfig({
  output: 'static',
  integrations: [react()],
  site: site.url,
});
