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
class Dom {
    /**
     * @param {Window} w
     */
    constructor(w) {
        /** @type {Window} */
        this.w = w;
        /** @type {Document} */
        this.d = w.document;
        /**
         * Get element by id.
         * @param {string} id
         * @returns {HTMLElement|null}
         */
        this.g = function (id) {
            return this.d.getElementById(id);
        };
        /**
         * Create element with given tag.
         * @param {string} tag
         * @returns {HTMLElement}
         */
        this.c = function (tag) {
            return this.d.createElement(tag);
        };
        /**
         * Set text content for element.
         * @param {HTMLElement} n
         * @param {string} t
         */
        this.t = function (n, t) {
            if (n.hasChildNodes()) {
                n.firstChild.nodeValue = t;
            } else {
                n.appendChild(this.d.createTextNode(t));
            }
        };

        /**
         * Set inner HTML or append element.
         * @param {HTMLElement} n
         * @param {string|HTMLElement} t
         */
        this.h = function (n, t) {
            if (t instanceof HTMLElement) {
                n.innerHTML = '';
                n.appendChild(t);
            } else {
                n.innerHTML = t;
            }
        };
        // detect isElement
        /**
         * Runtime check for HTMLElement.
         * @param {unknown} el
         * @returns {el is HTMLElement}
         */
        this.i = function (el) {
            return (
                !!el &&
                typeof el === 'object' &&
                el.nodeType === 1 &&
                typeof el.style === 'object' &&
                typeof el.ownerDocument === 'object'
            );
        };

        //target,eventType,handler
        /**
         * Add event listener with legacy fallback.
         * @param {HTMLElement} t
         * @param {string} e
         * @param {(ev:Event)=>void} h
         */
        this.on = function (t, e, h) {
            if (!!t.addEventListener) {
                t.addEventListener(e, h, false);
            } else {
                t.attachEvent('on' + e, h);
            }
        };
    }
}

export const $ = new Dom(window);
