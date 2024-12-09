// @ts-check
import mkcert from 'vite-plugin-mkcert';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    vite: {
        plugins: [mkcert()],
        server: {
            https: true
        },
    },
});
