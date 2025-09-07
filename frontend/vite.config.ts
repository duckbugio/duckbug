import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'node:path';
import prism from 'vite-plugin-prismjs';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/',
    publicDir: './public',
    server: {
        host: true,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
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
    optimizeDeps: {
        //workaround for the problem https://github.com/vitejs/vite/issues/7719
        extensions: ['.css'],
        esbuildOptions: {
            plugins: [
                (await import('esbuild-sass-plugin')).sassPlugin({
                    type: 'style',
                }),
            ],
        },
    },
});
