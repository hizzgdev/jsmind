/**
 * @license BSD
 * @copyright 2014-2023 hizzgdev@163.com
 *
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */

import { util } from './jsmind.util.js';

const default_options = {
    container: '', // id of the container
    editable: false, // you can change it in your options
    theme: null,
    mode: 'full', // full or side
    support_html: true,
    log_level: 'info',

    view: {
        engine: 'canvas',
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

export function merge_option(options) {
    var opts = {};
    util.json.merge(opts, default_options);
    util.json.merge(opts, options);

    if (!opts.container) {
        throw new Error('the options.container should not be null or empty.');
    }
    return opts;
}
