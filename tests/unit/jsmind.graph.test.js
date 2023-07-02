import { expect, jest, test } from '@jest/globals';

import { $ } from '../../src/jsmind.dom.js';
import { init_graph } from '../../src/jsmind.graph.js';

const view = {
    opts: {
        line_color: 'color',
        line_width: 1,
    },
};

const view_straight_line = {
    opts: {
        line_color: 'color',
        line_width: 1,
        line_style: 'straight',
    },
};

describe('graph over canvas', () => {
    const canvas_ctx = {
        beginPath: jest.fn(),
        moveTo: jest.fn(),
        lineTo: jest.fn(),
        bezierCurveTo: jest.fn(),
        stroke: jest.fn(),
        clearRect: jest.fn(),
    };

    const mockCanvas = {
        getContext: () => canvas_ctx,
    };
    $.c = () => mockCanvas;
    const graph = init_graph(view, 'canvas');

    test('graph.element', () => {
        expect(graph.element()).toEqual(mockCanvas);
    });

    test('graph.set_size', () => {
        graph.set_size(10, 10);
        expect(graph.size).toEqual({ w: 10, h: 10 });
        expect(mockCanvas.width).toBe(10);
        expect(mockCanvas.height).toBe(10);
        graph.set_size(0, 0);
        expect(graph.size).toEqual({ w: 0, h: 0 });
        expect(mockCanvas.width).toBe(0);
        expect(mockCanvas.height).toBe(0);
    });

    test('graph.clear', () => {
        graph.clear();
        expect(canvas_ctx.clearRect).toBeCalledWith(0, 0, 0, 0);
    });

    test('graph.draw_line', () => {
        graph.draw_line({ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 });
        expect(canvas_ctx.strokeStyle).toBe(view.opts.line_color);
        expect(canvas_ctx.lineWidth).toBe(view.opts.line_width);
        expect(canvas_ctx.lineCap).toBe('round');

        expect(canvas_ctx.beginPath).toBeCalled();
        expect(canvas_ctx.moveTo).toBeCalledWith(5, 5);
        expect(canvas_ctx.bezierCurveTo).toBeCalledWith(5 - 2 / 3, 5, 5, 4, 4, 4);
        expect(canvas_ctx.stroke).toBeCalled();
    });

    test('graph.draw_straight_line', () => {
        let graph2 = init_graph(view_straight_line, 'canvas');
        graph2.draw_line({ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 });
        expect(canvas_ctx.strokeStyle).toBe(view_straight_line.opts.line_color);
        expect(canvas_ctx.lineWidth).toBe(view_straight_line.opts.line_width);
        expect(canvas_ctx.lineCap).toBe('round');

        expect(canvas_ctx.beginPath).toBeCalled();
        expect(canvas_ctx.moveTo).toBeCalledWith(5, 5);
        expect(canvas_ctx.lineTo).toBeCalledWith(4, 4);
        expect(canvas_ctx.stroke).toBeCalled();
    });

    test('graph.copy_to', () => {
        const mockDest = { drawImage: jest.fn() };
        const callback = jest.fn();
        graph.copy_to(mockDest, callback);
        expect(mockDest.drawImage).toBeCalledWith(mockCanvas, 0, 0);
        expect(callback).toBeCalled();
    });
});

describe('graph over svg', () => {
    const mockSVG = {
        setAttribute: (key, value) => {
            mockSVG[key] = value;
        },
        removeChild: jest.fn(),
        appendChild: jest.fn(),
    };

    const mockSetAttribute = jest.fn();
    $.d.createElementNS = (ns, tag) => {
        if (tag === 'svg') {
            return mockSVG;
        }
        return {
            setAttribute: mockSetAttribute,
        };
    };
    const graph = init_graph(view, 'svg');

    test('graph.element', () => {
        expect(graph.element()).toEqual(mockSVG);
    });

    test('graph.set_size', () => {
        graph.set_size(10, 10);
        expect(graph.size).toEqual({ w: 10, h: 10 });
        expect(mockSVG.width).toBe(10);
        expect(mockSVG.height).toBe(10);
        graph.set_size(0, 0);
        expect(graph.size).toEqual({ w: 0, h: 0 });
        expect(mockSVG.width).toBe(0);
        expect(mockSVG.height).toBe(0);
    });

    test('graph.clear', () => {
        graph.draw_line({ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 });
        graph.clear();
        expect(mockSVG.removeChild).toBeCalled();
        expect(graph.lines.length).toBe(0);
    });

    test('graph.draw_line', () => {
        graph.draw_line({ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 });
        expect(mockSetAttribute).toHaveBeenNthCalledWith(1, 'stroke', view.opts.line_color);
        expect(mockSetAttribute).toHaveBeenNthCalledWith(2, 'stroke-width', view.opts.line_width);
        expect(mockSetAttribute).toHaveBeenNthCalledWith(3, 'fill', 'transparent');
        const path = 'M 5 5 C ' + (5 - 2 / 3) + ' 5, 5 4, 4 4';
        expect(mockSetAttribute).toHaveBeenNthCalledWith(4, 'd', path);
    });

    test('graph.draw_straight_line', () => {
        let graph2 = init_graph(view_straight_line, 'svg');
        graph2.draw_line({ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 });
        expect(mockSetAttribute).toHaveBeenNthCalledWith(
            9,
            'stroke',
            view_straight_line.opts.line_color
        );
        expect(mockSetAttribute).toHaveBeenNthCalledWith(
            10,
            'stroke-width',
            view_straight_line.opts.line_width
        );
        expect(mockSetAttribute).toHaveBeenNthCalledWith(11, 'fill', 'transparent');
        const path = 'M 5 5 L 4 4';
        expect(mockSetAttribute).toHaveBeenNthCalledWith(12, 'd', path);
    });

    test('graph.copy_to', () => {
        const originXMLSerializer = global.XMLSerializer;
        const originImage = global.Image;

        global.XMLSerializer = class {
            serializeToString = () => 'fake data';
        };
        const mockImage = {};
        global.Image = class {
            constructor() {
                return mockImage;
            }
        };
        const mockDest = { drawImage: jest.fn() };
        const callback = jest.fn();
        graph.copy_to(mockDest, callback);
        mockImage.onload();

        expect(mockDest.drawImage).toBeCalledWith(mockImage, 0, 0);
        expect(callback).toBeCalled();

        global.XMLSerializer = originXMLSerializer;
        global.Image = originImage;
    });
});
