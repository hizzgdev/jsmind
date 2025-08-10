export const $: Dom;
/**
 * @license BSD
 * @copyright 2014-2025 hizzgdev@163.com
 *
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */
/**
 * Lightweight DOM helpers bound to a window.
 */
declare class Dom {
    constructor(w: any);
    w: any;
    d: any;
    /**
     * Get element by id.
     * @param {string} id
     * @returns {HTMLElement|null}
     */
    g: (id: string) => HTMLElement | null;
    /**
     * Create element with given tag.
     * @param {string} tag
     * @returns {HTMLElement}
     */
    c: (tag: string) => HTMLElement;
    /**
     * Set text content for element.
     * @param {HTMLElement} n
     * @param {string} t
     */
    t: (n: HTMLElement, t: string) => void;
    /**
     * Set inner HTML or append element.
     * @param {HTMLElement} n
     * @param {string|HTMLElement} t
     */
    h: (n: HTMLElement, t: string | HTMLElement) => void;
    /**
     * Runtime check for HTMLElement.
     * @param {any} el
     * @returns {el is HTMLElement}
     */
    i: (el: any) => el is HTMLElement;
    /**
     * Add event listener with legacy fallback.
     * @param {HTMLElement} t
     * @param {string} e
     * @param {(ev:Event)=>void} h
     */
    on: (t: HTMLElement, e: string, h: (ev: Event) => void) => void;
}
export {};
