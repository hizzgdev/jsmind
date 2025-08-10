export function init_graph(view: any, engine: any): SvgGraph | CanvasGraph;
declare class SvgGraph {
    static c(tag: any): any;
    constructor(view: any);
    view: any;
    opts: any;
    e_svg: any;
    size: {
        w: number;
        h: number;
    };
    lines: any[];
    line_drawing: {
        straight: (path: any, x1: any, y1: any, x2: any, y2: any) => void;
        curved: (path: any, x1: any, y1: any, x2: any, y2: any) => void;
    };
    init_line_render(): void;
    drawing: any;
    element(): any;
    set_size(w: any, h: any): void;
    clear(): void;
    draw_line(pout: any, pin: any, offset: any, color: any): void;
    copy_to(dest_canvas_ctx: any, callback: any): void;
    _bezier_to(path: any, x1: any, y1: any, x2: any, y2: any): void;
    _line_to(path: any, x1: any, y1: any, x2: any, y2: any): void;
}
declare class CanvasGraph {
    constructor(view: any);
    opts: any;
    e_canvas: any;
    canvas_ctx: any;
    size: {
        w: number;
        h: number;
    };
    line_drawing: {
        straight: (ctx: any, x1: any, y1: any, x2: any, y2: any) => void;
        curved: (ctx: any, x1: any, y1: any, x2: any, y2: any) => void;
    };
    dpr: any;
    init_line_render(): void;
    drawing: any;
    element(): any;
    set_size(w: any, h: any): void;
    clear(): void;
    draw_line(pout: any, pin: any, offset: any, color: any): void;
    copy_to(dest_canvas_ctx: any, callback: any): void;
    _bezier_to(ctx: any, x1: any, y1: any, x2: any, y2: any): void;
    _line_to(ctx: any, x1: any, y1: any, x2: any, y2: any): void;
}
export {};
