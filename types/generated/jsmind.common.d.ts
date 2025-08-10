/**
 * @license BSD
 * @copyright 2014-2025 hizzgdev@163.com
 *
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */
export const __version__: "0.8.7";
export const __author__: "hizzgdev@163.com";
export namespace Direction {
    let left: number;
    let center: number;
    let right: number;
    function of(dir: any): any;
}
export namespace EventType {
    let show: number;
    let resize: number;
    let edit: number;
    let select: number;
}
export namespace Key {
    let meta: number;
    let ctrl: number;
    let alt: number;
    let shift: number;
}
export namespace LogLevel {
    let debug: number;
    let info: number;
    let warn: number;
    let error: number;
    let disable: number;
}
export namespace logger {
    export { setup_logger_level as level };
    export let log: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    let debug_1: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    export { debug_1 as debug };
    let info_1: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    export { info_1 as info };
    let warn_1: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    export { warn_1 as warn };
    let error_1: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    export { error_1 as error };
}
declare function setup_logger_level(log_level: any): void;
export {};
