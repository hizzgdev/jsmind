/**
 * @license BSD
 * @copyright 2014-2023 hizzgdev@163.com
 *
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */

class Dom {
    constructor(w) {
        this.w = w;
        this.d = w.document;
        this.g = function (id) {
            return this.d.getElementById(id);
        };
        this.c = function (tag) {
            return this.d.createElement(tag);
        };
        this.t = function (n, t) {
            if (n.hasChildNodes()) {
                n.firstChild.nodeValue = t;
            } else {
                n.appendChild(this.d.createTextNode(t));
            }
        };

        this.h = function (n, t) {
            if (t instanceof HTMLElement) {
                n.innerHTML = '';
                n.appendChild(t);
            } else {
                n.innerHTML = t;
            }
        };
        // detect isElement
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
