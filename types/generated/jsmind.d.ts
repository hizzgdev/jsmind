/**
 * Event callback payload
 * @typedef {{ evt?: string, data?: unknown[], node?: string }} EventData
 */
/**
 * jsMind runtime: orchestrates data/layout/view/shortcut and exposes public API.
 */
export default class jsMind {
    static mind: typeof Mind;
    static node: typeof Node;
    static direction: import("./jsmind.common.js").DirectionType;
    static event_type: {
        show: number;
        resize: number;
        edit: number;
        select: number;
    };
    static $: {
        w: Window;
        d: Document;
        g: (id: string) => HTMLElement | null;
        c: (tag: string) => HTMLElement;
        t: (n: HTMLElement, t: string) => void;
        h: (n: HTMLElement, t: string | HTMLElement) => void;
        i: (el: unknown) => el is HTMLElement;
        on: (t: HTMLElement, e: string, h: (ev: Event) => void) => void;
    };
    static plugin: typeof Plugin;
    static register_plugin: typeof _register_plugin;
    static util: {
        file: {
            read: (file: File, cb: (result: string, name: string) => void) => void;
            save: (data: string, type: string, name: string) => void;
        };
        json: {
            json2string: (v: unknown) => string;
            string2json: (s: string) => unknown;
            merge: (b: object, a: object) => object;
        };
        uuid: {
            newid: () => string;
        };
        text: {
            is_empty: (s?: string) => boolean;
        };
    };
    /**
     * Deprecated: static show constructor helper.
     * @param {import('./jsmind.option.js').JsMindRuntimeOptions} options
     * @param {object | null} mind
     * @returns {jsMind}
     */
    static show(options: import("./jsmind.option.js").JsMindRuntimeOptions, mind: object | null): jsMind;
    /**
     * Create a jsMind instance.
     * @param {import('./jsmind.option.js').JsMindRuntimeOptions} options
     */
    constructor(options: import("./jsmind.option.js").JsMindRuntimeOptions);
    options: import("./jsmind.option.js").JsMindRuntimeOptions;
    version: string;
    initialized: boolean;
    mind: Mind;
    /** @type {Array<(type: number, data: EventData) => void>} */
    event_handles: Array<(type: number, data: EventData) => void>;
    /** Initialize sub-systems and plugins. */
    init(): void;
    data: DataProvider;
    layout: LayoutProvider;
    view: ViewProvider;
    shortcut: ShortcutProvider;
    /** @returns {boolean} whether current mind map is editable */
    get_editable(): boolean;
    /** enable editing */
    enable_edit(): void;
    /** disable editing */
    disable_edit(): void;
    /** @returns {boolean} whether view is draggable */
    get_view_draggable(): boolean;
    /** enable view dragging */
    enable_view_draggable(): void;
    /** disable view dragging */
    disable_view_draggable(): void;
    /**
     * Enable default event handle.
     * @param {'mousedown'|'click'|'dblclick'|'mousewheel'} event_handle
     */
    enable_event_handle(event_handle: "mousedown" | "click" | "dblclick" | "mousewheel"): void;
    /**
     * Disable default event handle.
     * @param {'mousedown'|'click'|'dblclick'|'mousewheel'} event_handle
     */
    disable_event_handle(event_handle: "mousedown" | "click" | "dblclick" | "mousewheel"): void;
    /**
     * Set theme name.
     * @param {string|null} theme
     */
    set_theme(theme: string | null): void;
    /** bind internal DOM events */
    _event_bind(): void;
    /** @param {MouseEvent} e */
    mousedown_handle(e: MouseEvent): void;
    /** @param {MouseEvent} e */
    click_handle(e: MouseEvent): void;
    /** @param {MouseEvent} e */
    dblclick_handle(e: MouseEvent): void;
    /** @param {WheelEvent} e */
    mousewheel_handle(e: WheelEvent): void;
    /**
     * Begin editing a node.
     * @param {string | import('./jsmind.node.js').Node} node
     * @returns {boolean|void}
     */
    begin_edit(node: string | import("./jsmind.node.js").Node): boolean | void;
    /** End editing */
    end_edit(): void;
    /**
     * Toggle a node's expanded state.
     * @param {string | import('./jsmind.node.js').Node} node
     * @returns {void}
     */
    toggle_node(node: string | import("./jsmind.node.js").Node): void;
    /**
     * Expand a node.
     * @param {string | import('./jsmind.node.js').Node} node
     * @returns {void}
     */
    expand_node(node: string | import("./jsmind.node.js").Node): void;
    /**
     * Collapse a node.
     * @param {string | import('./jsmind.node.js').Node} node
     * @returns {void}
     */
    collapse_node(node: string | import("./jsmind.node.js").Node): void;
    /** Expand all nodes */
    expand_all(): void;
    /** Collapse all nodes */
    collapse_all(): void;
    /** @param {number} depth */
    expand_to_depth(depth: number): void;
    /** reset view/layout/data */
    _reset(): void;
    /**
     * Internal show flow.
     * @param {object | null} mind
     * @param {boolean=} skip_centering
     */
    _show(mind: object | null, skip_centering?: boolean | undefined): void;
    /**
     * Show a mind (or example) on the canvas.
     * @param {object | null} mind
     * @param {boolean=} skip_centering
     */
    show(mind: object | null, skip_centering?: boolean | undefined): void;
    /** @returns {{name:string,author:string,version:string}} */
    get_meta(): {
        name: string;
        author: string;
        version: string;
    };
    /**
     * Serialize current mind to given format.
     * @param {'node_tree'|'node_array'|'freemind'|'text'} [data_format]
     * @returns {object}
     */
    get_data(data_format?: "node_tree" | "node_array" | "freemind" | "text"): object;
    /** @returns {import('./jsmind.node.js').Node} */
    get_root(): import("./jsmind.node.js").Node;
    /**
     * @param {string | import('./jsmind.node.js').Node} node
     * @returns {import('./jsmind.node.js').Node}
     */
    get_node(node: string | import("./jsmind.node.js").Node): import("./jsmind.node.js").Node;
    /**
     * Add a node under parent.
     * @param {string | import('./jsmind.node.js').Node} parent_node
     * @param {string} node_id
     * @param {string} topic
     * @param {Record<string, any>=} data
     * @param {number=} direction
     * @returns {import('./jsmind.node.js').Node|null}
     */
    add_node(parent_node: string | import("./jsmind.node.js").Node, node_id: string, topic: string, data?: Record<string, any> | undefined, direction?: number | undefined): import("./jsmind.node.js").Node | null;
    /**
     * Insert a node before target node.
     * @param {string | import('./jsmind.node.js').Node} node_before
     * @param {string} node_id
     * @param {string} topic
     * @param {Record<string, any>=} data
     * @param {number=} direction
     * @returns {import('./jsmind.node.js').Node|null}
     */
    insert_node_before(node_before: string | import("./jsmind.node.js").Node, node_id: string, topic: string, data?: Record<string, any> | undefined, direction?: number | undefined): import("./jsmind.node.js").Node | null;
    /**
     * Insert a node after target node.
     * @param {string | import('./jsmind.node.js').Node} node_after
     * @param {string} node_id
     * @param {string} topic
     * @param {Record<string, any>=} data
     * @param {number=} direction
     * @returns {import('./jsmind.node.js').Node|null}
     */
    insert_node_after(node_after: string | import("./jsmind.node.js").Node, node_id: string, topic: string, data?: Record<string, any> | undefined, direction?: number | undefined): import("./jsmind.node.js").Node | null;
    /**
     * Remove a node.
     * @param {string | import('./jsmind.node.js').Node} node
     * @returns {boolean}
     */
    remove_node(node: string | import("./jsmind.node.js").Node): boolean;
    /** @param {string} node_id @param {string} topic */
    update_node(node_id: string, topic: string): void;
    /**
     * Move a node and optionally change direction.
     * @param {string} node_id
     * @param {string=} before_id
     * @param {string=} parent_id
     * @param {number=} direction
     */
    move_node(node_id: string, before_id?: string | undefined, parent_id?: string | undefined, direction?: number | undefined): void;
    /**
     * @param {string | import('./jsmind.node.js').Node} node
     * @returns {void}
     */
    select_node(node: string | import("./jsmind.node.js").Node): void;
    /** @returns {import('./jsmind.node.js').Node|null} */
    get_selected_node(): import("./jsmind.node.js").Node | null;
    /** clear selection */
    select_clear(): void;
    /** @param {string | import('./jsmind.node.js').Node} node */
    is_node_visible(node: string | import("./jsmind.node.js").Node): boolean;
    /** @param {string | import('./jsmind.node.js').Node} node */
    scroll_node_to_center(node: string | import("./jsmind.node.js").Node): void;
    /**
     * Find the previous sibling node of the given node.
     *
     * @param {string | import('./jsmind.node.js').Node} node - Node id or Node instance
     * @returns {import('./jsmind.node.js').Node | null}
     */
    find_node_before(node: string | import("./jsmind.node.js").Node): import("./jsmind.node.js").Node | null;
    /**
     * Find the next sibling node of the given node.
     * @param {string | import('./jsmind.node.js').Node} node
     * @returns {import('./jsmind.node.js').Node | null}
     */
    find_node_after(node: string | import("./jsmind.node.js").Node): import("./jsmind.node.js").Node | null;
    /**
     * @param {string} node_id
     * @param {string=} bg_color
     * @param {string=} fg_color
     * @returns {void}
     */
    set_node_color(node_id: string, bg_color?: string | undefined, fg_color?: string | undefined): void;
    /**
     * @param {string} node_id
     * @param {number=} size
     * @param {string=} weight
     * @param {string=} style
     * @returns {void}
     */
    set_node_font_style(node_id: string, size?: number | undefined, weight?: string | undefined, style?: string | undefined): void;
    /**
     * @param {string} node_id
     * @param {string} image
     * @param {number=} width
     * @param {number=} height
     * @param {number=} rotation
     * @returns {void}
     */
    set_node_background_image(node_id: string, image: string, width?: number | undefined, height?: number | undefined, rotation?: number | undefined): void;
    /**
     * @param {string} node_id
     * @param {number} rotation
     * @returns {void}
     */
    set_node_background_rotation(node_id: string, rotation: number): void;
    /** trigger view resize */
    resize(): void;
    /** @param {(type:number, data: EventData)=>void} callback */
    add_event_listener(callback: (type: number, data: EventData) => void): void;
    /** clear event listeners */
    clear_event_listener(): void;
    /** @param {number} type @param {EventData} data */
    invoke_event_handle(type: number, data: EventData): void;
    /** @param {number} type @param {EventData} data */
    _invoke_event_handle(type: number, data: EventData): void;
}
/**
 * Event callback payload
 */
export type EventData = {
    evt?: string;
    data?: unknown[];
    node?: string;
};
import { Mind } from './jsmind.mind.js';
import { DataProvider } from './jsmind.data_provider.js';
import { LayoutProvider } from './jsmind.layout_provider.js';
import { ViewProvider } from './jsmind.view_provider.js';
import { ShortcutProvider } from './jsmind.shortcut_provider.js';
import { Node } from './jsmind.node.js';
import { Plugin } from './jsmind.plugin.js';
import { register as _register_plugin } from './jsmind.plugin.js';
