/*
 * @Author: lyttonlee lzr3278@163.com
 * @Date: 2022-08-31 11:32:02
 * @LastEditors: lyttonlee lzr3278@163.com
 * @LastEditTime: 2022-09-23 11:04:06
 * @FilePath: \jsmind\.config\rollup.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import cleanup from 'rollup-plugin-cleanup';
import { terser } from 'rollup-plugin-terser';
import ts from 'rollup-plugin-typescript2';

export default [
    {
        input: 'src/jsmind.js',
        output: [
            {
                name: 'jsMind',
                file: 'dist/jsmind.umd.js',
                format: 'umd',
                banner: '/**\n* @license BSD-3-Clause\n* @copyright 2014-2022 hizzgdev@163.com\n*\n* Project Home:\n*   https://github.com/hizzgdev/jsmind/\n*/',
                sourcemap: true,
            },
            {
                file: 'dist/jsmind.esm.js',
                format: 'module',
            },
        ],
        plugins: [
            ts(),
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
        output: [
            {
                file: 'dist/plugins/jsmind.draggable.iife.js',
                format: 'iife',
                banner: '/**\n* @license BSD-3-Clause\n* @copyright 2014-2022 hizzgdev@163.com\n*\n* Project Home:\n*   https://github.com/hizzgdev/jsmind/\n*/',
                sourcemap: true,
            },
            {
                file: 'dist/plugins/jsmind.draggable.esm.js',
                format: 'module',
            },
        ],
        plugins: [
            ts(),
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
        output: [
            {
                file: 'dist/plugins/jsmind.screenshot.iife.js',
                format: 'iife',
                banner: '/**\n* @license BSD-3-Clause\n* @copyright 2014-2022 hizzgdev@163.com\n*\n* Project Home:\n*   https://github.com/hizzgdev/jsmind/\n*/',
                sourcemap: true,
            },
            {
                file: 'dist/plugins/jsmind.screenshot.esm.js',
                format: 'module',
            },
        ],
        plugins: [
            ts(),
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
