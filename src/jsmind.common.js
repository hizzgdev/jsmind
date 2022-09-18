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

export const Direction = { left: -1, center: 0, right: 1 };
export const EventType = { show: 1, resize: 2, edit: 3, select: 4 };
export const Key = { meta: 1 << 13, ctrl: 1 << 12, alt: 1 << 11, shift: 1 << 10 };
export const LogLevel = { debug: 1, info: 2, warn: 3, error: 4, disable: 9 };

// an noop function define
var _noop = function () {};
export let logger =
    typeof console === 'undefined'
        ? {
              level: LogLevel.none,
              log: _noop,
              debug: _noop,
              info: _noop,
              warn: _noop,
              error: _noop,
          }
        : {
              level: LogLevel.info,
              log: console.log,
              debug: function () {
                  if (this.level <= LogLevel.debug) {
                      console.debug.apply(this, arguments);
                  }
              },
              info: function () {
                  if (this.level <= LogLevel.info) {
                      console.info.apply(this, arguments);
                  }
              },
              warn: function () {
                  if (this.level <= LogLevel.warn) {
                      console.warn.apply(this, arguments);
                  }
              },
              error: function () {
                  if (this.level <= LogLevel.error) {
                      console.error.apply(this, arguments);
                  }
              },
          };
