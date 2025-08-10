/**
 * Draggable node plugin for jsMind.
 */
export class DraggableNode {
    /**
     * Create draggable node plugin instance.
     * @param {import('../jsmind.js').default} jm - jsMind instance
     * @param {Partial<DraggableNodeOptions>} options - Plugin options
     */
    constructor(jm: import('../jsmind.js').default, options: Partial<DraggableNodeOptions>);
    version: string;
    /** @type {import('../jsmind.js').default} */
    jm: import('../jsmind.js').default;
    /** @type {DraggableNodeOptions} */
    options: DraggableNodeOptions;
    /** @type {HTMLCanvasElement|null} */
    e_canvas: HTMLCanvasElement | null;
    /** @type {CanvasRenderingContext2D|null} */
    canvas_ctx: CanvasRenderingContext2D | null;
    /** @type {HTMLElement|null} */
    shadow: HTMLElement | null;
    /** @type {number} */
    shadow_p_x: number;
    /** @type {number} */
    shadow_p_y: number;
    /** @type {number} */
    shadow_w: number;
    /** @type {number} */
    shadow_h: number;
    /** @type {import('../jsmind.node.js').Node|null} */
    active_node: import('../jsmind.node.js').Node | null;
    /** @type {import('../jsmind.node.js').Node|null} */
    target_node: import('../jsmind.node.js').Node | null;
    /** @type {number|null} */
    target_direct: number | null;
    /** @type {number} */
    client_w: number;
    /** @type {number} */
    client_h: number;
    /** @type {number} */
    offset_x: number;
    /** @type {number} */
    offset_y: number;
    /** @type {number} */
    hlookup_delay: number;
    /** @type {number} */
    hlookup_timer: number;
    /** @type {boolean} */
    capture: boolean;
    /** @type {boolean} */
    moved: boolean;
    /** @type {boolean} */
    canvas_draggable: boolean;
    /** @type {HTMLElement} */
    view_panel: HTMLElement;
    /** @type {DOMRect|null} */
    view_panel_rect: DOMRect | null;
    /** Initialize the draggable node plugin. */
    init(): void;
    /** Resize canvas and shadow elements. */
    resize(): void;
    /** Create canvas for drawing drag lines. */
    create_canvas(): void;
    create_shadow(): void;
    /**
     * Reset shadow element style and cache its size.
     * @param {HTMLElement} el - The node element to mirror as shadow
     */
    reset_shadow(el: HTMLElement): void;
    /** Show the shadow element. */
    show_shadow(): void;
    /** Hide the shadow element. */
    hide_shadow(): void;
    /**
     * Draw a helper line between the shadow and target node.
     * @param {{x:number,y:number}} shadow_p - Shadow anchor point
     * @param {{x:number,y:number}} node_p - Target node anchor point
     * @param {boolean} invalid - Whether current target is invalid
     */
    magnet_shadow(
        shadow_p: {
            x: number;
            y: number;
        },
        node_p: {
            x: number;
            y: number;
        },
        invalid: boolean
    ): void;
    /** Clear helper lines from canvas. */
    clear_lines(): void;
    /**
     * Draw a straight helper line.
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     */
    canvas_lineto(x1: number, y1: number, x2: number, y2: number): void;
    /** Bind mouse/touch events for dragging. */
    event_bind(): void;
    /**
     * Begin dragging interaction.
     * @param {MouseEvent|TouchEvent} e - Pointer down event
     */
    dragstart(e: MouseEvent | TouchEvent): void;
    view_draggable: boolean;
    client_hw: number;
    client_hh: number;
    /**
     * Drag handler to move shadow and auto-scroll container.
     * @param {MouseEvent|TouchEvent} e - Pointer move event
     */
    drag(e: MouseEvent | TouchEvent): void;
    /**
     * Finish dragging, move the node if applicable.
     * @param {MouseEvent|TouchEvent} e - Pointer up event
     */
    dragend(e: MouseEvent | TouchEvent): void;
    /**
     * Find the closest node element from an event target.
     * @param {HTMLElement} el - Current DOM element
     * @returns {HTMLElement|null} Matched node element or null
     */
    find_node_element(el: HTMLElement): HTMLElement | null;
    /** Recompute target node under the shadow and draw helper. */
    lookup_target_node(): void;
    /**
     * Get X coordinate of root node center.
     * @returns {number}
     */
    get_root_x(): number;
    /**
     * Lookup overlapping node's parent near the shadow position.
     * @param {number} direction - Direction constant
     * @returns {import('../jsmind.node.js').Node|null}
     */
    lookup_overlapping_node_parent(direction: number): import('../jsmind.node.js').Node | null;
    /**
     * Find node's parent by a screen location.
     * @param {number} x - Client X
     * @param {number} y - Client Y
     * @returns {import('../jsmind.node.js').Node|null}
     */
    lookup_node_parent_by_location(x: number, y: number): import('../jsmind.node.js').Node | null;
    /**
     * Lookup the closest node along a direction.
     * @param {number} direction
     * @returns {import('../jsmind.node.js').Node}
     */
    lookup_close_node(direction: number): import('../jsmind.node.js').Node;
    /**
     * Check if shadow is on the target side of a node.
     * @param {import('../jsmind.node.js').Node} node
     * @param {number} dir
     * @returns {boolean}
     */
    shadow_on_target_side(node: import('../jsmind.node.js').Node, dir: number): boolean;
    /**
     * Distance from shadow to the right side of a node.
     * @param {import('../jsmind.node.js').Node} node
     * @returns {number}
     */
    shadow_to_right_of_node(node: import('../jsmind.node.js').Node): number;
    /**
     * Distance from shadow to the left side of a node.
     * @param {import('../jsmind.node.js').Node} node
     * @returns {number}
     */
    shadow_to_left_of_node(node: import('../jsmind.node.js').Node): number;
    /**
     * Vertical distance between shadow centerline and node centerline.
     * @param {import('../jsmind.node.js').Node} node
     * @returns {number}
     */
    shadow_to_base_line_of_node(node: import('../jsmind.node.js').Node): number;
    /**
     * Manhattan distance to a node along a direction.
     * @param {import('../jsmind.node.js').Node} node
     * @param {number} dir
     * @returns {number}
     */
    shadow_to_node(node: import('../jsmind.node.js').Node, dir: number): number;
    /**
     * Calculate connection points of a node and the shadow.
     * @param {import('../jsmind.node.js').Node} node
     * @param {number} dir
     * @returns {{sp:{x:number,y:number}, np:{x:number,y:number}}}
     */
    calc_point_of_node(
        node: import('../jsmind.node.js').Node,
        dir: number
    ): {
        sp: {
            x: number;
            y: number;
        };
        np: {
            x: number;
            y: number;
        };
    };
    /**
     * Move a node to a new parent/position.
     * @param {import('../jsmind.node.js').Node} src_node
     * @param {import('../jsmind.node.js').Node|null} target_node
     * @param {number|null} target_direct
     */
    move_node(
        src_node: import('../jsmind.node.js').Node,
        target_node: import('../jsmind.node.js').Node | null,
        target_direct: number | null
    ): void;
    /**
     * Handle jsMind events.
     * @param {number|string} type - Event type
     * @param {object} [data] - Event data
     */
    jm_event_handle(type: number | string, data?: object): void;
}
/**
 * Draggable node plugin registration.
 * @type {import('../jsmind.plugin.js').Plugin<Partial<DraggableNodeOptions>>}
 */
export const draggable_plugin: import('../jsmind.plugin.js').Plugin<Partial<DraggableNodeOptions>>;
export default DraggableNode;
/**
 * Default options for draggable node plugin.
 */
export type DraggableNodeOptions = {
    line_width?: number;
    line_color?: string;
    line_color_invalid?: string;
    lookup_delay?: number;
    lookup_interval?: number;
    scrolling_trigger_width?: number;
    scrolling_step_length?: number;
    shadow_node_class_name?: string;
};
