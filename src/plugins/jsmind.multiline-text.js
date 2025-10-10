/**
 * @license BSD
 * @copyright 2014-2025 UmbraCi
 *
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */

import jsMind from 'jsmind';

const $ = jsMind.$;

/**
 * Multiline Text Plugin
 * Provides multiline text support for jsMind nodes
 */

/**
 * Default plugin options
 * @typedef {Object} MultilineTextOptions
 * @property {number} text_width - Maximum width for multiline text nodes (default: 200)
 * @property {string} line_height - Line height for text (default: '1.5')
 */
const DEFAULT_OPTIONS = {
    text_width: 200,
    line_height: '1.5',
};

/**
 * Create a custom node render function for multiline text
 * @param {MultilineTextOptions} [options={}] - Plugin options
 * @param {number} [options.text_width=200] - Maximum width for multiline text nodes
 * @param {string} [options.line_height='1.5'] - Line height for text
 * @returns {function(jsMind, HTMLElement, Node): boolean} Custom render function
 * @example
 * const options = {
 *     view: {
 *         custom_node_render: createMultilineRender({
 *             text_width: 250,
 *             line_height: '1.6',
 *         })
 *     }
 * };
 */
export function createMultilineRender(options = {}) {
    const opts = Object.assign({}, DEFAULT_OPTIONS, options);

    return function (jm, element, node) {
        if (node.topic && node.topic.includes('\n')) {
            // Multiline text - apply styles BEFORE setting content
            element.style.whiteSpace = 'pre-wrap';
            element.style.wordBreak = 'break-word';
            element.style.maxWidth = opts.text_width + 'px';
            element.textContent = node.topic;
            return true;
        }
        // Single line text - use default render
        return false;
    };
}

/**
 * Re-render all nodes to apply multiline styles and recalculate sizes
 * @param {import('../jsmind.js').default} jm - jsMind instance
 * @private
 */
function _rerender_all_nodes(jm) {
    const view = jm.view;
    const mind = jm.mind;

    if (!mind || !mind.root) {
        return;
    }

    // Collect all nodes to update
    const nodesToUpdate = [];
    for (const nodeId in mind.nodes) {
        const node = mind.nodes[nodeId];
        if (node._data && node._data.view && node._data.view.element) {
            nodesToUpdate.push(node);
        }
    }

    // Batch render nodes (only update DOM, no layout trigger)
    for (const node of nodesToUpdate) {
        const element = node._data.view.element;
        view.render_node(element, node);
    }

    // Batch update node sizes (read all sizes at once to avoid layout thrashing)
    for (const node of nodesToUpdate) {
        if (jm.layout.is_visible(node)) {
            const element = node._data.view.element;
            node._data.view.width = element.clientWidth;
            node._data.view.height = element.clientHeight;
        }
    }

    // Finally recalculate layout and show (only trigger reflow/repaint once)
    jm.layout.layout();
    jm.view.show(false);
}

/**
 * Plugin initialization function
 * @param {import('../jsmind.js').default} jm - jsMind instance
 * @param {MultilineTextOptions} options - Plugin options
 * @private
 */
function init(jm, options) {
    console.log('[Multiline Plugin] Initializing...', options);

    const opts = Object.assign({}, DEFAULT_OPTIONS, options);
    const view = jm.view;

    // Plugin state
    let editing_node = null;
    let multiline_editor = null;

    // IMPORTANT: Re-set view.render_node to use custom render
    // Because ViewProvider constructor already set it based on options.custom_node_render
    // We need to ensure it uses the custom render function
    if (view.opts.custom_node_render) {
        view.render_node = view._custom_node_render.bind(view);
        console.log('[Multiline Plugin] Re-bound view.render_node');
    }

    // Re-render all nodes to apply multiline styles
    if (jm.mind && jm.mind.root) {
        _rerender_all_nodes(jm);
        console.log('[Multiline Plugin] Re-rendered all nodes');
    }

    /**
     * Begin editing a node with multiline support
     * @param {import('../jsmind.node.js').Node} node
     */
    view.edit_node_begin = function (node) {
        console.log('[Multiline Plugin] edit_node_begin called', node);
        if (!node.topic) {
            return;
        }

        // End editing if another node is being edited
        if (editing_node) {
            view.edit_node_end();
        }

        editing_node = node;
        view.editing_node = node;

        // Create editor (div with contentEditable)
        const editor = $.c('div');
        editor.contentEditable = 'plaintext-only';
        editor.className = 'jsmind-multiline-editor';
        editor.textContent = node.topic;
        multiline_editor = editor;

        // Get element and set editor styles to match
        const element = node._data.view.element;

        // Set editor styles to match element width, auto-expand height
        Object.assign(editor.style, {
            width: 'auto',
            minHeight: element.clientHeight + 'px',
            lineHeight: opts.line_height,
            border: 'none',
            outline: 'none',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            boxSizing: 'border-box',
            overflow: 'hidden',
        });

        // Auto-expand height on input
        const autoExpand = () => {
            editor.style.height = 'auto';
            editor.style.height = editor.scrollHeight + 'px';
        };
        $.on(editor, 'input', autoExpand);
        // Initial expand
        setTimeout(autoExpand, 0);

        // Keyboard events
        $.on(editor, 'keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                view.edit_node_end();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                cancel_editing();
            } else if (e.key === 'Tab') {
                e.preventDefault();
                view.edit_node_end();
            }
        });

        // Blur event - save on blur
        $.on(editor, 'blur', () => {
            setTimeout(() => {
                if (editing_node) {
                    view.edit_node_end();
                }
            }, 100);
        });

        // Replace node content and focus
        element.innerHTML = '';
        element.appendChild(editor);
        element.style.zIndex = 5;
        editor.focus();

        // Select all text
        const range = $.d.createRange();
        range.selectNodeContents(editor);
        const selection = $.w.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    };

    /**
     * End editing and save changes
     */
    view.edit_node_end = function () {
        if (!editing_node || !multiline_editor) {
            return;
        }

        const node = editing_node;
        const topic = (multiline_editor.textContent || '')
            .trim()
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            .replace(/\n{3,}/g, '\n\n');

        // Clean up editor
        cleanup_editor();

        // Update node if content changed
        if (!jsMind.util.text.is_empty(topic) && node.topic !== topic) {
            jm.update_node(node.id, topic);
        } else {
            view.render_node(node._data.view.element, node);
        }

        // Focus panel
        view.e_panel.focus();
    };

    /**
     * Cancel editing without saving changes
     */
    function cancel_editing() {
        if (!editing_node || !multiline_editor) {
            return;
        }

        const node = editing_node;

        // Clean up editor
        cleanup_editor();

        // Re-render node
        view.render_node(node._data.view.element, node);

        // Focus panel
        view.e_panel.focus();
    }

    /**
     * Clean up editor and reset state
     */
    function cleanup_editor() {
        if (!editing_node || !multiline_editor) {
            return;
        }

        const element = editing_node._data.view.element;

        // Remove editor
        if (multiline_editor.parentNode) {
            multiline_editor.parentNode.removeChild(multiline_editor);
        }

        // Reset styles and state
        element.style.zIndex = 'auto';
        editing_node = null;
        view.editing_node = null;
        multiline_editor = null;
    }
}

// Register plugin
jsMind.register_plugin(new jsMind.plugin('multiline_text', init));

// Export for ES6 modules
export default {
    name: 'multiline_text',
    init,
    createMultilineRender,
};
