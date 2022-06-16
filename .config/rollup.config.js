import cleanup from 'rollup-plugin-cleanup';
import { terser } from 'rollup-plugin-terser';

export default [
    {
        input: 'src/jsmind.js',
        output: {
            name: 'jsMind',
            file: 'es6/jsmind.js',
            format: 'umd',
            banner: '/**\n* @license BSD-3-Clause\n* @copyright 2014-2022 hizzgdev@163.com\n*\n* Project Home:\n*   https://github.com/hizzgdev/jsmind/\n*/',
            sourcemap: false,
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
        input: 'src/plugins/jsmind.draggable.js',
        output: {
            file: 'es6/jsmind.draggable.js',
            format: 'cjs',
            banner: '/**\n* @license BSD-3-Clause\n* @copyright 2014-2022 hizzgdev@163.com\n*\n* Project Home:\n*   https://github.com/hizzgdev/jsmind/\n*/',
            sourcemap: false,
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
        input: 'src/plugins/jsmind.screenshot.js',
        output: {
            file: 'es6/jsmind.screenshot.js',
            format: 'cjs',
            banner: '/**\n* @license BSD-3-Clause\n* @copyright 2014-2022 hizzgdev@163.com\n*\n* Project Home:\n*   https://github.com/hizzgdev/jsmind/\n*/',
            sourcemap: false,
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
    //浏览器使用
    {
        input: 'src/jsmind.js',
        output: {
            name: 'jsMind',
            file: 'js/jsmind.js',
            format: 'iife',
            banner: '/**\n* @license BSD-3-Clause\n* @copyright 2014-2022 hizzgdev@163.com\n*\n* Project Home:\n*   https://github.com/hizzgdev/jsmind/\n*/',
            sourcemap: false,
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
        input: 'src/plugins/jsmind.draggable.iife.js',
        output: {
            file: 'js/jsmind.draggable.js',
            format: 'iife',
            banner: '/**\n* @license BSD-3-Clause\n* @copyright 2014-2022 hizzgdev@163.com\n*\n* Project Home:\n*   https://github.com/hizzgdev/jsmind/\n*/',
            sourcemap: false,
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
        input: 'src/plugins/jsmind.screenshot.iife.js',
        output: {
            file: 'js/jsmind.screenshot.js',
            format: 'iife',
            banner: '/**\n* @license BSD-3-Clause\n* @copyright 2014-2022 hizzgdev@163.com\n*\n* Project Home:\n*   https://github.com/hizzgdev/jsmind/\n*/',
            sourcemap: false,
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
];
