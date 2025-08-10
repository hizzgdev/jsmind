/**
 * Register a plugin instance.
 * @param {Plugin<any>} plugin
 */
export function register(plugin: Plugin<any>): void;
/**
 * Apply registered plugins asynchronously.
 * @param {import('./jsmind.js').default} jm
 * @param {Record<string, any>} options
 */
export function apply(jm: import("./jsmind.js").default, options: Record<string, any>): void;
export class Plugin {
    /**
     * @template [TOptions=any]
     * @param {string} name
     * @param {(jm: import('./jsmind.js').default, options: TOptions)=>void} fn_init
     */
    constructor(name: string, fn_init: (jm: import("./jsmind.js").default, options: TOptions) => void);
    name: string;
    fn_init: (jm: import("./jsmind.js").default, options: TOptions) => void;
}
