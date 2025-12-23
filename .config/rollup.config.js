import cleanup from 'rollup-plugin-cleanup';
import terser from '@rollup/plugin-terser';

const banner =
    '/**\n* @license BSD-3-Clause\n* @copyright 2014-2025 hizzgdev@163.com\n*\n* Project Home:\n*   https://github.com/hizzgdev/jsmind/\n*/';

const cleanupPlugin = cleanup({
    comments: 'none',
});

const terserPlugin = terser({
    output: {
        comments: 'all',
    },
});

// Main library configuration
const mainConfig = {
    input: 'src/jsmind.js',
    output: [
        // ES Module - for modern bundlers with tree-shaking support
        {
            file: 'es/jsmind.js',
            format: 'es',
            banner,
            sourcemap: true,
        },
        // CommonJS - for require/legacy toolchains
        {
            file: 'lib/jsmind.js',
            format: 'cjs',
            banner,
            sourcemap: true,
            exports: 'auto',
        },
        // UMD - for direct <script> usage, exposes global jsMind
        {
            name: 'jsMind',
            file: 'dist/jsmind.js',
            format: 'umd',
            banner,
            sourcemap: true,
        },
    ],
    plugins: [cleanupPlugin, terserPlugin],
};

// Draggable-node plugin configuration
const draggableNodeConfig = {
    input: 'src/plugins/jsmind.draggable-node.js',
    output: [
        // ES Module
        {
            file: 'es/jsmind.draggable-node.js',
            format: 'es',
            banner,
            sourcemap: true,
        },
        // CommonJS
        {
            file: 'lib/jsmind.draggable-node.js',
            format: 'cjs',
            banner,
            sourcemap: true,
            exports: 'named',
        },
        // UMD
        {
            name: 'jsMindDraggableNode',
            file: 'dist/jsmind.draggable-node.js',
            format: 'umd',
            banner,
            sourcemap: true,
            globals: {
                jsmind: 'jsMind',
            },
            exports: 'named',
        },
    ],
    external: ['jsmind'],
    plugins: [cleanupPlugin, terserPlugin],
};

// Screenshot plugin configuration
const screenshotConfig = {
    input: 'src/plugins/jsmind.screenshot.js',
    output: [
        // ES Module
        {
            file: 'es/jsmind.screenshot.js',
            format: 'es',
            banner,
            sourcemap: true,
        },
        // CommonJS
        {
            file: 'lib/jsmind.screenshot.js',
            format: 'cjs',
            banner,
            sourcemap: true,
            exports: 'named',
        },
        // UMD
        {
            name: 'jsMindScreenshot',
            file: 'dist/jsmind.screenshot.js',
            format: 'umd',
            banner,
            sourcemap: true,
            globals: {
                'jsmind': 'jsMind',
                'dom-to-image': 'domtoimage',
            },
            exports: 'named',
        },
    ],
    external: ['jsmind', 'dom-to-image'],
    plugins: [cleanupPlugin, terserPlugin],
};

export default [mainConfig, draggableNodeConfig, screenshotConfig];
