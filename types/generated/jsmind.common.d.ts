/**
 * @license BSD
 * @copyright 2014-2025 hizzgdev@163.com
 *
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */
/**
 * Library version string.
 * @type {string}
 */
export const __version__: string;
/**
 * Library author.
 * @type {string}
 */
export const __author__: string;
/**
 * Direction constants and parser.
 * @typedef {{left:number,center:number,right:number,of:(dir:(string|number))=>number|undefined}} DirectionType
 */
/** @type {DirectionType} */
export const Direction: DirectionType;
export type EventType = number;
export namespace EventType {
    let show: number;
    let resize: number;
    let edit: number;
    let select: number;
}
export type Key = number;
export namespace Key {
    let meta: number;
    let ctrl: number;
    let alt: number;
    let shift: number;
}
export type LogLevel = number;
export namespace LogLevel {
    let debug: number;
    let info: number;
    let warn: number;
    let error: number;
    let disable: number;
}
/**
 * Logger facade with dynamic level.
 * @type {{level:(lvl:number)=>void,log:Function,debug:Function,info:Function,warn:Function,error:Function}}
 */
export let logger: {
    level: (lvl: number) => void;
    log: Function;
    debug: Function;
    info: Function;
    warn: Function;
    error: Function;
};
/**
 * Direction constants and parser.
 */
export type DirectionType = {
    left: number;
    center: number;
    right: number;
    of: (dir: (string | number)) => number | undefined;
};
