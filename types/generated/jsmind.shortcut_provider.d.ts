export class ShortcutProvider {
    /**
     * Keyboard shortcut handler.
     * @param {import('./jsmind.js').default} jm - jsMind instance
     * @param {{enable:boolean, handles:Record<string,Function>, mapping:Record<string, number|number[]>}} options - Shortcut configuration options
     */
    constructor(jm: import("./jsmind.js").default, options: {
        enable: boolean;
        handles: Record<string, Function>;
        mapping: Record<string, number | number[]>;
    });
    jm: import("./jsmind.js").default;
    opts: {
        enable: boolean;
        handles: Record<string, Function>;
        mapping: Record<string, number | number[]>;
    };
    mapping: Record<string, number | number[]>;
    handles: Record<string, Function>;
    _newid: any;
    _mapping: {};
    /** Initialize keyboard listeners and mapping. */
    init(): void;
    /** Enable shortcuts. */
    enable_shortcut(): void;
    /** Disable shortcuts. */
    disable_shortcut(): void;
    /** @param {KeyboardEvent} e */
    handler(e: KeyboardEvent): boolean;
    /**
     * Handle add child node shortcut.
     * @param {import('./jsmind.js').default} _jm - jsMind instance
     * @param {KeyboardEvent} e - Keyboard event
     */
    handle_addchild(_jm: import("./jsmind.js").default, e: KeyboardEvent): void;
    /**
     * Handle add brother node shortcut.
     * @param {import('./jsmind.js').default} _jm - jsMind instance
     * @param {KeyboardEvent} e - Keyboard event
     */
    handle_addbrother(_jm: import("./jsmind.js").default, e: KeyboardEvent): void;
    /**
     * Handle edit node shortcut.
     * @param {import('./jsmind.js').default} _jm - jsMind instance
     * @param {KeyboardEvent} e - Keyboard event
     */
    handle_editnode(_jm: import("./jsmind.js").default, e: KeyboardEvent): void;
    /**
     * Handle delete node shortcut.
     * @param {import('./jsmind.js').default} _jm - jsMind instance
     * @param {KeyboardEvent} e - Keyboard event
     */
    handle_delnode(_jm: import("./jsmind.js").default, e: KeyboardEvent): void;
    /**
     * Handle toggle node shortcut.
     * @param {import('./jsmind.js').default} _jm - jsMind instance
     * @param {KeyboardEvent} e - Keyboard event
     */
    handle_toggle(_jm: import("./jsmind.js").default, e: KeyboardEvent): void;
    /**
     * Handle up arrow key shortcut.
     * @param {import('./jsmind.js').default} _jm - jsMind instance
     * @param {KeyboardEvent} e - Keyboard event
     */
    handle_up(_jm: import("./jsmind.js").default, e: KeyboardEvent): void;
    /**
     * Handle down arrow key shortcut.
     * @param {import('./jsmind.js').default} _jm - jsMind instance
     * @param {KeyboardEvent} e - Keyboard event
     */
    handle_down(_jm: import("./jsmind.js").default, e: KeyboardEvent): void;
    /**
     * Handle left arrow key shortcut.
     * @param {import('./jsmind.js').default} _jm - jsMind instance
     * @param {KeyboardEvent} e - Keyboard event
     */
    handle_left(_jm: import("./jsmind.js").default, e: KeyboardEvent): void;
    /**
     * Handle right arrow key shortcut.
     * @param {import('./jsmind.js').default} _jm - jsMind instance
     * @param {KeyboardEvent} e - Keyboard event
     */
    handle_right(_jm: import("./jsmind.js").default, e: KeyboardEvent): void;
    /**
     * Handle directional navigation.
     * @private
     * @param {import('./jsmind.js').default} _jm - jsMind instance
     * @param {KeyboardEvent} e - Keyboard event
     * @param {number} d - Direction constant
     */
    private _handle_direction;
}
