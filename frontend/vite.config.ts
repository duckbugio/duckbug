import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import prism from 'vite-plugin-prismjs';
import {URL as NodeURL, fileURLToPath} from 'url';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/',
    publicDir: './public',
    server: {
        host: '0.0.0.0',
        port: 5173,
        allowedHosts: ['frontend-node', 'localhost', '127.0.0.1'],
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new NodeURL('./src', import.meta.url)),
        },
    },
    plugins: [
        svgr(),
        react(),
        prism({
            languages: ['javascript', 'css', 'html', 'typescript', 'php'],
            plugins: ['line-numbers'],
            theme: 'okaidia',
            css: true,
        }),
    ],
});
