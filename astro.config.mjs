// @ts-check
import mkcert from 'vite-plugin-mkcert';
import alpine from '@astrojs/alpinejs';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import robotsConfig from './robots-txt.config';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    site: 'https://astro-starter-kit.calvin-kamp.com',
    vite: {
        plugins: [mkcert()],
        server: {
            https: true,
        },
    },
    integrations: [alpine(), sitemap(), robotsTxt(robotsConfig)]
});
