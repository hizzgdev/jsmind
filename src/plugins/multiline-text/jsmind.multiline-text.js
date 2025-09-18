/**
 * @license BSD
 * @copyright 2014-2025 hizzgdev@163.com
 *
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */

import jsMind from 'jsmind';

if (!jsMind) {
    throw new Error('jsMind is not defined');
}

const $ = jsMind.$;
const { util } = jsMind;

/**
 * Default options for multiline text plugin.
 * @typedef {Object} MultilineTextOptions
 * @property {boolean} [enable_multiline] - Enable multiline text editing
 * @property {number} [textAutoWrapWidth] - Maximum width for text auto-wrapping
 * @property {boolean} [support_html] - Support HTML content in nodes
 */
const DEFAULT_OPTIONS = {
    enable_multiline: true,
    textAutoWrapWidth: 300,
    support_html: true,
};

/**
 * Multiline text plugin for jsMind.
 * Enables multiline text editing and display in mind map nodes.
 */
export class MultilineText {
    /**
     * Create multiline text plugin instance.
     * @param {import('../../jsmind.js').default} jm - jsMind instance
     * @param {Partial<MultilineTextOptions>} options - Plugin options
     */
    constructor(jm, options) {
        var opts = {};
        jsMind.util.json.merge(opts, DEFAULT_OPTIONS);
        jsMind.util.json.merge(opts, options);

        this.version = '0.1.0';
        /** @type {import('../../jsmind.js').default} */
        this.jm = jm;
        /** @type {MultilineTextOptions} */
        this.options = opts;

        // Store original methods for restoration
        this.original_methods = {};

        // Editor input handler for dynamic resize
        this._editor_input_handler = null;
    }

    /** Initialize the multiline text plugin. */
    init() {
        // Apply plugin options to jsMind instance
        this.jm.options.enable_multiline = this.options.enable_multiline;
        this.jm.options.textAutoWrapWidth = this.options.textAutoWrapWidth;
        this.jm.options.support_html = this.options.support_html;

        // Inject CSS styles
        this.inject_styles();

        // Override ViewProvider methods
        this.override_view_methods();
    }

    /** Inject CSS styles for multiline text support. */
    inject_styles() {
        var styleId = 'jsmind-multiline-text-plugin-style';
        var existingStyle = document.getElementById(styleId);

        if (existingStyle) {
            existingStyle.remove();
        }

        var style = document.createElement('style');
        style.id = styleId;
        style.textContent = this.get_css_content();
        document.head.appendChild(style);
    }

    /** Get CSS content for the plugin. */
    get_css_content() {
        var textAutoWrapWidth = this.options.textAutoWrapWidth;
        return `
/* Multiline text plugin styles */

/* Base editor styles */
.jsmind-editor {
    border: 2px solid #4caf50;
    border-radius: 4px;
    padding: 4px;
    margin: 0;
    outline: none;
    background: #fff;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    color: #000 !important;
}

.jsmind-editor:focus {
    border-color: #2196f3;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
}

/* Multiline editor using contenteditable div */
.jsmind-multiline-editor {
    min-height: 20px;
    word-wrap: break-word;
    overflow-wrap: break-word;
    white-space: pre-wrap;
    max-height: 200px;
    overflow-y: auto;
}

/* Input editor for single line text */
.jsmind-input-editor {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-height: 20px;
    border: none;
    outline: none;
}

/* Rich text editor (legacy support) */
.jsmind-rich-editor {
    min-height: 20px;
    word-wrap: break-word;
    overflow-wrap: break-word;
    white-space: normal;
    max-height: 200px;
    overflow-y: auto;
}

/* Multiline node styles */
jmnode.multiline {
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-wrap: break-word;
    max-width: ${textAutoWrapWidth}px !important;
    line-height: 1.4;
    overflow-wrap: anywhere;
    word-break: break-word;
}

/* Rich text node styles */
jmnode.rich-text {
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
    max-width: ${textAutoWrapWidth}px;
}

/* Rich text formatting support */
jmnode.rich-text b,
jmnode.rich-text strong {
    font-weight: bold;
}

jmnode.rich-text i,
jmnode.rich-text em {
    font-style: italic;
}

jmnode.rich-text u {
    text-decoration: underline;
}

jmnode.rich-text ul,
jmnode.rich-text ol {
    margin: 4px 0;
    padding-left: 20px;
}

jmnode.rich-text li {
    margin: 2px 0;
}

/* Multiline text specific styles */
jmnode.multiline br {
    line-height: inherit;
}

/* Responsive behavior for smaller screens */
@media (max-width: 768px) {
    jmnode.multiline,
    jmnode.rich-text {
        max-width: 250px !important;
    }

    .jsmind-multiline-editor {
        max-height: 150px;
    }
}

@media (max-width: 480px) {
    jmnode.multiline,
    jmnode.rich-text {
        max-width: 200px !important;
    }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
    .jsmind-editor {
        border-color: #000;
        border-width: 3px;
    }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
    .jsmind-editor {
        transition: none;
    }
}

/* Print styles */
@media print {
    .jsmind-editor {
        border: 1px solid #000;
        background: transparent;
    }

    jmnode.multiline,
    jmnode.rich-text {
        max-width: none;
        page-break-inside: avoid;
    }
}
        `;
    }

    /** Override ViewProvider methods to support multiline text. */
    override_view_methods() {
        var view = this.jm.view;
        var plugin = this;

        // Store original methods
        this.original_methods.init = view.init.bind(view);
        this.original_methods.load = view.load.bind(view);
        this.original_methods.create_node_element = view.create_node_element.bind(view);
        this.original_methods.reset_node_custom_style = view.reset_node_custom_style.bind(view);
        this.original_methods.edit_node_begin = view.edit_node_begin.bind(view);
        this.original_methods.edit_node_end = view.edit_node_end.bind(view);
        this.original_methods._default_node_render = view._default_node_render.bind(view);
        this.original_methods.init_nodes_size = view.init_nodes_size.bind(view);

        // Override init method to create appropriate editor
        view.init = function () {
            plugin.original_methods.init();
            plugin.setup_editor.call(plugin);
        };

        // Override load method to handle multiline layout
        view.load = function () {
            plugin.original_methods.load();
            plugin.handle_multiline_layout.call(plugin);
        };

        // Override create_node_element to add multiline class
        view.create_node_element = function (node, parent_node) {
            plugin.original_methods.create_node_element(node, parent_node);
            if (plugin.options.enable_multiline) {
                var element = node._data.view.element;
                if (element && !element.className.includes('multiline')) {
                    element.className += ' multiline';
                }
            }
        };

        // Override reset_node_custom_style to force recalculation
        view.reset_node_custom_style = function (node) {
            plugin.original_methods.reset_node_custom_style(node);
            plugin.force_recalc_node_size.call(plugin, node);
        };

        // Override edit_node_begin for multiline editing
        view.edit_node_begin = function (node) {
            if (!node.topic) {
                console.warn("don't edit image nodes");
                return;
            }
            if (view.editing_node != null) {
                view.edit_node_end();
            }

            // Ensure editor is properly set up for current mode
            plugin.setup_editor.call(plugin);

            // Set editing node
            view.editing_node = node;
            var view_data = node._data.view;
            var element = view_data.element;
            var topic = node.topic;
            var ncs = getComputedStyle(element);

            // Configure editor content based on multiline setting
            if (plugin.options.enable_multiline) {
                // Multiline mode: convert line breaks to <br> for contenteditable
                var content = util.text.html_escape(topic).replace(/\n/g, '<br>');
                view.e_editor.innerHTML = content;
            } else {
                // Single line mode: use value for input
                view.e_editor.value = topic;
            }

            // Set editor size to match original node size
            var padding_left = parseInt(ncs.getPropertyValue('padding-left')) || 0;
            var padding_right = parseInt(ncs.getPropertyValue('padding-right')) || 0;
            var padding_top = parseInt(ncs.getPropertyValue('padding-top')) || 0;
            var padding_bottom = parseInt(ncs.getPropertyValue('padding-bottom')) || 0;

            // Calculate content area size
            var contentWidth = element.clientWidth - padding_left - padding_right;
            var contentHeight = element.clientHeight - padding_top - padding_bottom;

            // Set editor size
            view.e_editor.style.width = contentWidth + 'px';

            if (plugin.options.enable_multiline) {
                // For multiline editor, set initial height to match content
                view.e_editor.style.minHeight = Math.max(contentHeight, 20) + 'px';
                view.e_editor.style.maxHeight = '300px'; // Still allow expansion
            }

            element.innerHTML = '';
            element.appendChild(view.e_editor);
            element.style.zIndex = 5;
            view.e_editor.focus();

            // Select content based on editor type
            if (plugin.options.enable_multiline) {
                // Multiline mode: select all content in contenteditable div
                var range = document.createRange();
                range.selectNodeContents(view.e_editor);
                var selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            } else {
                // Single line mode: select all content in input
                view.e_editor.select();
            }
        };

        // Override edit_node_end for multiline editing
        view.edit_node_end = function () {
            if (view.editing_node != null) {
                var node = view.editing_node;
                view.editing_node = null;
                var view_data = node._data.view;
                var element = view_data.element;
                var topic;

                // Get content based on editor type
                if (plugin.options.enable_multiline) {
                    // Multiline mode: convert <br> tags back to line breaks
                    var htmlContent = view.e_editor.innerHTML;
                    topic = htmlContent
                        .replace(/<br\s*\/?>/gi, '\n')
                        .replace(/<div>/gi, '\n')
                        .replace(/<\/div>/gi, '')
                        .replace(/<[^>]*>/g, '')
                        .replace(/&nbsp;/g, ' ')
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .replace(/&amp;/g, '&')
                        .trim();
                } else {
                    // Single line mode: get value from input
                    topic = view.e_editor.value;
                }

                element.style.zIndex = 'auto';
                element.removeChild(view.e_editor);

                if (util.text.is_empty(topic) || node.topic === topic) {
                    view.render_node(element, node);
                } else {
                    plugin.jm.update_node(node.id, topic);
                }
            }
            view.e_panel.focus();
        };

        // Override _default_node_render for multiline display
        view._default_node_render = function (ele, node) {
            plugin.render_node.call(plugin, ele, node);
        };

        // Override init_nodes_size for multiline size calculation
        view.init_nodes_size = function (node) {
            plugin.init_nodes_size.call(plugin, node);
        };
    }

    /** Setup editor based on multiline setting. */
    setup_editor() {
        var view = this.jm.view;

        // Remove existing editor if any
        if (view.e_editor && view.e_editor.parentNode) {
            view.e_editor.parentNode.removeChild(view.e_editor);
        }

        // Create editor based on multiline setting
        if (this.options.enable_multiline) {
            // Multiline mode: use contenteditable div
            view.e_editor = $.c('div');
            view.e_editor.contentEditable = true;
            view.e_editor.className = 'jsmind-editor jsmind-multiline-editor';
        } else {
            // Single line mode: use input
            view.e_editor = $.c('input');
            view.e_editor.type = 'text';
            view.e_editor.className = 'jsmind-editor jsmind-input-editor';
        }

        this.bind_editor_events();
    }

    /** Bind editor events based on editor type. */
    bind_editor_events() {
        var view = this.jm.view;
        var plugin = this;

        // Handle editor events based on editor type
        if (this.options.enable_multiline) {
            // Multiline mode: contenteditable div
            $.on(view.e_editor, 'keydown', function (e) {
                var evt = e || event;
                if (evt.keyCode == 13 && (evt.ctrlKey || evt.metaKey)) {
                    // Ctrl+Enter to finish editing
                    view.edit_node_end();
                    evt.stopPropagation();
                    evt.preventDefault();
                } else if (evt.keyCode == 27) {
                    // Escape to cancel editing
                    view.edit_node_end();
                    evt.stopPropagation();
                }
            });
        } else {
            // Single line mode: input
            $.on(view.e_editor, 'keydown', function (e) {
                var evt = e || event;
                if (evt.keyCode == 13) {
                    // Enter to finish editing
                    view.edit_node_end();
                    evt.stopPropagation();
                } else if (evt.keyCode == 27) {
                    // Escape to cancel editing
                    view.edit_node_end();
                    evt.stopPropagation();
                }
            });
        }

        $.on(view.e_editor, 'blur', function (e) {
            view.edit_node_end();
        });
    }

    /** Handle multiline layout after load. */
    handle_multiline_layout() {
        if (!this.options.enable_multiline) return;

        // Force re-layout after initialization for multiline nodes
        setTimeout(() => {
            var nodes = this.jm.mind.nodes;
            for (var nodeid in nodes) {
                var node = nodes[nodeid];
                if (node._data.view.element.classList.contains('multiline')) {
                    this.force_recalc_node_size(node);
                }
            }

            // Force re-layout and display
            this.jm.layout.layout();
            this.jm.view.show(false);
        }, 0);
    }

    /** Initialize node size with multiline support. */
    init_nodes_size(node) {
        var view_data = node._data.view;
        var element = view_data.element;

        // Special handling for multiline node size calculation
        if (this.options.enable_multiline && element.classList.contains('multiline')) {
            this.ensure_multiline_node_size(element);
        }

        view_data.width = element.clientWidth;
        view_data.height = element.clientHeight;
    }

    /**
     * Ensure correct size calculation for multiline nodes.
     * @param {HTMLElement} element - Node element
     */
    ensure_multiline_node_size(element) {
        var originalMaxWidth = element.style.maxWidth;
        var originalWidth = element.style.width;

        // Clear width restrictions to let content expand naturally
        element.style.maxWidth = 'none';
        element.style.width = 'auto';

        // Force redraw
        element.offsetHeight;

        // Get natural width
        var naturalWidth = element.clientWidth;
        var maxAllowedWidth = this.options.textAutoWrapWidth;

        // Restore styles
        element.style.maxWidth = originalMaxWidth;
        element.style.width = originalWidth;

        // If natural width exceeds limit, ensure max-width is applied
        if (naturalWidth > maxAllowedWidth) {
            element.style.maxWidth = maxAllowedWidth + 'px';
            element.offsetHeight; // Force redraw again
        }
    }

    /**
     * Force recalculation of node size.
     * @param {import('../../jsmind.node.js').Node} node - Node to recalculate
     */
    force_recalc_node_size(node) {
        var view_data = node._data.view;
        var element = view_data.element;

        // Check if layout system is initialized
        var isVisible =
            this.jm.layout && this.jm.layout.is_visible ? this.jm.layout.is_visible(node) : true;

        if (isVisible) {
            // For multiline nodes, ensure content is fully rendered
            if (this.options.enable_multiline && element.classList.contains('multiline')) {
                var originalMaxWidth = element.style.maxWidth;
                element.style.maxWidth = 'none';
                element.offsetHeight; // Force redraw
                element.style.maxWidth = originalMaxWidth;
            }

            view_data.width = element.clientWidth;
            view_data.height = element.clientHeight;
        } else {
            let origin_style = element.getAttribute('style');
            element.style = 'visibility: visible; left:0; top:0;';

            if (this.options.enable_multiline && element.classList.contains('multiline')) {
                var originalMaxWidth = element.style.maxWidth;
                element.style.maxWidth = 'none';
                element.offsetHeight;
                element.style.maxWidth = originalMaxWidth;
            }

            view_data.width = element.clientWidth;
            view_data.height = element.clientHeight;
            element.style = origin_style;
        }
    }

    /** Render node with multiline support. */
    render_node(ele, node) {
        if (this.options.enable_multiline) {
            // Multiline mode: convert line breaks to <br> tags
            var content = this.options.support_html
                ? node.topic
                : util.text.html_escape(node.topic);
            content = content.replace(/\n/g, '<br>');
            $.h(ele, content);
        } else if (this.options.support_html) {
            // Standard HTML mode
            $.h(ele, node.topic);
        } else {
            // Plain text mode
            $.t(ele, node.topic);
        }
    }

    /**
     * Handle jsMind events.
     * @param {number|string} type - Event type
     * @param {object} [data] - Event data
     */
    jm_event_handle(type, data) {
        // Handle any plugin-specific events here
    }
}

/**
 * Multiline text plugin registration.
 * @type {import('../../jsmind.plugin.js').Plugin<Partial<MultilineTextOptions>>}
 */
export const multiline_text_plugin = new jsMind.plugin('multiline_text', function (jm, options) {
    var mt = new MultilineText(jm, options);
    mt.init();
    jm.add_event_listener(function (type, data) {
        mt.jm_event_handle.call(mt, type, data);
    });
});

jsMind.register_plugin(multiline_text_plugin);

export default MultilineText;
