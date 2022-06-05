/**
 * @license BSD
 * @copyright 2014-2022 hizzgdev@163.com
 *
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */

import { __version__, logger, EventType, Direction } from "./jsmind.common.js";
import { merge_option } from "./jsmind.option.js";
import { Node } from "./jsmind.node.js";
import { DataProvider } from "./jsmind.data_provider.js";
import { LayoutProvider } from "./jsmind.layout_provider.js";
import { ViewProvider } from "./jsmind.view_provider.js";
import { ShortcutProvider } from "./jsmind.shortcut_provider.js";
import { Plugin, register as _register_plugin, apply as apply_plugins } from "./jsmind.plugin.js";
import { format } from "./jsmind.format.js";
import { $ } from "./jsmind.dom.js";
import { util as _util } from "./jsmind.util.js"


class jm {
    static node = Node;
    static direction = Direction;
    static event_type = EventType;
    static $ = $;
    static plugin = Plugin
    static register_plugin = _register_plugin
    static util = _util

    constructor(options) {
        jm.current = this;
        this.version = __version__;
        this.initialized = false;
        this.mind = null;
        this.event_handles = [];
        this.options = merge_option(options);
        this.init();
    }

    init() {
        if (!!this.initialized) { return; }
        this.initialized = true;
        var opts_layout = {
            mode: this.options.mode,
            hspace: this.options.layout.hspace,
            vspace: this.options.layout.vspace,
            pspace: this.options.layout.pspace
        };
        var opts_view = {
            container: this.options.container,
            support_html: this.options.support_html,
            engine: this.options.view.engine,
            hmargin: this.options.view.hmargin,
            vmargin: this.options.view.vmargin,
            line_width: this.options.view.line_width,
            line_color: this.options.view.line_color,
            draggable: this.options.view.draggable,
            hide_scrollbars_when_draggable: this.options.view.hide_scrollbars_when_draggable
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

        apply_plugins(this);
    }
    enable_edit() {
        this.options.editable = true;
    }
    disable_edit() {
        this.options.editable = false;
    }
    // call enable_event_handle('dblclick')
    // options are 'mousedown', 'click', 'dblclick'
    enable_event_handle(event_handle) {
        this.options.default_event_handle['enable_' + event_handle + '_handle'] = true;
    }
    // call disable_event_handle('dblclick')
    // options are 'mousedown', 'click', 'dblclick'
    disable_event_handle(event_handle) {
        this.options.default_event_handle['enable_' + event_handle + '_handle'] = false;
    }
    get_editable() {
        return this.options.editable;
    }
    set_theme(theme) {
        var theme_old = this.options.theme;
        this.options.theme = (!!theme) ? theme : null;
        if (theme_old != this.options.theme) {
            this.view.reset_theme();
            this.view.reset_custom_style();
        }
    }
    _event_bind() {
        this.view.add_event(this, 'mousedown', this.mousedown_handle);
        this.view.add_event(this, 'click', this.click_handle);
        this.view.add_event(this, 'dblclick', this.dblclick_handle);
        this.view.add_event(this, "mousewheel", this.mousewheel_handle);
    }
    mousedown_handle(e) {
        if (!this.options.default_event_handle['enable_mousedown_handle']) {
            return;
        }
        var element = e.target || event.srcElement;
        var nodeid = this.view.get_binded_nodeid(element);
        if (!!nodeid) {
            if (element.tagName.toLowerCase() == 'jmnode') {
                this.select_node(nodeid);
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
        var isexpander = this.view.is_expander(element);
        if (isexpander) {
            var nodeid = this.view.get_binded_nodeid(element);
            if (!!nodeid) {
                this.toggle_node(nodeid);
            }
        }
    }
    dblclick_handle(e) {
        if (!this.options.default_event_handle['enable_dblclick_handle']) {
            return;
        }
        if (this.get_editable()) {
            var element = e.target || event.srcElement;
            var nodeid = this.view.get_binded_nodeid(element);
            if (!!nodeid) {
                this.begin_edit(nodeid);
            }
        }
    }
    // Use [Ctrl] + Mousewheel, to zoom in/out.
    mousewheel_handle(event) {
        // Test if mousewheel option is enabled and Ctrl key is pressed.
        if (!this.options.default_event_handle["enable_mousewheel_handle"] || !window.event.ctrlKey) {
            return;
        }
        // Avoid default page scrolling behavior.
        event.preventDefault();

        var dir = event.deltaY > 0 ? "Up" : "Down";
        if (dir == "Up") {
            this.view.zoomIn();
        } else {
            this.view.zoomOut();
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
        if (node.isroot) { return; }
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
        if (node.isroot) { return; }
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
        if (node.isroot) { return; }
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
            version: this.mind.version
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
    add_node(parent_node, nodeid, topic, data) {
        if (this.get_editable()) {
            var the_parent_node = this.get_node(parent_node);
            var direction = this.layout.calculate_next_child_direction(the_parent_node);
            var node = this.mind.add_node(the_parent_node, nodeid, topic, data, direction);
            if (!!node) {
                this.view.add_node(node);
                this.layout.layout();
                this.view.show(false);
                this.view.reset_node_custom_style(node);
                this.expand_node(the_parent_node);
                this.invoke_event_handle(EventType.edit, { evt: 'add_node', data: [the_parent_node.id, nodeid, topic, data], node: nodeid });
            }
            return node;
        } else {
            logger.error('fail, this mind map is not editable');
            return null;
        }
    }
    insert_node_before(node_before, nodeid, topic, data) {
        if (this.get_editable()) {
            var the_node_before = this.get_node(node_before);
            var direction = this.layout.calculate_next_child_direction(the_node_before.parent);
            var node = this.mind.insert_node_before(the_node_before, nodeid, topic, data, direction);
            if (!!node) {
                this.view.add_node(node);
                this.layout.layout();
                this.view.show(false);
                this.invoke_event_handle(EventType.edit, { evt: 'insert_node_before', data: [the_node_before.id, nodeid, topic, data], node: nodeid });
            }
            return node;
        } else {
            logger.error('fail, this mind map is not editable');
            return null;
        }
    }
    insert_node_after(node_after, nodeid, topic, data) {
        if (this.get_editable()) {
            var the_node_after = this.get_node(node_after);
            var direction = this.layout.calculate_next_child_direction(the_node_after.parent);
            var node = this.mind.insert_node_after(the_node_after, nodeid, topic, data, direction);
            if (!!node) {
                this.view.add_node(node);
                this.layout.layout();
                this.view.show(false);
                this.invoke_event_handle(EventType.edit, { evt: 'insert_node_after', data: [the_node_after.id, nodeid, topic, data], node: nodeid });
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
            var nodeid = node.id;
            var parentid = node.parent.id;
            var parent_node = this.get_node(parentid);
            this.view.save_location(parent_node);
            this.view.remove_node(node);
            this.mind.remove_node(node);
            this.layout.layout();
            this.view.show(false);
            this.view.restore_location(parent_node);
            this.invoke_event_handle(EventType.edit, { evt: 'remove_node', data: [nodeid], node: parentid });
            return true;
        } else {
            logger.error('fail, this mind map is not editable');
            return false;
        }
    }
    update_node(nodeid, topic) {
        if (this.get_editable()) {
            if (_util.text.is_empty(topic)) {
                logger.warn('fail, topic can not be empty');
                return;
            }
            var node = this.get_node(nodeid);
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
                this.invoke_event_handle(EventType.edit, { evt: 'update_node', data: [nodeid, topic], node: nodeid });
            }
        } else {
            logger.error('fail, this mind map is not editable');
            return;
        }
    }
    move_node(nodeid, beforeid, parentid, direction) {
        if (this.get_editable()) {
            var node = this.get_node(nodeid);
            var updated_node = this.mind.move_node(node, beforeid, parentid, direction);
            if (!!updated_node) {
                this.view.update_node(updated_node);
                this.layout.layout();
                this.view.show(false);
                this.invoke_event_handle(EventType.edit, { evt: 'move_node', data: [nodeid, beforeid, parentid, direction], node: nodeid });
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
        if (node.isroot) { return null; }
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
        if (node.isroot) { return null; }
        var n = null;
        if (node.parent.isroot) {
            var c = node.parent.children;
            var getthis = false;
            var ni = null;
            for (var i = 0; i < c.length; i++) {
                ni = c[i];
                if (node.direction === ni.direction) {
                    if (getthis) {
                        n = ni;
                        break;
                    }
                    if (node.id === ni.id) {
                        getthis = true;
                    }
                }
            }
        } else {
            n = this.mind.get_node_after(node);
        }
        return n;
    }
    set_node_color(nodeid, bgcolor, fgcolor) {
        if (this.get_editable()) {
            var node = this.mind.get_node(nodeid);
            if (!!node) {
                if (!!bgcolor) {
                    node.data['background-color'] = bgcolor;
                }
                if (!!fgcolor) {
                    node.data['foreground-color'] = fgcolor;
                }
                this.view.reset_node_custom_style(node);
            }
        } else {
            logger.error('fail, this mind map is not editable');
            return null;
        }
    }
    set_node_font_style(nodeid, size, weight, style) {
        if (this.get_editable()) {
            var node = this.mind.get_node(nodeid);
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
    set_node_background_image(nodeid, image, width, height, rotation) {
        if (this.get_editable()) {
            var node = this.mind.get_node(nodeid);
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
    set_node_background_rotation(nodeid, rotation) {
        if (this.get_editable()) {
            var node = this.mind.get_node(nodeid);
            if (!!node) {
                if (!node.data['background-image']) {
                    logger.error('fail, only can change rotation angle of node with background image');
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

    // quick way
    static show(options, mind) {
        var _jm = new jm(options);
        _jm.show(mind);
        return _jm;
    }
}

export default jsMind = jm;
// window.jsMind = jsMind;
