/**
 * @license BSD
 * @copyright 2014-2025 hizzgdev@163.com
 *
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */

import { $ } from './jsmind.dom.js';

/** @type {{ plugins: Array<Plugin<object>> }} */
const plugin_data = {
    plugins: [],
};

/**
 * Register a plugin instance.
 * @param {Plugin<object>} plugin
 */
export function register(plugin) {
    if (!(plugin instanceof Plugin)) {
        throw new Error('can not register plugin, it is not an instance of Plugin');
    }
    if (plugin_data.plugins.map(p => p.name).includes(plugin.name)) {
        throw new Error('can not register plugin ' + plugin.name + ': plugin name already exist');
    }
    plugin_data.plugins.push(plugin);
}

/**
 * Apply registered plugins asynchronously.
 * @param {import('./jsmind.js').default} jm
 * @param {Record<string, object>} options
 */
export function apply(jm, options) {
    $.w.setTimeout(function () {
        _apply(jm, options);
    }, 0);
}

/** 
 * @param {import('./jsmind.js').default} jm
 * @param {Record<string, object>} options */
function _apply(jm, options) {
    plugin_data.plugins.forEach(p => p.fn_init(jm, options[p.name]));
}

export class Plugin {
    /**
     * @template [TOptions=object]
     * @param {string} name
     * @param {(jm: import('./jsmind.js').default, options: TOptions)=>void} fn_init
     */
    constructor(name, fn_init) {
        if (!name) {
            throw new Error('plugin must has a name');
        }
        if (!fn_init || typeof fn_init !== 'function') {
            throw new Error('plugin must has an init function');
        }
        this.name = name;
        this.fn_init = fn_init;
    }
}
