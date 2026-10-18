// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import { loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
const site = env.SITE_URL || (env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined);

export default defineConfig({
  site,
  output: 'static',
  devToolbar: { enabled: false },
  compressHTML: true,
  integrations: [mdx(), ...(site ? [sitemap()] : []), react()],

  fonts: [{
    provider: fontProviders.local(),
    name: 'Atkinson',
    cssVariable: '--font-atkinson',
    fallbacks: ['sans-serif'],
    options: {
      variants: [{
        src: ['./src/assets/fonts/atkinson-regular.woff'],
        weight: 400,
        style: 'normal',
        display: 'swap',
      }, {
        src: ['./src/assets/fonts/atkinson-bold.woff'],
        weight: 700,
        style: 'normal',
        display: 'swap',
      }],
    },
  }],
  vite: { plugins: [tailwindcss()] },
});
