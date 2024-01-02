/**
 * @license BSD
 * @copyright 2014-2023 hizzgdev@163.com
 *
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */
import { logger, EventType } from './jsmind.common.js';
import { $ } from './jsmind.dom.js';
import { init_graph } from './jsmind.graph.js';
import { util } from './jsmind.util.js';

export class ViewProvider {
    constructor(jm, options) {
        this.opts = options;
        this.jm = jm;
        this.layout = jm.layout;

        this.container = null;
        this.e_panel = null;
        this.e_nodes = null;

        this.size = { w: 0, h: 0 };

        this.selected_node = null;
        this.editing_node = null;

        this.graph = null;
        this.render_node = !!options.custom_node_render
            ? this._custom_node_render
            : this._default_node_render;
        this._initialized = false;
    }
    init() {
        logger.debug(this.opts);
        logger.debug('view.init');

        this.container = $.i(this.opts.container) ? this.opts.container : $.g(this.opts.container);
        if (!this.container) {
            logger.error('the options.view.container was not be found in dom');
            return;
        }
        this.graph = init_graph(this, this.opts.engine);

        this.e_panel = $.c('div');
        this.e_nodes = $.c('jmnodes');
        this.e_editor = $.c('input');
        this.e_panel.className = 'jsmind-inner jmnode-overflow-' + this.opts.node_overflow;
        this.e_panel.tabIndex = 1;
        this.e_panel.appendChild(this.graph.element());
        this.e_panel.appendChild(this.e_nodes);

        this.e_editor.className = 'jsmind-editor';
        this.e_editor.type = 'text';

        this.zoom_current = 1;

        var v = this;
        $.on(this.e_editor, 'keydown', function (e) {
            var evt = e || event;
            if (evt.keyCode == 13) {
                v.edit_node_end();
                evt.stopPropagation();
            }
        });
        $.on(this.e_editor, 'blur', function (e) {
            v.edit_node_end();
        });

        this.container.appendChild(this.e_panel);

        if (!this.container.offsetParent) {
            new IntersectionObserver((entities, observer) => {
                if (entities[0].isIntersecting) {
                    observer.unobserve(this.e_panel);
                    this.resize();
                }
            }).observe(this.e_panel);
        }
    }

    add_event(obj, event_name, event_handle, capture_by_panel) {
        let target = !!capture_by_panel ? this.e_panel : this.e_nodes;
        $.on(target, event_name, function (e) {
            var evt = e || event;
            event_handle.call(obj, evt);
        });
    }
    get_binded_nodeid(element) {
        if (element == null) {
            return null;
        }
        var tagName = element.tagName.toLowerCase();
        if (tagName == 'jmnode' || tagName == 'jmexpander') {
            return element.getAttribute('nodeid');
        } else if (tagName == 'jmnodes' || tagName == 'body' || tagName == 'html') {
            return null;
        } else {
            return this.get_binded_nodeid(element.parentElement);
        }
    }
    is_node(element) {
        if (element == null) {
            return false;
        }
        var tagName = element.tagName.toLowerCase();
        if (tagName == 'jmnode') {
            return true;
        } else if (tagName == 'jmnodes' || tagName == 'body' || tagName == 'html') {
            return false;
        } else {
            return this.is_node(element.parentElement);
        }
    }
    is_expander(element) {
        return element.tagName.toLowerCase() == 'jmexpander';
    }
    reset() {
        logger.debug('view.reset');
        this.selected_node = null;
        this.clear_lines();
        this.clear_nodes();
        this.reset_theme();
    }
    reset_theme() {
        var theme_name = this.jm.options.theme;
        if (!!theme_name) {
            this.e_nodes.className = 'theme-' + theme_name;
        } else {
            this.e_nodes.className = '';
        }
    }
    reset_custom_style() {
        var nodes = this.jm.mind.nodes;
        for (var nodeid in nodes) {
            this.reset_node_custom_style(nodes[nodeid]);
        }
    }
    load() {
        logger.debug('view.load');
        this.setup_canvas_draggable(this.opts.draggable);
        this.init_nodes();
        this._initialized = true;
    }
    expand_size() {
        var min_size = this.layout.get_min_size();
        var min_width = min_size.w + this.opts.hmargin * 2;
        var min_height = min_size.h + this.opts.vmargin * 2;
        var client_w = this.e_panel.clientWidth;
        var client_h = this.e_panel.clientHeight;
        if (client_w < min_width) {
            client_w = min_width;
        }
        if (client_h < min_height) {
            client_h = min_height;
        }
        this.size.w = client_w;
        this.size.h = client_h;
    }
    init_nodes_size(node) {
        var view_data = node._data.view;
        view_data.width = view_data.element.clientWidth;
        view_data.height = view_data.element.clientHeight;
    }
    init_nodes() {
        var nodes = this.jm.mind.nodes;
        var doc_frag = $.d.createDocumentFragment();
        for (var nodeid in nodes) {
            this.create_node_element(nodes[nodeid], doc_frag);
        }
        this.e_nodes.appendChild(doc_frag);

        this.run_in_c11y_mode_if_needed(() => {
            for (var nodeid in nodes) {
                this.init_nodes_size(nodes[nodeid]);
            }
        });
    }
    add_node(node) {
        this.create_node_element(node, this.e_nodes);
        this.run_in_c11y_mode_if_needed(() => {
            this.init_nodes_size(node);
        });
    }
    run_in_c11y_mode_if_needed(func) {
        if (!!this.container.offsetParent) {
            func();
            return;
        }
        logger.warn(
            'init nodes in compatibility mode. because the container or its parent has style {display:none}. '
        );
        this.e_panel.style.position = 'absolute';
        this.e_panel.style.top = '-100000';
        $.d.body.appendChild(this.e_panel);
        func();
        this.container.appendChild(this.e_panel);
        this.e_panel.style.position = null;
        this.e_panel.style.top = null;
    }
    create_node_element(node, parent_node) {
        var view_data = null;
        if ('view' in node._data) {
            view_data = node._data.view;
        } else {
            view_data = {};
            node._data.view = view_data;
        }

        var d = $.c('jmnode');
        if (node.isroot) {
            d.className = 'root';
        } else {
            var d_e = $.c('jmexpander');
            $.t(d_e, '-');
            d_e.setAttribute('nodeid', node.id);
            d_e.style.visibility = 'hidden';
            parent_node.appendChild(d_e);
            view_data.expander = d_e;
        }
        if (!!node.topic) {
            this.render_node(d, node);
        }
        d.setAttribute('nodeid', node.id);
        d.style.visibility = 'hidden';
        this._reset_node_custom_style(d, node.data);

        parent_node.appendChild(d);
        view_data.element = d;
    }
    remove_node(node) {
        if (this.selected_node != null && this.selected_node.id == node.id) {
            this.selected_node = null;
        }
        if (this.editing_node != null && this.editing_node.id == node.id) {
            node._data.view.element.removeChild(this.e_editor);
            this.editing_node = null;
        }
        var children = node.children;
        var i = children.length;
        while (i--) {
            this.remove_node(children[i]);
        }
        if (node._data.view) {
            var element = node._data.view.element;
            var expander = node._data.view.expander;
            this.e_nodes.removeChild(element);
            this.e_nodes.removeChild(expander);
            node._data.view.element = null;
            node._data.view.expander = null;
        }
    }
    update_node(node) {
        var view_data = node._data.view;
        var element = view_data.element;
        if (!!node.topic) {
            this.render_node(element, node);
        }
        if (this.layout.is_visible(node)) {
            view_data.width = element.clientWidth;
            view_data.height = element.clientHeight;
        } else {
            let origin_style = element.getAttribute('style');
            element.style = 'visibility: visible; left:0; top:0;';
            view_data.width = element.clientWidth;
            view_data.height = element.clientHeight;
            element.style = origin_style;
        }
    }
    select_node(node) {
        if (!!this.selected_node) {
            var element = this.selected_node._data.view.element;
            element.className = element.className.replace(/\s*selected\b/i, '');
            this.restore_selected_node_custom_style(this.selected_node);
        }
        if (!!node) {
            this.selected_node = node;
            node._data.view.element.className += ' selected';
            this.clear_selected_node_custom_style(node);
        }
    }
    select_clear() {
        this.select_node(null);
    }
    get_editing_node() {
        return this.editing_node;
    }
    is_editing() {
        return !!this.editing_node;
    }
    edit_node_begin(node) {
        if (!node.topic) {
            logger.warn("don't edit image nodes");
            return;
        }
        if (this.editing_node != null) {
            this.edit_node_end();
        }
        this.editing_node = node;
        var view_data = node._data.view;
        var element = view_data.element;
        var topic = node.topic;
        var ncs = getComputedStyle(element);
        this.e_editor.value = topic;
        this.e_editor.style.width =
            element.clientWidth -
            parseInt(ncs.getPropertyValue('padding-left')) -
            parseInt(ncs.getPropertyValue('padding-right')) +
            'px';
        element.innerHTML = '';
        element.appendChild(this.e_editor);
        element.style.zIndex = 5;
        this.e_editor.focus();
        this.e_editor.select();
    }
    edit_node_end() {
        if (this.editing_node != null) {
            var node = this.editing_node;
            this.editing_node = null;
            var view_data = node._data.view;
            var element = view_data.element;
            var topic = this.e_editor.value;
            element.style.zIndex = 'auto';
            element.removeChild(this.e_editor);
            if (util.text.is_empty(topic) || node.topic === topic) {
                this.render_node(element, node);
            } else {
                this.jm.update_node(node.id, topic);
            }
        }
        this.e_panel.focus();
    }
    get_view_offset() {
        var bounds = this.layout.bounds;
        var _x = (this.size.w - bounds.e - bounds.w) / 2;
        var _y = this.size.h / 2;
        return { x: _x, y: _y };
    }
    resize() {
        this.graph.set_size(1, 1);
        this.e_nodes.style.width = '1px';
        this.e_nodes.style.height = '1px';

        this.expand_size();
        this._show();
    }
    _show() {
        this.graph.set_size(this.size.w, this.size.h);
        this.e_nodes.style.width = this.size.w + 'px';
        this.e_nodes.style.height = this.size.h + 'px';
        this.show_nodes();
        this.show_lines();
        //this.layout.cache_valid = true;
        this.jm.invoke_event_handle(EventType.resize, { data: [] });
    }
    zoom_in(e) {
        return this.set_zoom(this.zoom_current + this.opts.zoom.step, e);
    }
    zoom_out(e) {
        return this.set_zoom(this.zoom_current - this.opts.zoom.step, e);
    }
    set_zoom(zoom, e) {
        if (zoom < this.opts.zoom.min || zoom > this.opts.zoom.max) {
            return false;
        }
        let e_panel_rect = this.e_panel.getBoundingClientRect();
        if (
            zoom < 1 &&
            zoom < this.zoom_current &&
            this.size.w * zoom < e_panel_rect.width &&
            this.size.h * zoom < e_panel_rect.height
        ) {
            return false;
        }
        let zoom_center = !!e
            ? { x: e.x - e_panel_rect.x, y: e.y - e_panel_rect.y }
            : { x: e_panel_rect.width / 2, y: e_panel_rect.height / 2 };
        let panel_scroll_x =
            ((this.e_panel.scrollLeft + zoom_center.x) * zoom) / this.zoom_current - zoom_center.x;
        let panel_scroll_y =
            ((this.e_panel.scrollTop + zoom_center.y) * zoom) / this.zoom_current - zoom_center.y;

        this.zoom_current = zoom;
        for (var i = 0; i < this.e_panel.children.length; i++) {
            this.e_panel.children[i].style.zoom = zoom;
        }
        this._show();
        this.e_panel.scrollLeft = panel_scroll_x;
        this.e_panel.scrollTop = panel_scroll_y;
        return true;
    }
    show(keep_center) {
        logger.debug('view.show');
        this.expand_size();
        this._show();
        if (!!keep_center) {
            this.center_node(this.jm.mind.root);
        }
    }
    relayout() {
        this.expand_size();
        this._show();
    }
    save_location(node) {
        var vd = node._data.view;
        vd._saved_location = {
            x: parseInt(vd.element.style.left) - this.e_panel.scrollLeft,
            y: parseInt(vd.element.style.top) - this.e_panel.scrollTop,
        };
    }
    restore_location(node) {
        var vd = node._data.view;
        this.e_panel.scrollLeft = parseInt(vd.element.style.left) - vd._saved_location.x;
        this.e_panel.scrollTop = parseInt(vd.element.style.top) - vd._saved_location.y;
    }
    clear_nodes() {
        var mind = this.jm.mind;
        if (mind == null) {
            return;
        }
        var nodes = mind.nodes;
        var node = null;
        for (var nodeid in nodes) {
            node = nodes[nodeid];
            node._data.view.element = null;
            node._data.view.expander = null;
        }
        this.e_nodes.innerHTML = '';
    }
    show_nodes() {
        var nodes = this.jm.mind.nodes;
        var node = null;
        var node_element = null;
        var p = null;
        var view_data = null;
        var view_offset = this.get_view_offset();
        for (var nodeid in nodes) {
            node = nodes[nodeid];
            view_data = node._data.view;
            node_element = view_data.element;
            if (!this.layout.is_visible(node)) {
                node_element.style.display = 'none';
                view_data.expander.style.display = 'none';
                continue;
            }
            this.reset_node_custom_style(node);
            p = this.layout.get_node_point(node);
            view_data.abs_x = view_offset.x + p.x;
            view_data.abs_y = view_offset.y + p.y;
            node_element.style.left = view_offset.x + p.x + 'px';
            node_element.style.top = view_offset.y + p.y + 'px';
            node_element.style.display = '';
            node_element.style.visibility = 'visible';
            this._show_expander(node, view_offset);
        }
    }
    _show_expander(node, view_offset) {
        if (node.isroot) {
            return;
        }

        var expander = node._data.view.expander;
        if (node.children.length == 0) {
            expander.style.display = 'none';
            expander.style.visibility = 'hidden';
            return;
        }

        let expander_text = this._get_expander_text(node);
        $.t(expander, expander_text);

        let p_expander = this.layout.get_expander_point(node);
        expander.style.left = view_offset.x + p_expander.x + 'px';
        expander.style.top = view_offset.y + p_expander.y + 'px';
        expander.style.display = '';
        expander.style.visibility = 'visible';
    }

    _get_expander_text(node) {
        let style = !!this.opts.expander_style ? this.opts.expander_style.toLowerCase() : 'char';
        if (style === 'number') {
            return node.children.length > 99 ? '...' : node.children.length;
        }
        if (style === 'char') {
            return node.expanded ? '-' : '+';
        }
    }

    _default_node_render(ele, node) {
        if (this.opts.support_html) {
            $.h(ele, node.topic);
        } else {
            $.t(ele, node.topic);
        }
    }
    _custom_node_render(ele, node) {
        let rendered = this.opts.custom_node_render(this.jm, ele, node);
        if (!rendered) {
            this._default_node_render(ele, node);
        }
    }
    reset_node_custom_style(node) {
        this._reset_node_custom_style(node._data.view.element, node.data);
    }
    _reset_node_custom_style(node_element, node_data) {
        if ('background-color' in node_data) {
            node_element.style.backgroundColor = node_data['background-color'];
        }
        if ('foreground-color' in node_data) {
            node_element.style.color = node_data['foreground-color'];
        }
        if ('width' in node_data) {
            node_element.style.width = node_data['width'] + 'px';
        }
        if ('height' in node_data) {
            node_element.style.height = node_data['height'] + 'px';
        }
        if ('font-size' in node_data) {
            node_element.style.fontSize = node_data['font-size'] + 'px';
        }
        if ('font-weight' in node_data) {
            node_element.style.fontWeight = node_data['font-weight'];
        }
        if ('font-style' in node_data) {
            node_element.style.fontStyle = node_data['font-style'];
        }
        if ('background-image' in node_data) {
            var backgroundImage = node_data['background-image'];
            if (backgroundImage.startsWith('data') && node_data['width'] && node_data['height']) {
                var img = new Image();

                img.onload = function () {
                    var c = $.c('canvas');
                    c.width = node_element.clientWidth;
                    c.height = node_element.clientHeight;
                    var img = this;
                    if (c.getContext) {
                        var ctx = c.getContext('2d');
                        ctx.drawImage(
                            img,
                            2,
                            2,
                            node_element.clientWidth,
                            node_element.clientHeight
                        );
                        var scaledImageData = c.toDataURL();
                        node_element.style.backgroundImage = 'url(' + scaledImageData + ')';
                    }
                };
                img.src = backgroundImage;
            } else {
                node_element.style.backgroundImage = 'url(' + backgroundImage + ')';
            }
            node_element.style.backgroundSize = '99%';

            if ('background-rotation' in node_data) {
                node_element.style.transform =
                    'rotate(' + node_data['background-rotation'] + 'deg)';
            }
        }
    }
    restore_selected_node_custom_style(node) {
        var node_element = node._data.view.element;
        var node_data = node.data;
        if ('background-color' in node_data) {
            node_element.style.backgroundColor = node_data['background-color'];
        }
        if ('foreground-color' in node_data) {
            node_element.style.color = node_data['foreground-color'];
        }
    }
    clear_selected_node_custom_style(node) {
        var node_element = node._data.view.element;
        node_element.style.backgroundColor = '';
        node_element.style.color = '';
    }
    clear_lines() {
        this.graph.clear();
    }
    show_lines() {
        this.clear_lines();
        var nodes = this.jm.mind.nodes;
        var node = null;
        var pin = null;
        var pout = null;
        var color = null;
        var _offset = this.get_view_offset();
        for (var nodeid in nodes) {
            node = nodes[nodeid];
            if (!!node.isroot) {
                continue;
            }
            if (!this.layout.is_visible(node)) {
                continue;
            }
            pin = this.layout.get_node_point_in(node);
            pout = this.layout.get_node_point_out(node.parent);
            color = node.data['leading-line-color'];
            this.graph.draw_line(pout, pin, _offset, color);
        }
    }
    // Drag the whole mind map with your mouse, when it's larger that the container
    setup_canvas_draggable(enabled) {
        this.opts.draggable = enabled;
        if (!this._initialized) {
            let dragging = false;
            let x, y;
            if (this.opts.hide_scrollbars_when_draggable) {
                // Avoid scrollbars when mind map is larger than the container (e_panel = id jsmind-inner)
                this.e_panel.style = 'overflow: hidden';
            }
            // Move the whole mind map with mouse moves, while button is down.
            $.on(this.container, 'mousedown', eventDown => {
                if (this.opts.draggable) {
                    dragging = true;
                    // Record current mouse position.
                    x = eventDown.clientX;
                    y = eventDown.clientY;
                }
            });
            // Stop moving mind map once mouse button is released.
            $.on(this.container, 'mouseup', () => {
                dragging = false;
            });
            // Follow current mouse position and move mind map accordingly.
            $.on(this.container, 'mousemove', eventMove => {
                if (this.opts.draggable) {
                    if (dragging) {
                        this.e_panel.scrollBy(x - eventMove.clientX, y - eventMove.clientY);
                        // Record new current position.
                        x = eventMove.clientX;
                        y = eventMove.clientY;
                    }
                }
            });
        }
    }
    center_node(node) {
        if (!this.layout.is_visible(node)) {
            logger.warn('can not scroll to the node, because it is invisible');
            return false;
        }
        let view_data = node._data.view;
        let e_panel_rect = this.e_panel.getBoundingClientRect();
        let node_center_point = {
            x: view_data.abs_x + view_data.width / 2,
            y: view_data.abs_y + view_data.height / 2,
        };
        this.e_panel.scrollTo(
            node_center_point.x * this.zoom_current - e_panel_rect.width / 2,
            node_center_point.y * this.zoom_current - e_panel_rect.height / 2
        );
        return true;
    }

    zoomIn(e) {
        logger.warn('please use zoom_in instead');
        return this.zoom_in(e);
    }
    zoomOut(e) {
        logger.warn('please use zoom_out instead');
        return this.zoom_out(e);
    }
    setZoom(zoom, e) {
        logger.warn('please use set_zoom instead');
        return this.set_zoom(zoom, e);
    }
}
