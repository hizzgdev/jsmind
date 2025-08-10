export const $: Dom;
/**
 * @license BSD
 * @copyright 2014-2025 hizzgdev@163.com
 *
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */
declare class Dom {
    constructor(w: any);
    w: any;
    d: any;
    g: (id: any) => any;
    c: (tag: any) => any;
    t: (n: any, t: any) => void;
    h: (n: any, t: any) => void;
    i: (el: any) => boolean;
    on: (t: any, e: any, h: any) => void;
}
export {};
