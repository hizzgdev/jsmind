/**
 * @license BSD
 * @copyright 2014-2025 hizzgdev@163.com
 *
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */

import { util } from './jsmind.util.js';

/**
 * @typedef {{
 *  container: string|HTMLElement,
 *  editable?: boolean,
 *  theme?: (string|null),
 *  mode?: ('full'|'side'),
 *  support_html?: boolean,
 *  enable_multiline?: boolean,
 *  textAutoWrapWidth?: number,
 *  log_level?: 'debug'|'info'|'warn'|'error'|'disable',
 *  view?: {
 *    engine?: 'canvas'|'svg',
 *    enable_device_pixel_ratio?: boolean,
 *    hmargin?: number,
 *    vmargin?: number,
 *    line_width?: number,
 *    line_color?: string,
 *    line_style?: 'curved'|'straight',
 *    custom_line_render?: (this: object, arg:{ ctx: CanvasRenderingContext2D|SVGPathElement, start_point:{x:number,y:number}, end_point:{x:number,y:number} })=>void,
 *    draggable?: boolean,
 *    hide_scrollbars_when_draggable?: boolean,
 *    node_overflow?: 'hidden'|'wrap'|'visible',
 *    zoom?: { min?:number, max?:number, step?:number, mask_key?:number },
 *    custom_node_render?: (null|((jm: import('./jsmind.js').default, ele: HTMLElement, node: import('./jsmind.node.js').Node)=>void)),
 *    expander_style?: 'char'|'number'
 *  },
 *  layout?: { hspace?:number, vspace?:number, pspace?:number, cousin_space?:number },
 *  default_event_handle?: { enable_mousedown_handle?:boolean, enable_click_handle?:boolean, enable_dblclick_handle?:boolean, enable_mousewheel_handle?:boolean },
 *  shortcut?: { enable?:boolean, handles?: Record<string,(jm: import('./jsmind.js').default, e: KeyboardEvent)=>void>, mapping?: Record<string, number|number[]>, id_generator?: ()=>string },
 *  plugin?: Record<string, object>
 * }} JsMindRuntimeOptions
 */
/** @type {JsMindRuntimeOptions} */
const default_options = {
    container: '', // id of the container
    editable: false, // you can change it in your options
    theme: null,
    mode: 'full', // full or side
    support_html: true,
    enable_multiline: false, // true: use contenteditable div for multiline editing, false: use input for single line
    textAutoWrapWidth: 300, // Maximum width for text auto-wrapping in multiline mode
    log_level: 'info',

    view: {
        engine: 'canvas',
        enable_device_pixel_ratio: false,
        hmargin: 100,
        vmargin: 50,
        line_width: 2,
        line_color: '#555',
        line_style: 'curved', // [straight | curved]
        draggable: false, // drag the mind map with your mouse, when it's larger that the container
        hide_scrollbars_when_draggable: false, // hide container scrollbars, when mind map is larger than container and draggable option is true.
        node_overflow: 'hidden', // [hidden | wrap]
        zoom: {
            min: 0.5,
            max: 2.1,
            step: 0.1,
            mask_key: 4096,
        },
        custom_node_render: null,
        expander_style: 'char', // [char | number]
    },
    layout: {
        hspace: 30,
        vspace: 20,
        pspace: 13,
        cousin_space: 0,
    },
    default_event_handle: {
        enable_mousedown_handle: true,
        enable_click_handle: true,
        enable_dblclick_handle: true,
        enable_mousewheel_handle: true,
    },
    shortcut: {
        enable: true,
        handles: {},
        mapping: {
            addchild: [45, 4096 + 13], // Insert, Ctrl+Enter
            addbrother: 13, // Enter
            editnode: 113, // F2
            delnode: 46, // Delete
            toggle: 32, // Space
            left: 37, // Left
            up: 38, // Up
            right: 39, // Right
            down: 40, // Down
        },
    },
    plugin: {},
};

/**
 * Merge user options with defaults. Throws if container missing.
 * @param {JsMindRuntimeOptions} options
 * @returns {JsMindRuntimeOptions}
 */
export function merge_option(options) {
    var opts = {};
    util.json.merge(opts, default_options);
    util.json.merge(opts, options);

    if (!opts.container) {
        throw new Error('the options.container should not be null or empty.');
    }
    return opts;
}
