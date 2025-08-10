export class ShortcutProvider {
    /**
     * @param {import('./jsmind.js').default} jm
     * @param {{ enable:boolean, handles: Record<string,(jm: import('./jsmind.js').default, e: KeyboardEvent)=>void>, mapping: Record<string, number|number[]>, id_generator?: ()=>string }} options
     */
    constructor(jm: import("./jsmind.js").default, options: {
        enable: boolean;
        handles: Record<string, (jm: import("./jsmind.js").default, e: KeyboardEvent) => void>;
        mapping: Record<string, number | number[]>;
        id_generator?: () => string;
    });
    jm: import("./jsmind.js").default;
    opts: {
        enable: boolean;
        handles: Record<string, (jm: import("./jsmind.js").default, e: KeyboardEvent) => void>;
        mapping: Record<string, number | number[]>;
        id_generator?: () => string;
    };
    /** @type {Record<string, number|number[]>} */
    mapping: Record<string, number | number[]>;
    /** @type {Record<string,(jm: import('./jsmind.js').default, e: KeyboardEvent)=>void>} */
    handles: Record<string, (jm: import("./jsmind.js").default, e: KeyboardEvent) => void>;
    /** @type {()=>string|null} */
    _newid: () => string | null;
    /** @type {Record<number,(jm: import('./jsmind.js').default, e: KeyboardEvent)=>void>} */
    _mapping: Record<number, (jm: import("./jsmind.js").default, e: KeyboardEvent) => void>;
    init(): void;
    enable_shortcut(): void;
    disable_shortcut(): void;
    /** @param {KeyboardEvent} e */
    handler(e: KeyboardEvent): boolean;
    /** @param {import('./jsmind.js').default} _jm @param {KeyboardEvent} e */
    handle_addchild(_jm: import("./jsmind.js").default, e: KeyboardEvent): void;
    /** @param {import('./jsmind.js').default} _jm @param {KeyboardEvent} e */
    handle_addbrother(_jm: import("./jsmind.js").default, e: KeyboardEvent): void;
    /** @param {import('./jsmind.js').default} _jm @param {KeyboardEvent} e */
    handle_editnode(_jm: import("./jsmind.js").default, e: KeyboardEvent): void;
    /** @param {import('./jsmind.js').default} _jm @param {KeyboardEvent} e */
    handle_delnode(_jm: import("./jsmind.js").default, e: KeyboardEvent): void;
    /** @param {import('./jsmind.js').default} _jm @param {KeyboardEvent} e */
    handle_toggle(_jm: import("./jsmind.js").default, e: KeyboardEvent): void;
    /** @param {import('./jsmind.js').default} _jm @param {KeyboardEvent} e */
    handle_up(_jm: import("./jsmind.js").default, e: KeyboardEvent): void;
    /** @param {import('./jsmind.js').default} _jm @param {KeyboardEvent} e */
    handle_down(_jm: import("./jsmind.js").default, e: KeyboardEvent): void;
    /** @param {import('./jsmind.js').default} _jm @param {KeyboardEvent} e */
    handle_left(_jm: import("./jsmind.js").default, e: KeyboardEvent): void;
    /** @param {import('./jsmind.js').default} _jm @param {KeyboardEvent} e */
    handle_right(_jm: import("./jsmind.js").default, e: KeyboardEvent): void;
    /** @param {import('./jsmind.js').default} _jm @param {KeyboardEvent} e @param {number} d */
    _handle_direction(_jm: import("./jsmind.js").default, e: KeyboardEvent, d: number): void;
}
