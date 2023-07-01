/**
 * @license BSD
 * @copyright 2014-2023 hizzgdev@163.com
 *
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */

import { $ } from './jsmind.dom.js';

class SvgGraph {
    constructor(view) {
        this.view = view;
        this.opts = view.opts;
        this.e_svg = SvgGraph.c('svg');
        this.e_svg.setAttribute('class', 'jsmind');
        this.size = { w: 0, h: 0 };
        this.lines = [];
        this.line_drawing = {
            straight: this._line_to,
            curved: this._bezier_to,
        };
        this.drawing = this.line_drawing[this.opts.line_style] || this.line_drawing.curved;
    }
    static c(tag) {
        return $.d.createElementNS('http://www.w3.org/2000/svg', tag);
    }
    element() {
        return this.e_svg;
    }
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

    copy_to(dest_canvas_ctx, callback) {
        var img = new Image();
        img.onload = function () {
            dest_canvas_ctx.drawImage(img, 0, 0);
            !!callback && callback();
        };
        img.src =
            'data:image/svg+xml;base64,' + btoa(new XMLSerializer().serializeToString(this.e_svg));
    }
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
    _line_to(path, x1, y1, x2, y2) {
        path.setAttribute('d', 'M ' + x1 + ' ' + y1 + ' L ' + x2 + ' ' + y2);
    }
}

class CanvasGraph {
    constructor(view) {
        this.opts = view.opts;
        this.e_canvas = $.c('canvas');
        this.e_canvas.className = 'jsmind';
        this.canvas_ctx = this.e_canvas.getContext('2d');
        this.size = { w: 0, h: 0 };
        this.line_drawing = {
            straight: this._line_to,
            curved: this._bezier_to,
        };
        this.drawing = this.line_drawing[this.opts.line_style] || this.line_drawing.curved;
    }
    element() {
        return this.e_canvas;
    }
    set_size(w, h) {
        this.size.w = w;
        this.size.h = h;
        this.e_canvas.width = w;
        this.e_canvas.height = h;
    }
    clear() {
        this.canvas_ctx.clearRect(0, 0, this.size.w, this.size.h);
    }
    draw_line(pout, pin, offset, color) {
        var ctx = this.canvas_ctx;
        ctx.strokeStyle = color || this.opts.line_color;
        ctx.lineWidth = this.opts.line_width;
        ctx.lineCap = 'round';
        this.drawing(ctx, pin.x + offset.x, pin.y + offset.y, pout.x + offset.x, pout.y + offset.y);
    }
    copy_to(dest_canvas_ctx, callback) {
        dest_canvas_ctx.drawImage(this.e_canvas, 0, 0);
        !!callback && callback();
    }
    _bezier_to(ctx, x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.bezierCurveTo(x1 + ((x2 - x1) * 2) / 3, y1, x1, y2, x2, y2);
        ctx.stroke();
    }
    _line_to(ctx, x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
}

export function init_graph(view, engine) {
    return engine.toLowerCase() === 'svg' ? new SvgGraph(view) : new CanvasGraph(view);
}
