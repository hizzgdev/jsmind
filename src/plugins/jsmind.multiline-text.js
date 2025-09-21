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

/**
 * Default options for multiline text plugin.
 * @typedef {Object} MultilineTextOptions
 * @property {number} [text_width] - Maximum text width in pixels
 * @property {string} [editor_border_color] - Border color for active editor
 * @property {string} [editor_border_width] - Border width for active editor
 * @property {string} [save_shortcut] - Key to save (without Shift)
 * @property {string} [cancel_shortcut] - Key to cancel editing
 * @property {string} [newline_shortcut] - Key combination for new line
 * @property {boolean} [auto_resize] - Auto-resize nodes for multiline text
 * @property {number} [min_height] - Minimum node height
 * @property {number} [line_height] - Line height multiplier
 */
const DEFAULT_OPTIONS = {
    text_width: 200,
    editor_border_color: '#4CAF50',
    editor_border_width: '2px',
    save_shortcut: 'Enter',
    cancel_shortcut: 'Escape',
    newline_shortcut: 'Shift+Enter',
    auto_resize: true,
    min_height: 20,
    line_height: 1.2,
};

/**
 * Default options for text rendering functions.
 * @typedef {Object} TextRenderOptions
 * @property {string} [tagName='span'] - HTML tag name for created elements
 * @property {boolean} [clearElement=true] - Whether to clear existing element content
 * @property {boolean} [applyStyles=true] - Whether to apply multiline CSS styles
 * @property {string[]} [customClasses=[]] - Array of CSS class names to add
 * @property {Object} [customAttributes={}] - Object of HTML attributes to set
 * @property {Object} [customStyles={}] - Object of inline styles to apply
 * @property {boolean} [supportHtml=false] - Whether to support HTML content
 * @property {boolean} [preserveWhitespace=true] - Whether to preserve whitespace in multiline text
 */
const DEFAULT_RENDER_OPTIONS = {
    tagName: 'span',
    clearElement: true,
    applyStyles: true,
    customClasses: [],
    customAttributes: {},
    customStyles: {},
    supportHtml: false,
    preserveWhitespace: true
};

/**
 * Static utility function to render text content into an existing DOM element.
 *
 * This function handles both single-line and multiline text rendering with proper CSS styling.
 * For multiline text (containing \n), it applies 'white-space: pre-wrap' and 'word-break: break-word'.
 * For single-line text, it uses standard text or HTML rendering based on supportHtml option.
 *
 * @param {HTMLElement} element - Target DOM element to render text into
 * @param {string} text - Text content to render (supports \n for line breaks)
 * @param {Partial<TextRenderOptions>} [options={}] - Rendering options
 * @param {string} [options.tagName='span'] - HTML tag name (only used when creating new elements)
 * @param {boolean} [options.clearElement=true] - Whether to clear existing element content
 * @param {boolean} [options.applyStyles=true] - Whether to apply multiline CSS styles
 * @param {string[]} [options.customClasses=[]] - Array of CSS class names to add
 * @param {Object} [options.customAttributes={}] - Object of HTML attributes to set
 * @param {Object} [options.customStyles={}] - Object of inline styles to apply
 * @param {boolean} [options.supportHtml=false] - Whether to support HTML content in single-line text
 * @param {boolean} [options.preserveWhitespace=true] - Whether to preserve whitespace in multiline text
 * @returns {HTMLElement} The element with rendered text content
 * @throws {Error} If element is not a valid DOM element
 *
 * @example
 * // Basic multiline text rendering
 * const element = document.createElement('div');
 * renderTextToElement(element, 'Line 1\nLine 2\nLine 3');
 *
 * @example
 * // Custom styling and attributes
 * renderTextToElement(element, 'Custom text', {
 *   customClasses: ['highlight', 'bold'],
 *   customAttributes: { 'data-id': '123' },
 *   customStyles: { color: 'red', fontSize: '14px' }
 * });
 *
 * @example
 * // HTML support for single-line text
 * renderTextToElement(element, '<strong>Bold text</strong>', {
 *   supportHtml: true
 * });
 */
export function renderTextToElement(element, text, options = {}) {
    // Validate parameters
    if (!element || !(element instanceof HTMLElement)) {
        throw new Error('renderTextToElement: element must be a valid DOM element');
    }

    if (text == null) {
        console.warn('renderTextToElement: text is null or undefined, skipping render');
        return element;
    }

    // Merge options with defaults
    const opts = {};
    jsMind.util.json.merge(opts, DEFAULT_RENDER_OPTIONS);
    jsMind.util.json.merge(opts, options);

    // Clear element content if requested
    if (opts.clearElement) {
        element.innerHTML = '';
    }

    // Convert text to string
    const textContent = String(text);

    // Apply custom attributes
    if (opts.customAttributes && typeof opts.customAttributes === 'object') {
        for (const [key, value] of Object.entries(opts.customAttributes)) {
            try {
                element.setAttribute(key, String(value));
            } catch (error) {
                console.warn(`renderTextToElement: Failed to set attribute ${key}:`, error);
            }
        }
    }

    // Apply custom classes
    if (opts.customClasses && Array.isArray(opts.customClasses)) {
        for (const className of opts.customClasses) {
            if (typeof className === 'string' && className.trim()) {
                element.classList.add(className.trim());
            }
        }
    }

    // Render text content
    if (textContent.includes('\n')) {
        // Handle multiline text
        element.textContent = textContent;

        if (opts.applyStyles) {
            // Apply multiline styles (these take precedence over custom styles)
            element.style.whiteSpace = 'pre-wrap';
            element.style.wordBreak = 'break-word';
        }
    } else {
        // Handle single-line text
        if (opts.applyStyles) {
            // Reset multiline styles for single-line text
            element.style.whiteSpace = '';
            element.style.wordBreak = '';
        }

        // Render based on HTML support
        if (opts.supportHtml) {
            $.h(element, textContent);
        } else {
            $.t(element, textContent);
        }
    }

    // Apply custom styles (after multiline styles to allow overrides where appropriate)
    if (opts.customStyles && typeof opts.customStyles === 'object') {
        for (const [property, value] of Object.entries(opts.customStyles)) {
            try {
                // Don't override critical multiline styles if text is multiline
                if (textContent.includes('\n') && opts.applyStyles) {
                    if (property === 'whiteSpace' || property === 'white-space') {
                        console.warn('renderTextToElement: Ignoring whiteSpace override for multiline text');
                        continue;
                    }
                    if (property === 'wordBreak' || property === 'word-break') {
                        console.warn('renderTextToElement: Ignoring wordBreak override for multiline text');
                        continue;
                    }
                }
                element.style[property] = String(value);
            } catch (error) {
                console.warn(`renderTextToElement: Failed to set style ${property}:`, error);
            }
        }
    }

    return element;
}

/**
 * Static utility function to create a new DOM element with rendered text content.
 *
 * This function creates a new DOM element and renders text content into it using the same
 * logic as renderTextToElement. It's useful when you need a new element rather than
 * modifying an existing one.
 *
 * @param {string} text - Text content to render (supports \n for line breaks)
 * @param {Partial<TextRenderOptions>} [options={}] - Rendering options
 * @param {string} [options.tagName='span'] - HTML tag name for the created element
 * @param {boolean} [options.applyStyles=true] - Whether to apply multiline CSS styles
 * @param {string[]} [options.customClasses=[]] - Array of CSS class names to add
 * @param {Object} [options.customAttributes={}] - Object of HTML attributes to set
 * @param {Object} [options.customStyles={}] - Object of inline styles to apply
 * @param {boolean} [options.supportHtml=false] - Whether to support HTML content in single-line text
 * @returns {HTMLElement} New DOM element with rendered text content
 *
 * @example
 * // Create a div with multiline text
 * const textDiv = createTextElement('Line 1\nLine 2', {
 *   tagName: 'div',
 *   customClasses: ['multiline-text']
 * });
 *
 * @example
 * // Create a span with custom styling
 * const styledSpan = createTextElement('Styled text', {
 *   customStyles: {
 *     backgroundColor: '#f0f0f0',
 *     padding: '4px',
 *     borderRadius: '4px'
 *   }
 * });
 */
export function createTextElement(text, options = {}) {
    // Merge options with defaults
    const opts = {};
    jsMind.util.json.merge(opts, DEFAULT_RENDER_OPTIONS);
    jsMind.util.json.merge(opts, options);

    // Create new element
    const element = $.c(opts.tagName || 'span');

    // Use renderTextToElement to handle the rendering
    return renderTextToElement(element, text, { ...opts, clearElement: false });
}

/**
 * Multiline text plugin for jsMind.
 */
export class MultilineText {
    /**
     * Create multiline text plugin instance.
     * @param {import('../jsmind.js').default} jm - jsMind instance
     * @param {Partial<MultilineTextOptions>} options - Plugin options
     */
    constructor(jm, options) {
        var opts = {};
        jsMind.util.json.merge(opts, DEFAULT_OPTIONS);
        jsMind.util.json.merge(opts, options);

        this.version = '0.1.0';
        /** @type {import('../jsmind.js').default} */
        this.jm = jm;
        /** @type {MultilineTextOptions} */
        this.options = opts;

        // Store original methods for restoration if needed
        this.original_methods = {};

        // Current editing state
        this.editing_node = null;
        this.multiline_editor = null;
    }

    /** Initialize the multiline text plugin. */
    init() {
        this.override_view_methods();
        this.setup_event_listeners();
        // Re-render all existing nodes to apply multiline formatting
        this.rerender_existing_nodes();
    }

    /**
     * Override ViewProvider methods to support multiline text.
     */
    override_view_methods() {
        const view = this.jm.view;

        // Store original methods for fallback
        this.original_methods.edit_node_begin = view.edit_node_begin.bind(view);
        this.original_methods.edit_node_end = view.edit_node_end.bind(view);
        this.original_methods.render_node = view.render_node.bind(view);
        this.original_methods.show = view.show.bind(view);

        // Store original custom render methods if they exist
        this.original_methods._custom_node_render = view._custom_node_render
            ? view._custom_node_render.bind(view)
            : null;
        this.original_methods._default_node_render = view._default_node_render
            ? view._default_node_render.bind(view)
            : null;

        // Override methods with error handling
        try {
            view.edit_node_begin = this.edit_node_begin.bind(this);
            view.edit_node_end = this.edit_node_end.bind(this);
            view.render_node = this._render_multiline_node_wrapper.bind(this);
            view.show = this._show_wrapper.bind(this);
            console.log('Multiline text plugin: Successfully overrode view methods');
        } catch (error) {
            console.error('Multiline text plugin: Failed to override methods', error);
            // Restore original methods if override fails
            this.restore_original_methods();
        }
    }

    /**
     * Restore original methods if override fails.
     */
    restore_original_methods() {
        const view = this.jm.view;
        if (this.original_methods.edit_node_begin) {
            view.edit_node_begin = this.original_methods.edit_node_begin;
        }
        if (this.original_methods.edit_node_end) {
            view.edit_node_end = this.original_methods.edit_node_end;
        }
        if (this.original_methods.render_node) {
            view.render_node = this.original_methods.render_node;
        }
        if (this.original_methods.show) {
            view.show = this.original_methods.show;
        }
        if (this.original_methods._custom_node_render) {
            view._custom_node_render = this.original_methods._custom_node_render;
        }
        if (this.original_methods._default_node_render) {
            view._default_node_render = this.original_methods._default_node_render;
        }
    }

    /**
     * Set up event listeners for the plugin.
     */
    setup_event_listeners() {
        // Listen for jsMind events if needed
        this.jm.add_event_listener((type, data) => {
            this.jm_event_handle(type, data);
        });
    }

    /**
     * Wrapper for render_node method with error handling.
     * @param {HTMLElement} element - Node element
     * @param {import('../jsmind.node.js').Node} node - Node data
     */
    _render_multiline_node_wrapper(element, node) {
        try {
            this._render_multiline_node(element, node);
        } catch (error) {
            console.error('Multiline text plugin: Error in render_node', error);
            // Fall back to original method
            if (this.original_methods.render_node) {
                this.original_methods.render_node(element, node);
            }
        }
    }

    /**
     * Wrapper for show method to prevent unwanted view resets.
     * @param {boolean} keep_center - Whether to center on root node
     */
    _show_wrapper(keep_center) {
        try {
            // Always call show without centering to prevent view jumps
            this.original_methods.show(false);
        } catch (error) {
            console.error('Multiline text plugin: Error in show', error);
            // Fall back to original method
            if (this.original_methods.show) {
                this.original_methods.show(keep_center);
            }
        }
    }

    /**
     * Render multiline text in node display with custom_node_render support.
     * @param {HTMLElement} element - Node element
     * @param {import('../jsmind.node.js').Node} node - Node data
     */
    _render_multiline_node(element, node) {
        if (!node.topic) {
            return;
        }

        // Store original dimensions for layout recalculation
        const originalHeight = element.clientHeight;

        // Use the new static rendering function with plugin configuration
        renderTextToElement(element, node.topic, {
            clearElement: true,
            applyStyles: true,
            supportHtml: this.jm.view.opts.support_html || false
        });

        // Check if height changed and trigger layout update if needed
        const newHeight = element.clientHeight;
        if (originalHeight !== newHeight && originalHeight > 0) {
            // Use setTimeout to ensure DOM has updated before recalculating
            setTimeout(() => {
                this.recalculate_layout(node);
            }, 0);
        }
    }

    /**
     * Plugin instance method to render text content into an existing DOM element.
     *
     * This method automatically uses jsMind configuration settings (like support_html)
     * and provides a convenient way to render multiline text within custom node renderers.
     *
     * @param {HTMLElement} element - Target DOM element to render text into
     * @param {string} text - Text content to render (supports \n for line breaks)
     * @param {Partial<TextRenderOptions>} [options={}] - Additional rendering options
     * @returns {HTMLElement} The element with rendered text content
     *
     * @example
     * // In a custom node render function
     * customNodeRender(jm, element, node) {
     *   const wrapper = document.createElement('div');
     *   wrapper.style.backgroundColor = '#f0f0f0';
     *   wrapper.style.padding = '4px';
     *
     *   const textElement = document.createElement('span');
     *   jm.multiline_text.renderMultilineText(textElement, node.topic);
     *
     *   wrapper.appendChild(textElement);
     *   element.appendChild(wrapper);
     *   return true;
     * }
     */
    renderMultilineText(element, text, options = {}) {
        // Prepare options with jsMind configuration
        const defaultOptions = {
            supportHtml: this.jm.view.opts.support_html || false
        };

        // Merge with provided options
        const mergedOptions = {};
        jsMind.util.json.merge(mergedOptions, defaultOptions);
        jsMind.util.json.merge(mergedOptions, options);

        // Use static function with merged options
        return renderTextToElement(element, text, mergedOptions);
    }

    /**
     * Plugin instance method to create a new DOM element with rendered text content.
     *
     * This method automatically uses jsMind configuration settings and creates a new
     * element with properly rendered multiline text. Useful for building complex
     * custom node structures.
     *
     * @param {string} text - Text content to render (supports \n for line breaks)
     * @param {Partial<TextRenderOptions>} [options={}] - Additional rendering options
     * @returns {HTMLElement} New DOM element with rendered text content
     *
     * @example
     * // Create a text element for insertion into custom structure
     * customNodeRender(jm, element, node) {
     *   const container = document.createElement('div');
     *   container.className = 'custom-node';
     *
     *   // Add priority indicator
     *   if (node.data?.priority) {
     *     const priority = document.createElement('span');
     *     priority.className = 'priority-badge';
     *     priority.textContent = node.data.priority;
     *     container.appendChild(priority);
     *   }
     *
     *   // Add multiline text content
     *   const textElement = jm.multiline_text.createMultilineElement(node.topic, {
     *     tagName: 'div',
     *     customClasses: ['node-text']
     *   });
     *   container.appendChild(textElement);
     *
     *   element.appendChild(container);
     *   return true;
     * }
     */
    createMultilineElement(text, options = {}) {
        // Prepare options with jsMind configuration
        const defaultOptions = {
            supportHtml: this.jm.view.opts.support_html || false
        };

        // Merge with provided options
        const mergedOptions = {};
        jsMind.util.json.merge(mergedOptions, defaultOptions);
        jsMind.util.json.merge(mergedOptions, options);

        // Use static function with merged options
        return createTextElement(text, mergedOptions);
    }

    /**
     * Begin editing a node with multiline support.
     * @param {import('../jsmind.node.js').Node} node - Node to edit
     */
    edit_node_begin(node) {
        if (!node.topic) {
            console.warn("don't edit image nodes");
            return;
        }

        if (this.editing_node != null) {
            this.edit_node_end();
        }

        this.editing_node = node;

        this.jm.view.editing_node = node;

        const view_data = node._data.view;
        const element = view_data.element;
        const topic = node.topic;

        // Create multiline editor
        this.create_multiline_editor(element, topic);
    }

    /**
     * Create contentEditable multiline editor.
     * @param {HTMLElement} element - Node element
     * @param {string} topic - Current text content
     */
    create_multiline_editor(element, topic) {
        // Create contentEditable div
        this.multiline_editor = $.c('div');
        this.multiline_editor.contentEditable = 'plaintext-only';
        this.multiline_editor.className = 'jsmind-multiline-editor';

        // Set initial content
        this.multiline_editor.textContent = topic;

        // Style the editor
        this.style_multiline_editor(element);

        // Add keyboard event handling
        this.setup_editor_events();

        // Replace element content with editor
        element.innerHTML = '';
        element.appendChild(this.multiline_editor);
        element.style.zIndex = 5;

        // Focus and select content
        this.multiline_editor.focus();
        this.select_all_text();
    }

    /**
     * Style the multiline editor.
     * @param {HTMLElement} element - Original node element
     */
    style_multiline_editor(element) {
        const ncs = getComputedStyle(element);
        const editor = this.multiline_editor;

        // Copy styles from original element
        editor.style.width =
            Math.max(
                element.clientWidth -
                    parseInt(ncs.getPropertyValue('padding-left')) -
                    parseInt(ncs.getPropertyValue('padding-right')),
                this.options.text_width
            ) + 'px';

        editor.style.minHeight = this.options.min_height + 'px';
        editor.style.lineHeight = this.options.line_height;
        editor.style.border =
            this.options.editor_border_width + ' solid ' + this.options.editor_border_color;
        editor.style.borderRadius = '4px';
        editor.style.padding = '4px';
        editor.style.outline = 'none';
        editor.style.resize = 'none';
        editor.style.overflow = 'hidden';
        editor.style.whiteSpace = 'pre-wrap';
        editor.style.wordBreak = 'break-word';
    }

    /**
     * Set up keyboard event handling for the editor.
     */
    setup_editor_events() {
        const editor = this.multiline_editor;

        $.on(editor, 'keydown', e => {
            this.handle_editor_keydown(e);
        });

        $.on(editor, 'blur', () => {
            // Delay to allow other events to process first
            setTimeout(() => {
                if (this.editing_node) {
                    this.edit_node_end();
                }
            }, 100);
        });

        // Auto-resize editor as user types
        $.on(editor, 'input', () => {
            this.auto_resize_editor();
        });
    }

    /**
     * Handle keyboard events in the editor.
     * @param {KeyboardEvent} e - Keyboard event
     */
    handle_editor_keydown(e) {
        const key = e.key;
        const shiftKey = e.shiftKey;

        if (key === 'Enter') {
            if (shiftKey) {
                // Shift+Enter: Allow line break (default behavior)
                return;
            } else {
                // Enter: Save and exit
                e.preventDefault();
                this.edit_node_end();
            }
        } else if (key === 'Escape') {
            // Escape: Cancel editing
            e.preventDefault();
            this.cancel_editing();
        } else if (key === 'Tab') {
            // Tab: Save and exit (like Enter)
            e.preventDefault();
            this.edit_node_end();
        }
    }

    /**
     * Auto-resize editor based on content.
     */
    auto_resize_editor() {
        if (!this.options.auto_resize || !this.multiline_editor) {
            return;
        }

        const editor = this.multiline_editor;

        // Reset height to auto to get natural height
        editor.style.height = 'auto';

        // Set height to scroll height to fit content
        const scrollHeight = editor.scrollHeight;
        const minHeight = this.options.min_height;

        editor.style.height = Math.max(scrollHeight, minHeight) + 'px';
    }

    /**
     * Select all text in the editor.
     */
    select_all_text() {
        if (!this.multiline_editor) return;

        const range = $.d.createRange();
        range.selectNodeContents(this.multiline_editor);

        const selection = $.w.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }

    /**
     * End editing and save changes.
     */
    edit_node_end() {
        if (this.editing_node == null || !this.multiline_editor) {
            return;
        }

        const node = this.editing_node;
        const view_data = node._data.view;
        const element = view_data.element;
        const topic = this.multiline_editor.textContent || '';

        // Clean up editor
        this.cleanup_editor(element);

        // Process and validate text
        const processed_topic = this.process_multiline_text(topic);

        // Update node if text changed
        if (jsMind.util.text.is_empty(processed_topic) || node.topic === processed_topic) {
            // No change or empty text, just re-render
            this._render_multiline_node(element, node);
        } else {
            // Text changed, update node
            this.jm.update_node(node.id, processed_topic);
        }

        // Trigger layout recalculation
        this.recalculate_layout(node);

        // Reset editing state
        this.editing_node = null;

        this.jm.view.editing_node = null;
        this.multiline_editor = null;

        // Return focus to panel
        this.jm.view.e_panel.focus();
    }

    /**
     * Cancel editing without saving changes.
     */
    cancel_editing() {
        if (this.editing_node == null || !this.multiline_editor) {
            return;
        }

        const node = this.editing_node;
        const view_data = node._data.view;
        const element = view_data.element;

        // Clean up editor
        this.cleanup_editor(element);

        // Restore original content
        this._render_multiline_node(element, node);

        // Reset editing state
        this.editing_node = null;

        this.jm.view.editing_node = null;
        this.multiline_editor = null;

        // Return focus to panel
        this.jm.view.e_panel.focus();
    }

    /**
     * Clean up editor and restore element state.
     * @param {HTMLElement} element - Node element
     */
    cleanup_editor(element) {
        if (this.multiline_editor && this.multiline_editor.parentNode) {
            this.multiline_editor.parentNode.removeChild(this.multiline_editor);
        }
        element.style.zIndex = 'auto';
    }

    /**
     * Process and validate multiline text.
     * @param {string} text - Raw text from editor
     * @returns {string} Processed text
     */
    process_multiline_text(text) {
        if (!text) return '';

        // Trim whitespace but preserve internal line breaks
        text = text.trim();

        // Normalize line breaks to \n
        text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

        // Remove excessive consecutive line breaks (more than 2)
        text = text.replace(/\n{3,}/g, '\n\n');

        return text;
    }

    /**
     * Re-render all existing nodes to apply multiline formatting.
     */
    rerender_existing_nodes() {
        if (!this.jm.mind || !this.jm.mind.nodes) {
            return;
        }

        // Re-render all nodes that have multiline text
        const nodes = this.jm.mind.nodes;
        for (const node_id in nodes) {
            const node = nodes[node_id];
            if (node.topic && node.topic.includes('\n')) {
                const view_data = node._data.view;
                if (view_data && view_data.element) {
                    this._render_multiline_node(view_data.element, node);
                }
            }
        }
    }

    /**
     * Recalculate layout after text changes.
     * @param {import('../jsmind.node.js').Node} node - Updated node
     */
    recalculate_layout(node) {
        // Clear layout cache to force recalculation
        this.jm.layout.cache_valid = false;

        // Clear any cached offset and point data for all nodes
        const nodes = this.jm.mind.nodes;
        for (let nodeid in nodes) {
            const n = nodes[nodeid];
            if (n._data.layout) {
                delete n._data.layout._offset_;
                delete n._data.layout._pout_;
            }
        }

        // Update node size first
        this.jm.view.update_node(node);

        // Trigger complete layout recalculation
        this.jm.layout.layout();

        // Redraw view with updated layout and lines
        this.jm.view.show();
    }

    /**
     * Handle jsMind events.
     * @param {number|string} type - Event type
     * @param {object} [data] - Event data
     */
    jm_event_handle(type, data) {
        // Handle events if needed
        if (type === jsMind.event_type.resize) {
            // Handle resize events
        }
    }
}

/**
 * Multiline text plugin registration.
 * @type {import('../jsmind.plugin.js').Plugin<Partial<MultilineTextOptions>>}
 */
export const multiline_text_plugin = new jsMind.plugin('multiline_text', function (jm, options) {
    var mt = new MultilineText(jm, options);
    mt.init();
    jm.multiline_text = mt;
});

jsMind.register_plugin(multiline_text_plugin);

export default MultilineText;
