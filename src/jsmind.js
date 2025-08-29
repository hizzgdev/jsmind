/**
 * @license BSD
 * @copyright 2014-2025 hizzgdev@163.com
 *
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */

import { __version__, logger, EventType, Direction, LogLevel } from './jsmind.common.js';
import { merge_option } from './jsmind.option.js';
import { Mind } from './jsmind.mind.js';
import { Node } from './jsmind.node.js';
import { DataProvider } from './jsmind.data_provider.js';
import { LayoutProvider } from './jsmind.layout_provider.js';
import { ViewProvider } from './jsmind.view_provider.js';
import { ShortcutProvider } from './jsmind.shortcut_provider.js';
import { Plugin, register as _register_plugin, apply as apply_plugins } from './jsmind.plugin.js';
import { format } from './jsmind.format.js';
import { $ } from './jsmind.dom.js';
import { util as _util } from './jsmind.util.js';

/**
 * Event callback payload
 * @typedef {{ evt?: string, data?: unknown[], node?: string }} EventData
 */

/**
 * jsMind runtime: orchestrates data/layout/view/shortcut and exposes public API.
 */
export default class jsMind {
    static mind = Mind;
    static node = Node;
    static direction = Direction;
    static event_type = EventType;
    static $ = $;
    static plugin = Plugin;
    static register_plugin = _register_plugin;
    static util = _util;

    /**
     * Create a jsMind instance.
     * @param {import('./jsmind.option.js').JsMindRuntimeOptions} options
     */
    constructor(options) {
        jsMind.current = this;
        this.options = merge_option(options);
        logger.level(LogLevel[this.options.log_level]);
        this.version = __version__;
        this.initialized = false;
        this.mind = null;
        /** @type {Array<(type: number, data: EventData) => void>} */
        this.event_handles = [];
        this.init();
    }

    /** Initialize sub-systems and plugins. */
    init() {
        if (!!this.initialized) {
            return;
        }
        this.initialized = true;
        var opts_layout = {
            mode: this.options.mode,
            hspace: this.options.layout.hspace,
            vspace: this.options.layout.vspace,
            pspace: this.options.layout.pspace,
            cousin_space: this.options.layout.cousin_space,
        };
        var opts_view = {
            container: this.options.container,
            support_html: this.options.support_html,
            engine: this.options.view.engine,
            enable_device_pixel_ratio: this.options.view.enable_device_pixel_ratio,
            hmargin: this.options.view.hmargin,
            vmargin: this.options.view.vmargin,
            line_width: this.options.view.line_width,
            line_color: this.options.view.line_color,
            line_style: this.options.view.line_style,
            custom_line_render: this.options.view.custom_line_render,
            draggable: this.options.view.draggable,
            hide_scrollbars_when_draggable: this.options.view.hide_scrollbars_when_draggable,
            node_overflow: this.options.view.node_overflow,
            zoom: this.options.view.zoom,
            custom_node_render: this.options.view.custom_node_render,
            expander_style: this.options.view.expander_style,
        };
        // create instance of function provider
        this.data = new DataProvider(this);
        this.layout = new LayoutProvider(this, opts_layout);
        this.view = new ViewProvider(this, opts_view);
        this.shortcut = new ShortcutProvider(this, this.options.shortcut);

        this.data.init();
        this.layout.init();
        this.view.init();
        this.shortcut.init();

        this._event_bind();

        apply_plugins(this, this.options.plugin);
    }
    /** @returns {boolean} whether current mind map is editable */
    get_editable() {
        return this.options.editable;
    }
    /** enable editing */
    enable_edit() {
        this.options.editable = true;
    }
    /** disable editing */
    disable_edit() {
        this.options.editable = false;
    }
    /** @returns {boolean} whether view is draggable */
    get_view_draggable() {
        return this.options.view.draggable;
    }
    /** enable view dragging */
    enable_view_draggable() {
        this.options.view.draggable = true;
        this.view.setup_canvas_draggable(true);
    }
    /** disable view dragging */
    disable_view_draggable() {
        this.options.view.draggable = false;
        this.view.setup_canvas_draggable(false);
    }
    // options are 'mousedown', 'click', 'dblclick', 'mousewheel'
    /**
     * Enable default event handle.
     * @param {'mousedown'|'click'|'dblclick'|'mousewheel'} event_handle
     */
    enable_event_handle(event_handle) {
        this.options.default_event_handle['enable_' + event_handle + '_handle'] = true;
    }
    // options are 'mousedown', 'click', 'dblclick', 'mousewheel'
    /**
     * Disable default event handle.
     * @param {'mousedown'|'click'|'dblclick'|'mousewheel'} event_handle
     */
    disable_event_handle(event_handle) {
        this.options.default_event_handle['enable_' + event_handle + '_handle'] = false;
    }
    /**
     * Set theme name.
     * @param {string|null=} theme
     */
    set_theme(theme) {
        var theme_old = this.options.theme;
        this.options.theme = !!theme ? theme : null;
        if (theme_old != this.options.theme) {
            this.view.reset_theme();
            this.view.reset_custom_style();
        }
    }
    /** bind internal DOM events */
    _event_bind() {
        this.view.add_event(this, 'mousedown', this.mousedown_handle);
        this.view.add_event(this, 'click', this.click_handle);
        this.view.add_event(this, 'dblclick', this.dblclick_handle);
        this.view.add_event(this, 'wheel', this.mousewheel_handle, true);
    }
    /** @param {MouseEvent} e */
    mousedown_handle(e) {
        if (!this.options.default_event_handle['enable_mousedown_handle']) {
            return;
        }
        var element = e.target || event.srcElement;
        var node_id = this.view.get_binded_nodeid(element);
        if (!!node_id) {
            if (this.view.is_node(element)) {
                this.select_node(node_id);
            }
        } else {
            this.select_clear();
        }
    }
    /** @param {MouseEvent} e */
    click_handle(e) {
        if (!this.options.default_event_handle['enable_click_handle']) {
            return;
        }
        var element = e.target || event.srcElement;
        var is_expander = this.view.is_expander(element);
        if (is_expander) {
            var node_id = this.view.get_binded_nodeid(element);
            if (!!node_id) {
                this.toggle_node(node_id);
            }
        }
    }
    /** @param {MouseEvent} e */
    dblclick_handle(e) {
        if (!this.options.default_event_handle['enable_dblclick_handle']) {
            return;
        }
        if (this.get_editable()) {
            var element = e.target || event.srcElement;
            var is_node = this.view.is_node(element);
            if (is_node) {
                var node_id = this.view.get_binded_nodeid(element);
                if (!!node_id) {
                    this.begin_edit(node_id);
                }
            }
        }
    }
    // Use [Ctrl] + Mousewheel, to zoom in/out.
    /** @param {WheelEvent} e */
    mousewheel_handle(e) {
        // Test if mousewheel option is enabled and Ctrl key is pressed.
        var kc = (e.metaKey << 13) + (e.ctrlKey << 12) + (e.altKey << 11) + (e.shiftKey << 10);
        if (
            !this.options.default_event_handle['enable_mousewheel_handle'] ||
            this.options.view.zoom.mask_key !== kc
        ) {
            return;
        }
        var evt = e || event;
        // Avoid default page scrolling behavior.
        evt.preventDefault();

        if (evt.deltaY < 0) {
            this.view.zoom_in(evt); // wheel down
        } else {
            this.view.zoom_out(evt);
        }
    }
    /**
     * Begin editing a node.
     * @param {string | import('./jsmind.node.js').Node} node
     * @returns {boolean|void}
     */
    begin_edit(node) {
        if (!Node.is_node(node)) {
            var the_node = this.get_node(node);
            if (!the_node) {
                logger.error('the node[id=' + node + '] can not be found.');
                return false;
            } else {
                return this.begin_edit(the_node);
            }
        }
        if (this.get_editable()) {
            this.view.edit_node_begin(node);
        } else {
            logger.error('fail, this mind map is not editable.');
            return;
        }
    }
    /** End editing */
    end_edit() {
        this.view.edit_node_end();
    }
    /**
     * Toggle a node's expanded state.
     * @param {string | import('./jsmind.node.js').Node} node
     * @returns {void}
     */
    toggle_node(node) {
        if (!Node.is_node(node)) {
            var the_node = this.get_node(node);
            if (!the_node) {
                logger.error('the node[id=' + node + '] can not be found.');
                return;
            } else {
                this.toggle_node(the_node);
                return;
            }
        }
        if (node.isroot) {
            return;
        }
        this.view.save_location(node);
        this.layout.toggle_node(node);
        this.view.relayout();
        this.view.restore_location(node);
    }
    /**
     * Expand a node.
     * @param {string | import('./jsmind.node.js').Node} node
     * @returns {void}
     */
    expand_node(node) {
        if (!Node.is_node(node)) {
            var the_node = this.get_node(node);
            if (!the_node) {
                logger.error('the node[id=' + node + '] can not be found.');
                return;
            } else {
                this.expand_node(the_node);
                return;
            }
        }
        if (node.isroot) {
            return;
        }
        this.view.save_location(node);
        this.layout.expand_node(node);
        this.view.relayout();
        this.view.restore_location(node);
    }
    /**
     * Collapse a node.
     * @param {string | import('./jsmind.node.js').Node} node
     * @returns {void}
     */
    collapse_node(node) {
        if (!Node.is_node(node)) {
            var the_node = this.get_node(node);
            if (!the_node) {
                logger.error('the node[id=' + node + '] can not be found.');
                return;
            } else {
                this.collapse_node(the_node);
                return;
            }
        }
        if (node.isroot) {
            return;
        }
        this.view.save_location(node);
        this.layout.collapse_node(node);
        this.view.relayout();
        this.view.restore_location(node);
    }
    /** Expand all nodes */
    expand_all() {
        this.layout.expand_all();
        this.view.relayout();
    }
    /** Collapse all nodes */
    collapse_all() {
        this.layout.collapse_all();
        this.view.relayout();
    }
    /**
     * Expand nodes up to a specified depth level.
     * @param {number} depth
     */
    expand_to_depth(depth) {
        this.layout.expand_to_depth(depth);
        this.view.relayout();
    }
    /** reset view/layout/data */
    _reset() {
        this.view.reset();
        this.layout.reset();
        this.data.reset();
    }
    /**
     * Internal show flow.
     * @param {object | null} mind
     * @param {boolean=} skip_centering
     */
    _show(mind, skip_centering) {
        var m = mind || format.node_array.example;
        this.mind = this.data.load(m);
        if (!this.mind) {
            logger.error('data.load error');
            return;
        } else {
            logger.debug('data.load ok');
        }

        this.view.load();
        logger.debug('view.load ok');

        this.layout.layout();
        logger.debug('layout.layout ok');

        this.view.show(!skip_centering);
        logger.debug('view.show ok');

        this.invoke_event_handle(EventType.show, { data: [mind] });
    }
    /**
     * Show a mind (or example) on the canvas.
     * @param {object | null} mind
     * @param {boolean=} skip_centering
     */
    show(mind, skip_centering) {
        this._reset();
        this._show(mind, skip_centering);
    }
    /** @returns {{name:string,author:string,version:string}} */
    get_meta() {
        return {
            name: this.mind.name,
            author: this.mind.author,
            version: this.mind.version,
        };
    }
    /**
     * Serialize current mind to given format.
     * @param {'node_tree'|'node_array'|'freemind'|'text'} [data_format]
     * @returns {object}
     */
    get_data(data_format) {
        var df = data_format || 'node_tree';
        return this.data.get_data(df);
    }
    /** @returns {import('./jsmind.node.js').Node} */
    get_root() {
        return this.mind.root;
    }
    /**
     * @param {string | import('./jsmind.node.js').Node} node
     * @returns {import('./jsmind.node.js').Node}
     */
    get_node(node) {
        if (Node.is_node(node)) {
            return node;
        }
        return this.mind.get_node(node);
    }
    /**
     * Add node data to the mind map without triggering UI refresh.
     * @private
     * @param {import('./jsmind.node.js').Node} parent_node
     * @param {string} node_id
     * @param {string} topic
     * @param {Record<string, any>=} data
     * @param {('left'|'center'|'right'|'-1'|'0'|'1'|number)=} direction
     * @returns {import('./jsmind.node.js').Node|null}
     */
    _add_node_data(parent_node, node_id, topic, data, direction) {
        var dir = Direction.of(direction);
        if (dir === undefined) {
            dir = this.layout.calculate_next_child_direction(parent_node);
        }
        var node = this.mind.add_node(parent_node, node_id, topic, data, dir);
        if (!!node) {
            this.view.add_node(node);
            this.view.reset_node_custom_style(node);
        }
        return node;
    }

    /**
     * Refresh UI after node changes.
     * @private
     * @param {import('./jsmind.node.js').Node} parent_node
     */
    _refresh_node_ui(parent_node) {
        this.layout.layout();
        this.view.show(false);
        this.expand_node(parent_node);
    }

    /**
     * Add a new node to the mind map.
     * @param {string | import('./jsmind.node.js').Node} parent_node
     * @param {string} node_id
     * @param {string} topic
     * @param {Record<string, any>=} data
     * @param {('left'|'center'|'right'|'-1'|'0'|'1'|number)=} direction - Direction for node placement. Supports string values ('left', 'center', 'right'), numeric strings ('-1', '0', '1'), and numbers (-1, 0, 1)
     * @returns {import('./jsmind.node.js').Node|null}
     */
    add_node(parent_node, node_id, topic, data, direction) {
        if (!this.get_editable()) {
            logger.error('fail, this mind map is not editable');
            return null;
        }

        var the_parent_node = this.get_node(parent_node);
        if (!the_parent_node) {
            logger.error('parent node not found');
            return null;
        }

        var node = this._add_node_data(the_parent_node, node_id, topic, data, direction);
        if (!!node) {
            this._refresh_node_ui(the_parent_node);
            this.invoke_event_handle(EventType.edit, {
                evt: 'add_node',
                data: [the_parent_node.id, node_id, topic, data, Direction.of(direction)],
                node: node_id,
            });
        }
        return node;
    }

    /**
     * Add multiple nodes to the mind map with optimized performance.
     * @param {string | import('./jsmind.node.js').Node} parent_node - Parent node for all new nodes
     * @param {Array<{node_id: string, topic: string, data?: Record<string, any>, direction?: ('left'|'center'|'right'|'-1'|'0'|'1'|number)}>} nodes_data - Array of node data objects
     * @returns {Array<import('./jsmind.node.js').Node|null>} Array of created nodes
     */
    add_nodes(parent_node, nodes_data) {
        if (!this.get_editable()) {
            logger.error('fail, this mind map is not editable');
            return [];
        }

        var the_parent_node = this.get_node(parent_node);
        if (!the_parent_node) {
            logger.error('parent node not found');
            return [];
        }

        if (!Array.isArray(nodes_data) || nodes_data.length === 0) {
            logger.warn('nodes_data should be a non-empty array');
            return [];
        }

        var created_nodes = [];

        // Batch create node data without triggering UI refresh
        for (var i = 0; i < nodes_data.length; i++) {
            var node_data = nodes_data[i];
            var node = this._add_node_data(
                the_parent_node,
                node_data.node_id,
                node_data.topic,
                node_data.data,
                node_data.direction
            );
            created_nodes.push(node);
        }

        // Refresh UI once after all nodes are added
        if (!!created_nodes.length) {
            this._refresh_node_ui(the_parent_node);
            this.invoke_event_handle(EventType.edit, {
                evt: 'add_nodes',
                data: [the_parent_node.id, nodes_data],
                nodes: created_nodes.filter(node => node !== null).map(node => node.id),
            });
        }

        return created_nodes;
    }
    /**
     * Insert a node before target node.
     * @param {string | import('./jsmind.node.js').Node} node_before
     * @param {string} node_id
     * @param {string} topic
     * @param {Record<string, any>=} data
     * @param {('left'|'center'|'right'|'-1'|'0'|'1'|number)=} direction - Direction for node placement. Supports string values ('left', 'center', 'right'), numeric strings ('-1', '0', '1'), and numbers (-1, 0, 1)
     * @returns {import('./jsmind.node.js').Node|null}
     */
    insert_node_before(node_before, node_id, topic, data, direction) {
        if (this.get_editable()) {
            var the_node_before = this.get_node(node_before);
            var dir = Direction.of(direction);
            if (dir === undefined) {
                dir = this.layout.calculate_next_child_direction(the_node_before.parent);
            }
            var node = this.mind.insert_node_before(the_node_before, node_id, topic, data, dir);
            if (!!node) {
                this.view.add_node(node);
                this.layout.layout();
                this.view.show(false);
                this.invoke_event_handle(EventType.edit, {
                    evt: 'insert_node_before',
                    data: [the_node_before.id, node_id, topic, data, dir],
                    node: node_id,
                });
            }
            return node;
        } else {
            logger.error('fail, this mind map is not editable');
            return null;
        }
    }
    /**
     * Insert a node after target node.
     * @param {string | import('./jsmind.node.js').Node} node_after
     * @param {string} node_id
     * @param {string} topic
     * @param {Record<string, any>=} data
     * @param {('left'|'center'|'right'|'-1'|'0'|'1'|number)=} direction - Direction for node placement. Supports string values ('left', 'center', 'right'), numeric strings ('-1', '0', '1'), and numbers (-1, 0, 1)
     * @returns {import('./jsmind.node.js').Node|null}
     */
    insert_node_after(node_after, node_id, topic, data, direction) {
        if (this.get_editable()) {
            var the_node_after = this.get_node(node_after);
            var dir = Direction.of(direction);
            if (dir === undefined) {
                dir = this.layout.calculate_next_child_direction(the_node_after.parent);
            }
            var node = this.mind.insert_node_after(the_node_after, node_id, topic, data, dir);
            if (!!node) {
                this.view.add_node(node);
                this.layout.layout();
                this.view.show(false);
                this.invoke_event_handle(EventType.edit, {
                    evt: 'insert_node_after',
                    data: [the_node_after.id, node_id, topic, data, dir],
                    node: node_id,
                });
            }
            return node;
        } else {
            logger.error('fail, this mind map is not editable');
            return null;
        }
    }
    /**
     * Remove a node.
     * @param {string | import('./jsmind.node.js').Node} node
     * @returns {boolean}
     */
    remove_node(node) {
        if (!Node.is_node(node)) {
            var the_node = this.get_node(node);
            if (!the_node) {
                logger.error('the node[id=' + node + '] can not be found.');
                return false;
            } else {
                return this.remove_node(the_node);
            }
        }
        if (this.get_editable()) {
            if (node.isroot) {
                logger.error('fail, can not remove root node');
                return false;
            }
            var node_id = node.id;
            var parent_id = node.parent.id;
            var parent_node = this.get_node(parent_id);
            this.view.save_location(parent_node);
            this.view.remove_node(node);
            this.mind.remove_node(node);
            this.layout.layout();
            this.view.show(false);
            this.view.restore_location(parent_node);
            this.invoke_event_handle(EventType.edit, {
                evt: 'remove_node',
                data: [node_id],
                node: parent_id,
            });
            return true;
        } else {
            logger.error('fail, this mind map is not editable');
            return false;
        }
    }
    /**
     * Update the topic (text content) of a node.
     * @param {string} node_id
     * @param {string} topic
     */
    update_node(node_id, topic) {
        if (this.get_editable()) {
            if (_util.text.is_empty(topic)) {
                logger.warn('fail, topic can not be empty');
                return;
            }
            var node = this.get_node(node_id);
            if (!!node) {
                if (node.topic === topic) {
                    logger.info('nothing changed');
                    this.view.update_node(node);
                    return;
                }
                node.topic = topic;
                this.view.update_node(node);
                this.layout.layout();
                this.view.show(false);
                this.invoke_event_handle(EventType.edit, {
                    evt: 'update_node',
                    data: [node_id, topic],
                    node: node_id,
                });
            }
        } else {
            logger.error('fail, this mind map is not editable');
            return;
        }
    }
    /**
     * Move a node and optionally change direction.
     * @param {string} node_id
     * @param {string=} before_id - The ID of the node before which to place the moved node. Special values: "_first_", "_last_"
     * @param {string=} parent_id
     * @param {('left'|'center'|'right'|'-1'|'0'|'1'|number)=} direction - Direction for node placement. Supports string values ('left', 'center', 'right'), numeric strings ('-1', '0', '1'), and numbers (-1, 0, 1). Only effective for second-level nodes (children of root). If not provided, direction will be determined automatically.
     */
    move_node(node_id, before_id, parent_id, direction) {
        if (this.get_editable()) {
            var node = this.get_node(node_id);
            var updated_node = this.mind.move_node(node, before_id, parent_id, direction);
            if (!!updated_node) {
                this.view.update_node(updated_node);
                this.layout.layout();
                this.view.show(false);
                this.invoke_event_handle(EventType.edit, {
                    evt: 'move_node',
                    data: [node_id, before_id, parent_id, direction],
                    node: node_id,
                });
            }
        } else {
            logger.error('fail, this mind map is not editable');
            return;
        }
    }
    /**
     * @param {string | import('./jsmind.node.js').Node} node
     * @returns {void}
     */
    select_node(node) {
        if (!Node.is_node(node)) {
            var the_node = this.get_node(node);
            if (!the_node) {
                logger.error('the node[id=' + node + '] can not be found.');
                return;
            } else {
                this.select_node(the_node);
                return;
            }
        }
        if (!this.layout.is_visible(node)) {
            return;
        }
        this.mind.selected = node;
        this.view.select_node(node);
        this.invoke_event_handle(EventType.select, { evt: 'select_node', data: [], node: node.id });
    }
    /** @returns {import('./jsmind.node.js').Node|null} */
    get_selected_node() {
        if (!!this.mind) {
            return this.mind.selected;
        } else {
            return null;
        }
    }
    /** clear selection */
    select_clear() {
        if (!!this.mind) {
            this.mind.selected = null;
            this.view.select_clear();
        }
    }
    /** @param {string | import('./jsmind.node.js').Node} node */
    is_node_visible(node) {
        return this.layout.is_visible(node);
    }
    /**
     * Scroll the mind map to center the specified node.
     * @param {string | import('./jsmind.node.js').Node} node
     */
    scroll_node_to_center(node) {
        if (!Node.is_node(node)) {
            var the_node = this.get_node(node);
            if (!the_node) {
                logger.error('the node[id=' + node + '] can not be found.');
            } else {
                this.scroll_node_to_center(the_node);
            }
            return;
        }
        this.view.center_node(node);
    }
    /**
     * Find the previous sibling node of the given node.
     *
     * @param {string | import('./jsmind.node.js').Node} node - Node id or Node instance
     * @returns {import('./jsmind.node.js').Node | null}
     */
    find_node_before(node) {
        if (!Node.is_node(node)) {
            var the_node = this.get_node(node);
            if (!the_node) {
                logger.error('the node[id=' + node + '] can not be found.');
                return;
            } else {
                return this.find_node_before(the_node);
            }
        }
        if (node.isroot) {
            return null;
        }
        var n = null;
        if (node.parent.isroot) {
            var c = node.parent.children;
            var prev = null;
            var ni = null;
            for (var i = 0; i < c.length; i++) {
                ni = c[i];
                if (node.direction === ni.direction) {
                    if (node.id === ni.id) {
                        n = prev;
                    }
                    prev = ni;
                }
            }
        } else {
            n = this.mind.get_node_before(node);
        }
        return n;
    }
    /**
     * Find the next sibling node of the given node.
     * @param {string | import('./jsmind.node.js').Node} node
     * @returns {import('./jsmind.node.js').Node | null}
     */
    find_node_after(node) {
        if (!Node.is_node(node)) {
            var the_node = this.get_node(node);
            if (!the_node) {
                logger.error('the node[id=' + node + '] can not be found.');
                return;
            } else {
                return this.find_node_after(the_node);
            }
        }
        if (node.isroot) {
            return null;
        }
        var n = null;
        if (node.parent.isroot) {
            var c = node.parent.children;
            var found = false;
            var ni = null;
            for (var i = 0; i < c.length; i++) {
                ni = c[i];
                if (node.direction === ni.direction) {
                    if (found) {
                        n = ni;
                        break;
                    }
                    if (node.id === ni.id) {
                        found = true;
                    }
                }
            }
        } else {
            n = this.mind.get_node_after(node);
        }
        return n;
    }
    /**
     * Set background and foreground colors for a node.
     * @param {string} node_id
     * @param {string=} bg_color
     * @param {string=} fg_color
     * @returns {void}
     */
    set_node_color(node_id, bg_color, fg_color) {
        if (this.get_editable()) {
            var node = this.mind.get_node(node_id);
            if (!!node) {
                if (!!bg_color) {
                    node.data['background-color'] = bg_color;
                }
                if (!!fg_color) {
                    node.data['foreground-color'] = fg_color;
                }
                this.view.reset_node_custom_style(node);
            }
        } else {
            logger.error('fail, this mind map is not editable');
            return null;
        }
    }
    /**
     * Set font style for a node.
     * @param {string} node_id
     * @param {number=} size
     * @param {string=} weight
     * @param {string=} style
     * @returns {void}
     */
    set_node_font_style(node_id, size, weight, style) {
        if (this.get_editable()) {
            var node = this.mind.get_node(node_id);
            if (!!node) {
                if (!!size) {
                    node.data['font-size'] = size;
                }
                if (!!weight) {
                    node.data['font-weight'] = weight;
                }
                if (!!style) {
                    node.data['font-style'] = style;
                }
                this.view.reset_node_custom_style(node);
                this.view.update_node(node);
                this.layout.layout();
                this.view.show(false);
            }
        } else {
            logger.error('fail, this mind map is not editable');
            return null;
        }
    }
    /**
     * Set background image for a node.
     * @param {string} node_id
     * @param {string=} image
     * @param {number=} width
     * @param {number=} height
     * @param {number=} rotation
     * @returns {void}
     */
    set_node_background_image(node_id, image, width, height, rotation) {
        if (this.get_editable()) {
            var node = this.mind.get_node(node_id);
            if (!!node) {
                if (!!image) {
                    node.data['background-image'] = image;
                }
                if (!!width) {
                    node.data['width'] = width;
                }
                if (!!height) {
                    node.data['height'] = height;
                }
                if (!!rotation) {
                    node.data['background-rotation'] = rotation;
                }
                this.view.reset_node_custom_style(node);
                this.view.update_node(node);
                this.layout.layout();
                this.view.show(false);
            }
        } else {
            logger.error('fail, this mind map is not editable');
            return null;
        }
    }
    /**
     * @param {string} node_id
     * @param {number} rotation
     * @returns {void}
     */
    set_node_background_rotation(node_id, rotation) {
        if (this.get_editable()) {
            var node = this.mind.get_node(node_id);
            if (!!node) {
                if (!node.data['background-image']) {
                    logger.error(
                        'fail, only can change rotation angle of node with background image'
                    );
                    return null;
                }
                node.data['background-rotation'] = rotation;
                this.view.reset_node_custom_style(node);
                this.view.update_node(node);
                this.layout.layout();
                this.view.show(false);
            }
        } else {
            logger.error('fail, this mind map is not editable');
            return null;
        }
    }
    /** trigger view resize */
    resize() {
        this.view.resize();
    }
    // callback(type ,data)
    /** @param {(type:number, data: EventData)=>void} callback */
    add_event_listener(callback) {
        if (typeof callback === 'function') {
            this.event_handles.push(callback);
        }
    }
    /** clear event listeners */
    clear_event_listener() {
        this.event_handles = [];
    }
    /** @param {number} type @param {EventData} data */
    invoke_event_handle(type, data) {
        var j = this;
        $.w.setTimeout(function () {
            j._invoke_event_handle(type, data);
        }, 0);
    }
    /** @param {number} type @param {EventData} data */
    _invoke_event_handle(type, data) {
        var l = this.event_handles.length;
        for (var i = 0; i < l; i++) {
            this.event_handles[i](type, data);
        }
    }

    /**
     * Deprecated: static show constructor helper.
     * @param {import('./jsmind.option.js').JsMindRuntimeOptions} options
     * @param {object | null} mind
     * @returns {jsMind}
     */
    static show(options, mind) {
        logger.warn(
            '`jsMind.show(options, mind)` is deprecated, please use `jm = new jsMind(options); jm.show(mind);` instead'
        );
        var _jm = new jsMind(options);
        _jm.show(mind);
        return _jm;
    }
}
