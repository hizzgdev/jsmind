import cleanup from 'rollup-plugin-cleanup';
import terser from '@rollup/plugin-terser';

export default [
    {
        input: 'src/jsmind.js',
        output: {
            name: 'jsMind',
            file: 'es6/jsmind.js',
            format: 'umd',
            banner: '/**\n* @license BSD-3-Clause\n* @copyright 2014-2025 hizzgdev@163.com\n*\n* Project Home:\n*   https://github.com/hizzgdev/jsmind/\n*/',
            sourcemap: true,
        },
        plugins: [
            cleanup({
                comments: 'none',
            }),
            terser({
                output: {
                    comments: 'all',
                },
            }),
        ],
    },
    {
        input: 'src/plugins/jsmind.draggable-node.js',
        output: {
            name: 'jsMindDraggableNode',
            file: 'es6/jsmind.draggable-node.js',
            format: 'umd',
            banner: '/**\n* @license BSD-3-Clause\n* @copyright 2014-2025 hizzgdev@163.com\n*\n* Project Home:\n*   https://github.com/hizzgdev/jsmind/\n*/',
            sourcemap: true,
            globals: {
                jsmind: 'jsMind',
            },
            exports: 'named',
        },
        external: ['jsmind'],
        plugins: [
            cleanup({
                comments: 'none',
            }),
            terser({
                output: {
                    comments: 'all',
                },
            }),
        ],
    },
    {
        input: 'src/plugins/jsmind.screenshot.js',
        output: {
            name: 'jsMindScreenshot',
            file: 'es6/jsmind.screenshot.js',
            format: 'umd',
            banner: '/**\n* @license BSD-3-Clause\n* @copyright 2014-2025 hizzgdev@163.com\n*\n* Project Home:\n*   https://github.com/hizzgdev/jsmind/\n*/',
            sourcemap: true,
            globals: {
                'jsmind': 'jsMind',
                'dom-to-image': 'domtoimage',
            },
            exports: 'named',
        },
        external: ['jsmind', 'dom-to-image'],
        plugins: [
            cleanup({
                comments: 'none',
            }),
            terser({
                output: {
                    comments: 'all',
                },
            }),
        ],
    },
];
