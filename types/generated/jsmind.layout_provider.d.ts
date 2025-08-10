export class LayoutProvider {
    /**
     * Layout engine for positioning nodes and lines.
     * @param {import('./jsmind.js').default} jm - jsMind instance
     * @param {{mode:'full'|'side', hspace:number, vspace:number, pspace:number, cousin_space:number}} options - Layout configuration options
     */
    constructor(jm: import("./jsmind.js").default, options: {
        mode: "full" | "side";
        hspace: number;
        vspace: number;
        pspace: number;
        cousin_space: number;
    });
    opts: {
        mode: "full" | "side";
        hspace: number;
        vspace: number;
        pspace: number;
        cousin_space: number;
    };
    jm: import("./jsmind.js").default;
    isside: boolean;
    bounds: {
        n: number;
        s: number;
        w: number;
        e: number;
    };
    cache_valid: boolean;
    /** Initialize layout provider. */
    init(): void;
    /** Reset layout state and bounds. */
    reset(): void;
    /**
     * Decide the next child's direction for a parent node.
     * @param {import('./jsmind.node.js').Node} node
     * @returns {number}
     */
    calculate_next_child_direction(node: import("./jsmind.node.js").Node): number;
    /** Perform layout and offsets recalculation. */
    layout(): void;
    /** Calculate and set direction for all nodes. */
    layout_direction(): void;
    /**
     * Set direction layout for root node and its children.
     * @private
     */
    private _layout_direction_root;
    /**
     * Set direction layout for a node and its descendants.
     * @private
     * @param {import('./jsmind.node.js').Node} node - Target node
     * @param {number} direction - Direction constant (-1, 0, 1)
     * @param {number} side_index - Index among siblings
     */
    private _layout_direction_side;
    /** Calculate and set position offsets for all nodes. */
    layout_offset(): void;
    /**
     * Layout both the x and y axis for subnodes.
     * @private
     * @param {import('./jsmind.node.js').Node[]} nodes - Array of nodes to layout
     * @returns {number} Total height of all nodes
     */
    private _layout_offset_subnodes;
    /**
     * Layout the y axis only, for collapse/expand a node.
     * @private
     * @param {import('./jsmind.node.js').Node[]} nodes - Array of nodes to layout
     * @returns {number} Total height of all nodes
     */
    private _layout_offset_subnodes_height;
    /**
     * Check if node should reserve cousin space.
     * @private
     * @param {import('./jsmind.node.js').Node} node - Node to check
     * @returns {boolean} True if cousin space should be reserved
     */
    private _should_reserve_cousin_space;
    /**
     * Get absolute offset for a node.
     * @param {import('./jsmind.node.js').Node} node - Target node
     * @returns {{x:number, y:number}} Absolute position offset
     */
    get_node_offset(node: import("./jsmind.node.js").Node): {
        x: number;
        y: number;
    };
    /**
     * Get anchor point for lines on a node.
     * @param {import('./jsmind.node.js').Node} node - Target node
     * @returns {{x:number, y:number}} Anchor point coordinates
     */
    get_node_point(node: import("./jsmind.node.js").Node): {
        x: number;
        y: number;
    };
    /**
     * Get input point for lines on a node.
     * @param {import('./jsmind.node.js').Node} node - Target node
     * @returns {{x:number, y:number}} Input point coordinates
     */
    get_node_point_in(node: import("./jsmind.node.js").Node): {
        x: number;
        y: number;
    };
    /**
     * Get output point for lines on a node.
     * @param {import('./jsmind.node.js').Node} node - Target node
     * @returns {{x:number, y:number}} Output point coordinates
     */
    get_node_point_out(node: import("./jsmind.node.js").Node): {
        x: number;
        y: number;
    };
    /**
     * Get expander point for a node.
     * @param {import('./jsmind.node.js').Node} node - Target node
     * @returns {{x:number, y:number}} Expander point coordinates
     */
    get_expander_point(node: import("./jsmind.node.js").Node): {
        x: number;
        y: number;
    };
    /**
     * Get minimal canvas size to contain all nodes.
     * @returns {{w:number, h:number}} Minimum size required
     */
    get_min_size(): {
        w: number;
        h: number;
    };
    /**
     * Toggle node expanded/collapsed state.
     * @param {import('./jsmind.node.js').Node} node - Target node
     */
    toggle_node(node: import("./jsmind.node.js").Node): void;
    /**
     * Expand a node and show its children.
     * @param {import('./jsmind.node.js').Node} node - Target node
     */
    expand_node(node: import("./jsmind.node.js").Node): void;
    /**
     * Collapse a node and hide its children.
     * @param {import('./jsmind.node.js').Node} node - Target node
     */
    collapse_node(node: import("./jsmind.node.js").Node): void;
    /** Expand all nodes in the mind map. */
    expand_all(): void;
    /** Collapse all nodes in the mind map. */
    collapse_all(): void;
    /**
     * Expand nodes to a specific depth level.
     * @param {number} target_depth - Target depth level
     * @param {import('./jsmind.node.js').Node[]=} curr_nodes - Current nodes to process
     * @param {number=} curr_depth - Current depth level
     */
    expand_to_depth(target_depth: number, curr_nodes?: import("./jsmind.node.js").Node[] | undefined, curr_depth?: number | undefined): void;
    /**
     * Perform partial layout for a node and its subtree.
     * @param {import('./jsmind.node.js').Node} node - Target node
     */
    part_layout(node: import("./jsmind.node.js").Node): void;
    /**
     * Set visibility for nodes and their children.
     * @param {import('./jsmind.node.js').Node[]} nodes - Array of nodes
     * @param {boolean} visible - Visibility state
     */
    set_visible(nodes: import("./jsmind.node.js").Node[], visible: boolean): void;
    /**
     * Check if a node is expanded.
     * @param {import('./jsmind.node.js').Node} node - Target node
     * @returns {boolean} True if node is expanded
     */
    is_expand(node: import("./jsmind.node.js").Node): boolean;
    /**
     * Check if a node is visible.
     * @param {import('./jsmind.node.js').Node} node - Target node
     * @returns {boolean} True if node is visible
     */
    is_visible(node: import("./jsmind.node.js").Node): boolean;
}
