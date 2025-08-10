/**
 * @license BSD
 * @copyright 2014-2025 hizzgdev@163.com
 *
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */

import { $ } from './jsmind.dom.js';
import { logger } from './jsmind.common.js';

/**
 * SVG-based graph renderer.
 */
class SvgGraph {
    /**
     * Create SVG graph renderer.
     * @param {import('./jsmind.view_provider.js').ViewProvider} view - View provider instance
     */
    constructor(view) {
        this.view = view;
        this.opts = view.opts;
        this.e_svg = SvgGraph.c('svg');
        this.e_svg.setAttribute('class', 'jsmind');
        this.size = { w: 0, h: 0 };
        /** @type {SVGPathElement[]} */
        this.lines = [];
        this.line_drawing = {
            straight: this._line_to,
            curved: this._bezier_to,
        };
        this.init_line_render();
    }
    /** @param {string} tag */
    static c(tag) {
        return $.d.createElementNS('http://www.w3.org/2000/svg', tag);
    }
    /** Choose line drawing renderer. */
    init_line_render() {
        if (typeof this.opts.custom_line_render === 'function') {
            /** @type {(path:SVGPathElement,x1:number,y1:number,x2:number,y2:number)=>void} */
            this.drawing = (path, x1, y1, x2, y2) => {
                try {
                    this.opts.custom_line_render.call(this, {
                        ctx: path,
                        start_point: { x: x1, y: y1 },
                        end_point: { x: x2, y: y2 },
                    });
                } catch (e) {
                    logger.error('custom line renderer error: ', e);
                }
            };
        } else {
            /** @type {(path:SVGPathElement,x1:number,y1:number,x2:number,y2:number)=>void} */
            this.drawing = this.line_drawing[this.opts.line_style] || this.line_drawing.curved;
        }
    }
    /** @returns {SVGSVGElement} */
    element() {
        return this.e_svg;
    }
    /** @param {number} w @param {number} h */
    set_size(w, h) {
        this.size.w = w;
        this.size.h = h;
        this.e_svg.setAttribute('width', w);
        this.e_svg.setAttribute('height', h);
    }
    clear() {
        var len = this.lines.length;
        while (len--) {
            this.e_svg.removeChild(this.lines[len]);
        }
        this.lines.length = 0;
    }
    /** @param {{x:number,y:number}} pout @param {{x:number,y:number}} pin @param {{x:number,y:number}} offset @param {string=} color */
    draw_line(pout, pin, offset, color) {
        var line = SvgGraph.c('path');
        line.setAttribute('stroke', color || this.opts.line_color);
        line.setAttribute('stroke-width', this.opts.line_width);
        line.setAttribute('fill', 'transparent');
        this.lines.push(line);
        this.e_svg.appendChild(line);
        this.drawing(
            line,
            pin.x + offset.x,
            pin.y + offset.y,
            pout.x + offset.x,
            pout.y + offset.y
        );
    }

    /** @param {CanvasRenderingContext2D} dest_canvas_ctx @param {(()=>void)=} callback */
    copy_to(dest_canvas_ctx, callback) {
        var img = new Image();
        img.onload = function () {
            dest_canvas_ctx.drawImage(img, 0, 0);
            !!callback && callback();
        };
        img.src =
            'data:image/svg+xml;base64,' + btoa(new XMLSerializer().serializeToString(this.e_svg));
    }
    /**
     * Draw bezier curve to SVG path.
     * @internal
     * @param {SVGPathElement} path - SVG path element
     * @param {number} x1 - Start x coordinate
     * @param {number} y1 - Start y coordinate
     * @param {number} x2 - End x coordinate
     * @param {number} y2 - End y coordinate
     */
    _bezier_to(path, x1, y1, x2, y2) {
        path.setAttribute(
            'd',
            'M ' +
                x1 +
                ' ' +
                y1 +
                ' C ' +
                (x1 + ((x2 - x1) * 2) / 3) +
                ' ' +
                y1 +
                ', ' +
                x1 +
                ' ' +
                y2 +
                ', ' +
                x2 +
                ' ' +
                y2
        );
    }
    /**
     * Draw straight line to SVG path.
     * @internal
     * @param {SVGPathElement} path - SVG path element
     * @param {number} x1 - Start x coordinate
     * @param {number} y1 - Start y coordinate
     * @param {number} x2 - End x coordinate
     * @param {number} y2 - End y coordinate
     */
    _line_to(path, x1, y1, x2, y2) {
        path.setAttribute('d', 'M ' + x1 + ' ' + y1 + ' L ' + x2 + ' ' + y2);
    }
}

/**
 * Canvas-based graph renderer.
 */
class CanvasGraph {
    /**
     * Create canvas graph renderer.
     * @param {import('./jsmind.view_provider.js').ViewProvider} view - View provider instance
     */
    constructor(view) {
        this.opts = view.opts;
        this.e_canvas = $.c('canvas');
        this.e_canvas.className = 'jsmind';
        this.canvas_ctx = /** @type {CanvasRenderingContext2D} */ (this.e_canvas.getContext('2d'));
        this.size = { w: 0, h: 0 };
        this.line_drawing = {
            straight: this._line_to,
            curved: this._bezier_to,
        };
        this.dpr = view.device_pixel_ratio;
        this.init_line_render();
    }
    /** Choose line drawing renderer. */
    init_line_render() {
        if (typeof this.opts.custom_line_render === 'function') {
            /** @type {(ctx:CanvasRenderingContext2D,x1:number,y1:number,x2:number,y2:number)=>void} */
            this.drawing = (ctx, x1, y1, x2, y2) => {
                try {
                    this.opts.custom_line_render.call(this, {
                        ctx,
                        start_point: { x: x1, y: y1 },
                        end_point: { x: x2, y: y2 },
                    });
                } catch (e) {
                    logger.error('custom line render error: ', e);
                }
            };
        } else {
            /** @type {(ctx:CanvasRenderingContext2D,x1:number,y1:number,x2:number,y2:number)=>void} */
            this.drawing = this.line_drawing[this.opts.line_style] || this.line_drawing.curved;
        }
    }
    /** @returns {HTMLCanvasElement} */
    element() {
        return this.e_canvas;
    }
    /** @param {number} w @param {number} h */
    set_size(w, h) {
        this.size.w = w;
        this.size.h = h;
        if (this.e_canvas.width && this.e_canvas.height && this.canvas_ctx.scale) {
            this.e_canvas.width = w * this.dpr;
            this.e_canvas.height = h * this.dpr;

            this.e_canvas.style.width = w + 'px';
            this.e_canvas.style.height = h + 'px';
            this.canvas_ctx.scale(this.dpr, this.dpr);
        } else {
            this.e_canvas.width = w;
            this.e_canvas.height = h;
        }
    }

    /** Clear the canvas. */
    clear() {
        this.canvas_ctx.clearRect(0, 0, this.size.w, this.size.h);
    }
    /** @param {{x:number,y:number}} pout @param {{x:number,y:number}} pin @param {{x:number,y:number}} offset @param {string=} color */
    draw_line(pout, pin, offset, color) {
        var ctx = this.canvas_ctx;
        ctx.strokeStyle = color || this.opts.line_color;
        ctx.lineWidth = this.opts.line_width;
        ctx.lineCap = 'round';
        this.drawing(ctx, pin.x + offset.x, pin.y + offset.y, pout.x + offset.x, pout.y + offset.y);
    }
    /** @param {CanvasRenderingContext2D} dest_canvas_ctx @param {(()=>void)=} callback */
    copy_to(dest_canvas_ctx, callback) {
        dest_canvas_ctx.drawImage(this.e_canvas, 0, 0, this.size.w, this.size.h);
        !!callback && callback();
    }
    /**
     * Draw bezier curve on canvas.
     * @internal
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} x1 - Start x coordinate
     * @param {number} y1 - Start y coordinate
     * @param {number} x2 - End x coordinate
     * @param {number} y2 - End y coordinate
     */
    _bezier_to(ctx, x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.bezierCurveTo(x1 + ((x2 - x1) * 2) / 3, y1, x1, y2, x2, y2);
        ctx.stroke();
    }
    /**
     * Draw straight line on canvas.
     * @internal
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} x1 - Start x coordinate
     * @param {number} y1 - Start y coordinate
     * @param {number} x2 - End x coordinate
     * @param {number} y2 - End y coordinate
     */
    _line_to(ctx, x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
}

/**
 * Initialize graph renderer based on engine type.
 * @param {import('./jsmind.view_provider.js').ViewProvider} view - View provider instance
 * @param {'canvas'|'svg'} engine - Rendering engine type
 * @returns {SvgGraph|CanvasGraph} Graph renderer instance
 */
export function init_graph(view, engine) {
    return engine.toLowerCase() === 'svg' ? new SvgGraph(view) : new CanvasGraph(view);
}
