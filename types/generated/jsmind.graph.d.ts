/**
 * Initialize graph renderer based on engine type.
 * @param {import('./jsmind.view_provider.js').ViewProvider} view - View provider instance
 * @param {'canvas'|'svg'} engine - Rendering engine type
 * @returns {SvgGraph|CanvasGraph} Graph renderer instance
 */
export function init_graph(view: import("./jsmind.view_provider.js").ViewProvider, engine: "canvas" | "svg"): SvgGraph | CanvasGraph;
/**
 * SVG-based graph renderer.
 */
declare class SvgGraph {
    /** @param {string} tag */
    static c(tag: string): any;
    /**
     * Create SVG graph renderer.
     * @param {import('./jsmind.view_provider.js').ViewProvider} view - View provider instance
     */
    constructor(view: import("./jsmind.view_provider.js").ViewProvider);
    view: import("./jsmind.view_provider.js").ViewProvider;
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
    e_svg: any;
    size: {
        w: number;
        h: number;
    };
    lines: any[];
    line_drawing: {
        straight: (path: SVGPathElement, x1: number, y1: number, x2: number, y2: number) => void;
        curved: (path: SVGPathElement, x1: number, y1: number, x2: number, y2: number) => void;
    };
    /** Choose line drawing renderer. */
    init_line_render(): void;
    drawing: ((path: SVGPathElement, x1: number, y1: number, x2: number, y2: number) => void) | ((path: any, x1: any, y1: any, x2: any, y2: any) => void);
    /** @returns {SVGSVGElement} */
    element(): SVGSVGElement;
    /** @param {number} w @param {number} h */
    set_size(w: number, h: number): void;
    clear(): void;
    /** @param {{x:number,y:number}} pout @param {{x:number,y:number}} pin @param {{x:number,y:number}} offset @param {string=} color */
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
    /** @param {CanvasRenderingContext2D} dest_canvas_ctx @param {Function=} callback */
    copy_to(dest_canvas_ctx: CanvasRenderingContext2D, callback?: Function | undefined): void;
    /**
     * Draw bezier curve to SVG path.
     * @internal
     * @param {SVGPathElement} path - SVG path element
     * @param {number} x1 - Start x coordinate
     * @param {number} y1 - Start y coordinate
     * @param {number} x2 - End x coordinate
     * @param {number} y2 - End y coordinate
     */
    _bezier_to(path: SVGPathElement, x1: number, y1: number, x2: number, y2: number): void;
    /**
     * Draw straight line to SVG path.
     * @internal
     * @param {SVGPathElement} path - SVG path element
     * @param {number} x1 - Start x coordinate
     * @param {number} y1 - Start y coordinate
     * @param {number} x2 - End x coordinate
     * @param {number} y2 - End y coordinate
     */
    _line_to(path: SVGPathElement, x1: number, y1: number, x2: number, y2: number): void;
}
/**
 * Canvas-based graph renderer.
 */
declare class CanvasGraph {
    /**
     * Create canvas graph renderer.
     * @param {import('./jsmind.view_provider.js').ViewProvider} view - View provider instance
     */
    constructor(view: import("./jsmind.view_provider.js").ViewProvider);
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
    dpr: any;
    /** Choose line drawing renderer. */
    init_line_render(): void;
    drawing: ((ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => void) | ((ctx: any, x1: any, y1: any, x2: any, y2: any) => void);
    /** @returns {HTMLCanvasElement} */
    element(): HTMLCanvasElement;
    /** @param {number} w @param {number} h */
    set_size(w: number, h: number): void;
    /** Clear the canvas. */
    clear(): void;
    /** @param {{x:number,y:number}} pout @param {{x:number,y:number}} pin @param {{x:number,y:number}} offset @param {string=} color */
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
    /** @param {CanvasRenderingContext2D} dest_canvas_ctx @param {Function=} callback */
    copy_to(dest_canvas_ctx: CanvasRenderingContext2D, callback?: Function | undefined): void;
    /**
     * Draw bezier curve on canvas.
     * @internal
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} x1 - Start x coordinate
     * @param {number} y1 - Start y coordinate
     * @param {number} x2 - End x coordinate
     * @param {number} y2 - End y coordinate
     */
    _bezier_to(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number): void;
    /**
     * Draw straight line on canvas.
     * @internal
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} x1 - Start x coordinate
     * @param {number} y1 - Start y coordinate
     * @param {number} x2 - End x coordinate
     * @param {number} y2 - End y coordinate
     */
    _line_to(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number): void;
}
export {};
