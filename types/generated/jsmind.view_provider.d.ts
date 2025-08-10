export class ViewProvider {
    /**
     * View layer: DOM nodes, editor, graph and zoom.
     * @param {import('./jsmind.js').default} jm - jsMind instance
     * @param {{
     *   engine: 'canvas'|'svg',
     *   enable_device_pixel_ratio: boolean,
     *   hmargin: number,
     *   vmargin: number,
     *   line_width: number,
     *   line_color: string,
     *   line_style: 'curved'|'straight',
     *   custom_line_render?: Function,
     *   draggable: boolean,
     *   hide_scrollbars_when_draggable: boolean,
     *   node_overflow: 'hidden'|'wrap',
     *   zoom: {min:number, max:number, step:number, mask_key:number},
     *   custom_node_render?: Function,
     *   expander_style: 'char'|'number'
     * }} options - View configuration options
     */
    constructor(jm: import("./jsmind.js").default, options: {
        engine: "canvas" | "svg";
        enable_device_pixel_ratio: boolean;
        hmargin: number;
        vmargin: number;
        line_width: number;
        line_color: string;
        line_style: "curved" | "straight";
        custom_line_render?: Function;
        draggable: boolean;
        hide_scrollbars_when_draggable: boolean;
        node_overflow: "hidden" | "wrap";
        zoom: {
            min: number;
            max: number;
            step: number;
            mask_key: number;
        };
        custom_node_render?: Function;
        expander_style: "char" | "number";
    });
    opts: {
        engine: "canvas" | "svg";
        enable_device_pixel_ratio: boolean;
        hmargin: number;
        vmargin: number;
        line_width: number;
        line_color: string;
        line_style: "curved" | "straight";
        custom_line_render?: Function;
        draggable: boolean;
        hide_scrollbars_when_draggable: boolean;
        node_overflow: "hidden" | "wrap";
        zoom: {
            min: number;
            max: number;
            step: number;
            mask_key: number;
        };
        custom_node_render?: Function;
        expander_style: "char" | "number";
    };
    jm: import("./jsmind.js").default;
    layout: import("./jsmind.layout_provider.js").LayoutProvider;
    container: any;
    e_panel: HTMLElement;
    e_nodes: HTMLElement;
    size: {
        w: number;
        h: number;
    };
    selected_node: import("./jsmind.node.js").Node;
    editing_node: import("./jsmind.node.js").Node;
    graph: {
        view: ViewProvider;
        opts: {
            engine: "canvas" | "svg";
            enable_device_pixel_ratio: boolean;
            hmargin: number;
            vmargin: number;
            line_width: number;
            line_color: string;
            line_style: "curved" | "straight";
            custom_line_render?: Function;
            draggable: boolean;
            hide_scrollbars_when_draggable: boolean;
            node_overflow: "hidden" | "wrap";
            zoom: {
                min: number;
                max: number;
                step: number;
                mask_key: number;
            };
            custom_node_render?: Function;
            expander_style: "char" | "number";
        };
        e_svg: SVGElement;
        size: {
            w: number;
            h: number;
        };
        lines: any[];
        line_drawing: {
            straight: (path: SVGPathElement, x1: number, y1: number, x2: number, y2: number) => void;
            curved: (path: SVGPathElement, x1: number, y1: number, x2: number, y2: number) => void;
        };
        init_line_render(): void;
        drawing: ((path: SVGPathElement, x1: number, y1: number, x2: number, y2: number) => void) | ((path: any, x1: any, y1: any, x2: any, y2: any) => void);
        element(): SVGSVGElement;
        set_size(w: number, h: number): void;
        clear(): void;
        draw_line(pout: {
            x: number;
            y: number;
        }, pin: {
            x: number;
            y: number;
        }, offset: {
            x: number;
            y: number;
        }, color?: string | undefined): void;
        copy_to(dest_canvas_ctx: CanvasRenderingContext2D, callback?: Function | undefined): void;
        _bezier_to(path: SVGPathElement, x1: number, y1: number, x2: number, y2: number): void;
        _line_to(path: SVGPathElement, x1: number, y1: number, x2: number, y2: number): void;
    } | {
        opts: {
            engine: "canvas" | "svg";
            enable_device_pixel_ratio: boolean;
            hmargin: number;
            vmargin: number;
            line_width: number;
            line_color: string;
            line_style: "curved" | "straight";
            custom_line_render?: Function;
            draggable: boolean;
            hide_scrollbars_when_draggable: boolean;
            node_overflow: "hidden" | "wrap";
            zoom: {
                min: number;
                max: number;
                step: number;
                mask_key: number;
            };
            custom_node_render?: Function;
            expander_style: "char" | "number";
        };
        e_canvas: HTMLElement;
        canvas_ctx: any;
        size: {
            w: number;
            h: number;
        };
        line_drawing: {
            straight: (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => void;
            curved: (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => void;
        };
        dpr: number;
        init_line_render(): void;
        drawing: ((ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => void) | ((ctx: any, x1: any, y1: any, x2: any, y2: any) => void);
        element(): HTMLCanvasElement;
        set_size(w: number, h: number): void;
        clear(): void;
        draw_line(pout: {
            x: number;
            y: number;
        }, pin: {
            x: number;
            y: number;
        }, offset: {
            x: number;
            y: number;
        }, color?: string | undefined): void;
        copy_to(dest_canvas_ctx: CanvasRenderingContext2D, callback?: Function | undefined): void;
        _bezier_to(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number): void;
        _line_to(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number): void;
    };
    render_node: (ele: HTMLElement, node: import("./jsmind.node.js").Node) => void;
    zoom_current: number;
    device_pixel_ratio: number;
    _initialized: boolean;
    /** Initialize DOM structure, graph and editor. */
    init(): void;
    e_editor: HTMLElement;
    /**
     * Add a delegated event handler.
     * @param {any} obj
     * @param {string} event_name
     * @param {(e:Event)=>void} event_handle
     * @param {boolean=} capture_by_panel
     */
    add_event(obj: any, event_name: string, event_handle: (e: Event) => void, capture_by_panel?: boolean | undefined): void;
    /**
     * @param {HTMLElement|null} element
     * @returns {string|null}
     */
    get_binded_nodeid(element: HTMLElement | null): string | null;
    /**
     * @param {HTMLElement|null} element
     * @returns {boolean}
     */
    is_node(element: HTMLElement | null): boolean;
    /**
     * @param {HTMLElement} element
     * @returns {boolean}
     */
    is_expander(element: HTMLElement): boolean;
    reset(): void;
    reset_theme(): void;
    /** Reset custom styles for all nodes. */
    reset_custom_style(): void;
    /** Load and initialize the view. */
    load(): void;
    /** Calculate and set the expanded canvas size. */
    expand_size(): void;
    /**
     * Initialize size data for a node.
     * @param {import('./jsmind.node.js').Node} node - Target node
     */
    init_nodes_size(node: import("./jsmind.node.js").Node): void;
    /** Initialize DOM elements for all nodes. */
    init_nodes(): void;
    /**
     * Add a new node to the view.
     * @param {import('./jsmind.node.js').Node} node - Node to add
     */
    add_node(node: import("./jsmind.node.js").Node): void;
    /**
     * Run function in compatibility mode if container is not visible.
     * @param {Function} func - Function to execute
     */
    run_in_c11y_mode_if_needed(func: Function): void;
    /**
     * Create a DOM element for a node and append to parent container.
     * @param {import('./jsmind.node.js').Node} node
     * @param {HTMLElement} parent_node
     */
    create_node_element(node: import("./jsmind.node.js").Node, parent_node: HTMLElement): void;
    /**
     * Remove a node from the view.
     * @param {import('./jsmind.node.js').Node} node - Node to remove
     */
    remove_node(node: import("./jsmind.node.js").Node): void;
    /**
     * Update a node's display.
     * @param {import('./jsmind.node.js').Node} node - Node to update
     */
    update_node(node: import("./jsmind.node.js").Node): void;
    /**
     * Select a node visually.
     * @param {import('./jsmind.node.js').Node|null} node - Node to select
     */
    select_node(node: import("./jsmind.node.js").Node | null): void;
    /** Clear node selection. */
    select_clear(): void;
    /**
     * Get currently editing node.
     * @returns {import('./jsmind.node.js').Node|null} Currently editing node
     */
    get_editing_node(): import("./jsmind.node.js").Node | null;
    /**
     * Check if any node is being edited.
     * @returns {boolean} True if editing
     */
    is_editing(): boolean;
    /**
     * Begin editing a node.
     * @param {import('./jsmind.node.js').Node} node - Node to edit
     */
    edit_node_begin(node: import("./jsmind.node.js").Node): void;
    /** End editing current node. */
    edit_node_end(): void;
    /** @returns {{x:number,y:number}} */
    get_view_offset(): {
        x: number;
        y: number;
    };
    /** Resize the view to fit container. */
    resize(): void;
    /**
     * Internal show implementation.
     * @private
     */
    private _show;
    /**
     * Zoom in the view.
     * @param {MouseEvent=} e - Mouse event for zoom center
     * @returns {boolean} True if zoom succeeded
     */
    zoom_in(e?: MouseEvent | undefined): boolean;
    /**
     * Zoom out the view.
     * @param {MouseEvent=} e - Mouse event for zoom center
     * @returns {boolean} True if zoom succeeded
     */
    zoom_out(e?: MouseEvent | undefined): boolean;
    /**
     * Set zoom level and keep scroll around zoom center.
     * @param {number} zoom
     * @param {MouseEvent=} e
     */
    set_zoom(zoom: number, e?: MouseEvent | undefined): boolean;
    show(keep_center: any): void;
    relayout(): void;
    /** @param {import('./jsmind.node.js').Node} node */
    save_location(node: import("./jsmind.node.js").Node): void;
    /** @param {import('./jsmind.node.js').Node} node */
    restore_location(node: import("./jsmind.node.js").Node): void;
    clear_nodes(): void;
    /** Render node elements and expanders to screen. */
    show_nodes(): void;
    /** @param {import('./jsmind.node.js').Node} node */
    _show_expander(node: import("./jsmind.node.js").Node, view_offset: any): void;
    _get_expander_text(node: any): any;
    /** @param {HTMLElement} ele @param {import('./jsmind.node.js').Node} node */
    _default_node_render(ele: HTMLElement, node: import("./jsmind.node.js").Node): void;
    /** @param {HTMLElement} ele @param {import('./jsmind.node.js').Node} node */
    _custom_node_render(ele: HTMLElement, node: import("./jsmind.node.js").Node): void;
    /** @param {import('./jsmind.node.js').Node} node */
    reset_node_custom_style(node: import("./jsmind.node.js").Node): void;
    /** @param {HTMLElement} node_element @param {Record<string,any>} node_data */
    _reset_node_custom_style(node_element: HTMLElement, node_data: Record<string, any>): void;
    /** @param {import('./jsmind.node.js').Node} node */
    restore_selected_node_custom_style(node: import("./jsmind.node.js").Node): void;
    /** @param {import('./jsmind.node.js').Node} node */
    clear_selected_node_custom_style(node: import("./jsmind.node.js").Node): void;
    clear_lines(): void;
    show_lines(): void;
    /**
     * Enable/disable dragging the whole canvas with mouse.
     * @param {boolean} enabled
     */
    setup_canvas_draggable(enabled: boolean): void;
    /** @param {import('./jsmind.node.js').Node} node */
    center_node(node: import("./jsmind.node.js").Node): boolean;
    zoomIn(e: any): boolean;
    zoomOut(e: any): boolean;
    setZoom(zoom: any, e: any): boolean;
}
