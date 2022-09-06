/**
 * @license BSD
 * @copyright 2014-2022 hizzgdev@163.com
 *
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */

export const __version__ = '0.4.9';
export const __author__ = 'hizzgdev@163.com';

if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (p) {
        return this.slice(0, p.length) === p;
    };
}

// an noop function define
var _noop = function () {};
export let logger =
    typeof console === 'undefined'
        ? {
              log: _noop,
              debug: _noop,
              error: _noop,
              warn: _noop,
              info: _noop,
          }
        : console;

export const Direction = { left: -1, center: 0, right: 1 };
export const EventType = { show: 1, resize: 2, edit: 3, select: 4 };
export const Key = { meta: 1 << 13, ctrl: 1 << 12, alt: 1 << 11, shift: 1 << 10 };
