/**
 * Register a plugin instance.
 * @param {Plugin<object>} plugin
 */
export function register(plugin: Plugin<object>): void;
/**
 * Apply registered plugins asynchronously.
 * @param {import('./jsmind.js').default} jm
 * @param {Record<string, object>} options
 */
export function apply(jm: import('./jsmind.js').default, options: Record<string, object>): void;
export class Plugin {
    /**
     * @template [TOptions=object]
     * @param {string} name
     * @param {(jm: import('./jsmind.js').default, options: TOptions)=>void} fn_init
     */
    constructor(
        name: string,
        fn_init: (jm: import('./jsmind.js').default, options: TOptions) => void
    );
    name: string;
    fn_init: (jm: import('./jsmind.js').default, options: TOptions) => void;
}
