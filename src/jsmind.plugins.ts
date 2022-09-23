/*
 * @Author: lyttonlee lzr3278@163.com
 * @Date: 2022-09-21 16:17:33
 * @LastEditors: lyttonlee lzr3278@163.com
 * @LastEditTime: 2022-09-22 15:09:00
 * @FilePath: \jsmind\src\jsmind.plugin.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

interface initFunc {
    (jm: any): void;
}

interface PluginInterface {
    name: string;
    init: initFunc;
}

export class Plugin implements PluginInterface {
    name: string;
    init: initFunc;
    constructor(name: string, init: initFunc) {
        this.name = name;
        this.init = init;
    }
}

// 插件集合
const plugins: Map<string, Plugin> = new Map();

// 插件是否符合
function isConformPlugin(plugin: Plugin): boolean {
    return plugin.name && typeof plugin.init === 'function';
}

/**
 * @description: 注册插件
 * @param {Plugin} plugin
 * @return {*}
 */
export function registerPlugin(plugin: Plugin) {
    if (isConformPlugin(plugin)) {
        if (plugins.has(plugin.name)) {
            throw new Error(`${plugin.name} 插件已被注册！`);
        }
        plugins.set(plugin.name, plugin);
        return;
    }
    throw new Error('不可注册插件！');
}

/**
 * @description: 启用插件
 * @param {string} name
 * @param {any} jm jsmind instance
 * @return {*}
 */
export function enablePlugin(name: string, jm: any) {
    if (plugins.has(name)) {
        plugins.get(name)?.init(jm);
    } else {
        throw new Error(`请先注册${name}插件`);
    }
}
