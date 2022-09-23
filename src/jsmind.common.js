/**
 * @license BSD
 * @copyright 2014-2022 hizzgdev@163.com
 *
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */

export const __version__ = '0.4.10';
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
              level: _noop,
              log: _noop,
              debug: _noop,
              info: _noop,
              warn: _noop,
              error: _noop,
          }
        : {
              level: setup_logger_level,
              log: console.log,
              debug: console.debug,
              info: console.info,
              warn: console.warn,
              error: console.error,
          };

function setup_logger_level(log_level) {
    if (log_level > LogLevel.debug) {
        logger.debug = _noop;
    } else {
        logger.debug = console.debug;
    }
    if (log_level > LogLevel.info) {
        logger.info = _noop;
    } else {
        logger.info = console.info;
    }
    if (log_level > LogLevel.warn) {
        logger.warn = _noop;
    } else {
        logger.warn = console.warn;
    }
    if (log_level > LogLevel.error) {
        logger.error = _noop;
    } else {
        logger.error = console.error;
    }
}
