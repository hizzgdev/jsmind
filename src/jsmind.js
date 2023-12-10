/**
 * @license BSD
 * @copyright 2014-2023 hizzgdev@163.com
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

export default class jsMind {
    static mind = Mind;
    static node = Node;
    static direction = Direction;
    static event_type = EventType;
    static $ = $;
    static plugin = Plugin;
    static register_plugin = _register_plugin;
    static util = _util;

    constructor(options) {
        jsMind.current = this;
        this.options = merge_option(options);
        logger.level(LogLevel[this.options.log_level]);
        this.version = __version__;
        this.initialized = false;
        this.mind = null;
        this.event_handles = [];
        this.init();
    }

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
            hmargin: this.options.view.hmargin,
            vmargin: this.options.view.vmargin,
            line_width: this.options.view.line_width,
            line_color: this.options.view.line_color,
            line_style: this.options.view.line_style,
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
    get_editable() {
        return this.options.editable;
    }
    enable_edit() {
        this.options.editable = true;
    }
    disable_edit() {
        this.options.editable = false;
    }
    get_view_draggable() {
        return this.options.view.draggable;
    }
    enable_view_draggable() {
        this.options.view.draggable = true;
        this.view.setup_canvas_draggable(true);
    }
    disable_view_draggable() {
        this.options.view.draggable = false;
        this.view.setup_canvas_draggable(false);
    }
    // options are 'mousedown', 'click', 'dblclick', 'mousewheel'
    enable_event_handle(event_handle) {
        this.options.default_event_handle['enable_' + event_handle + '_handle'] = true;
    }
    // options are 'mousedown', 'click', 'dblclick', 'mousewheel'
    disable_event_handle(event_handle) {
        this.options.default_event_handle['enable_' + event_handle + '_handle'] = false;
    }
    set_theme(theme) {
        var theme_old = this.options.theme;
        this.options.theme = !!theme ? theme : null;
        if (theme_old != this.options.theme) {
            this.view.reset_theme();
            this.view.reset_custom_style();
        }
    }
    _event_bind() {
        this.view.add_event(this, 'mousedown', this.mousedown_handle);
        this.view.add_event(this, 'click', this.click_handle);
        this.view.add_event(this, 'dblclick', this.dblclick_handle);
        this.view.add_event(this, 'mousewheel', this.mousewheel_handle, true);
    }
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
    mousewheel_handle(e) {
        // Test if mousewheel option is enabled and Ctrl key is pressed.
        if (!this.options.default_event_handle['enable_mousewheel_handle'] || !e.ctrlKey) {
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
    end_edit() {
        this.view.edit_node_end();
    }
    toggle_node(node) {
        if (!Node.is_node(node)) {
            var the_node = this.get_node(node);
            if (!the_node) {
                logger.error('the node[id=' + node + '] can not be found.');
                return;
            } else {
                return this.toggle_node(the_node);
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
    expand_node(node) {
        if (!Node.is_node(node)) {
            var the_node = this.get_node(node);
            if (!the_node) {
                logger.error('the node[id=' + node + '] can not be found.');
                return;
            } else {
                return this.expand_node(the_node);
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
    collapse_node(node) {
        if (!Node.is_node(node)) {
            var the_node = this.get_node(node);
            if (!the_node) {
                logger.error('the node[id=' + node + '] can not be found.');
                return;
            } else {
                return this.collapse_node(the_node);
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
    expand_all() {
        this.layout.expand_all();
        this.view.relayout();
    }
    collapse_all() {
        this.layout.collapse_all();
        this.view.relayout();
    }
    expand_to_depth(depth) {
        this.layout.expand_to_depth(depth);
        this.view.relayout();
    }
    _reset() {
        this.view.reset();
        this.layout.reset();
        this.data.reset();
    }
    _show(mind) {
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

        this.view.show(true);
        logger.debug('view.show ok');

        this.invoke_event_handle(EventType.show, { data: [mind] });
    }
    show(mind) {
        this._reset();
        this._show(mind);
    }
    get_meta() {
        return {
            name: this.mind.name,
            author: this.mind.author,
            version: this.mind.version,
        };
    }
    get_data(data_format) {
        var df = data_format || 'node_tree';
        return this.data.get_data(df);
    }
    get_root() {
        return this.mind.root;
    }
    get_node(node) {
        if (Node.is_node(node)) {
            return node;
        }
        return this.mind.get_node(node);
    }
    add_node(parent_node, node_id, topic, data, direction) {
        if (this.get_editable()) {
            var the_parent_node = this.get_node(parent_node);
            var dir = Direction.of(direction);
            if (dir === undefined) {
                dir = this.layout.calculate_next_child_direction(the_parent_node);
            }
            var node = this.mind.add_node(the_parent_node, node_id, topic, data, dir);
            if (!!node) {
                this.view.add_node(node);
                this.layout.layout();
                this.view.show(false);
                this.view.reset_node_custom_style(node);
                this.expand_node(the_parent_node);
                this.invoke_event_handle(EventType.edit, {
                    evt: 'add_node',
                    data: [the_parent_node.id, node_id, topic, data, dir],
                    node: node_id,
                });
            }
            return node;
        } else {
            logger.error('fail, this mind map is not editable');
            return null;
        }
    }
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
    select_node(node) {
        if (!Node.is_node(node)) {
            var the_node = this.get_node(node);
            if (!the_node) {
                logger.error('the node[id=' + node + '] can not be found.');
                return;
            } else {
                return this.select_node(the_node);
            }
        }
        if (!this.layout.is_visible(node)) {
            return;
        }
        this.mind.selected = node;
        this.view.select_node(node);
        this.invoke_event_handle(EventType.select, { evt: 'select_node', data: [], node: node.id });
    }
    get_selected_node() {
        if (!!this.mind) {
            return this.mind.selected;
        } else {
            return null;
        }
    }
    select_clear() {
        if (!!this.mind) {
            this.mind.selected = null;
            this.view.select_clear();
        }
    }
    is_node_visible(node) {
        return this.layout.is_visible(node);
    }
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
    resize() {
        this.view.resize();
    }
    // callback(type ,data)
    add_event_listener(callback) {
        if (typeof callback === 'function') {
            this.event_handles.push(callback);
        }
    }
    clear_event_listener() {
        this.event_handles = [];
    }
    invoke_event_handle(type, data) {
        var j = this;
        $.w.setTimeout(function () {
            j._invoke_event_handle(type, data);
        }, 0);
    }
    _invoke_event_handle(type, data) {
        var l = this.event_handles.length;
        for (var i = 0; i < l; i++) {
            this.event_handles[i](type, data);
        }
    }

    static show(options, mind) {
        logger.warn(
            '`jsMind.show(options, mind)` is deprecated, please use `jm = new jsMind(options); jm.show(mind);` instead'
        );
        var _jm = new jsMind(options);
        _jm.show(mind);
        return _jm;
    }
}
