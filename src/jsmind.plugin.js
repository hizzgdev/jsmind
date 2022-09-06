/**
 * @license BSD
 * @copyright 2014-2022 hizzgdev@163.com
 *
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */

import { $ } from './jsmind.dom.js';

const plugin_data = {
    plugins: [],
};

export function register(plugin) {
    if (!plugin instanceof Plugin) {
        throw new Error('plugin ' + plugin + ' is not a supported plugin');
    }
    plugin_data.plugins.push(plugin);
}

export function apply(jm) {
    $.w.setTimeout(function () {
        _apply(jm);
    }, 0);
}

function _apply(jm) {
    var l = plugin_data.plugins.length;
    var fn_init = null;
    for (var i = 0; i < l; i++) {
        fn_init = plugin_data.plugins[i].init;
        if (typeof fn_init === 'function') {
            fn_init(jm);
        }
    }
}

export class Plugin {
    constructor(name, init) {
        this.name = name;
        this.init = init;
    }
}
