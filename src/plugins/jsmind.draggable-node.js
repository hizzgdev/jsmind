/**
 * @license BSD
 * @copyright 2014-2023 hizzgdev@163.com
 *
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */

import jsMind from 'jsmind';

if (!jsMind) {
    throw new Error('jsMind is not defined');
}

const $ = jsMind.$;

const clear_selection =
    'getSelection' in $.w
        ? function () {
              $.w.getSelection().removeAllRanges();
          }
        : function () {
              $.d.selection.empty();
          };

const DEFAULT_OPTIONS = {
    line_width: 5,
    line_color: 'rgba(0,0,0,0.3)',
    lookup_delay: 500,
    lookup_interval: 80,
    scrolling_trigger_width: 20,
    scrolling_step_length: 10,
};

class DraggableNode {
    constructor(jm, options) {
        var opts = {};
        jsMind.util.json.merge(opts, DEFAULT_OPTIONS);
        jsMind.util.json.merge(opts, options);

        this.version = '0.3.0';
        this.jm = jm;
        this.options = opts;
        this.e_canvas = null;
        this.canvas_ctx = null;
        this.shadow = null;
        this.shadow_p_x = 0;
        this.shadow_p_y = 0;
        this.shadow_w = 0;
        this.shadow_h = 0;
        this.active_node = null;
        this.target_node = null;
        this.hovered_el = null;
        this.target_direct = null;
        this.client_w = 0;
        this.client_h = 0;
        this.offset_x = 0;
        this.offset_y = 0;
        this.hlookup_delay = 0;
        this.hlookup_timer = 0;
        this.capture = false;
        this.moved = false;
        this.canvas_draggable = jm.get_view_draggable();
        this.view_panel = jm.view.e_panel;
        this.view_panel_rect = null;
    }
    init() {
        this.create_canvas();
        this.create_shadow();
        this.event_bind();
    }
    resize() {
        this.jm.view.e_nodes.appendChild(this.shadow);
        this.e_canvas.width = this.jm.view.size.w;
        this.e_canvas.height = this.jm.view.size.h;
    }
    create_canvas() {
        var c = $.c('canvas');
        this.jm.view.e_panel.appendChild(c);
        var ctx = c.getContext('2d');
        this.e_canvas = c;
        this.canvas_ctx = ctx;
    }
    create_shadow() {
        var s = $.c('jmnode');
        s.style.visibility = 'hidden';
        s.style.zIndex = '3';
        s.style.cursor = 'move';
        s.style.opacity = '0.7';
        this.shadow = s;
    }
    reset_shadow(el) {
        var s = this.shadow.style;
        this.shadow.innerHTML = el.innerHTML;
        s.left = el.style.left;
        s.top = el.style.top;
        s.width = el.style.width;
        s.height = el.style.height;
        s.pointerEvents = 'none';
        s.backgroundImage = el.style.backgroundImage;
        s.backgroundSize = el.style.backgroundSize;
        s.transform = el.style.transform;
        this.shadow_w = this.shadow.clientWidth;
        this.shadow_h = this.shadow.clientHeight;
    }
    show_shadow() {
        if (!this.moved) {
            this.shadow.style.visibility = 'visible';
        }
    }
    hide_shadow() {
        this.shadow.style.visibility = 'hidden';
    }
    magnet_shadow(node) {
        if (!!node) {
            this.canvas_ctx.lineWidth = this.options.line_width;
            this.canvas_ctx.strokeStyle = this.options.line_color;
            this.canvas_ctx.lineCap = 'round';
            this.clear_lines();
            this.canvas_lineto(node.sp.x, node.sp.y, node.np.x, node.np.y);
        }
    }
    clear_lines() {
        this.canvas_ctx.clearRect(0, 0, this.jm.view.size.w, this.jm.view.size.h);
    }
    canvas_lineto(x1, y1, x2, y2) {
        this.canvas_ctx.beginPath();
        this.canvas_ctx.moveTo(x1, y1);
        this.canvas_ctx.lineTo(x2, y2);
        this.canvas_ctx.stroke();
    }
    get_root_x() {
        let root = this.jm.get_root();
        let root_location = root.get_location();
        let root_size = root.get_size();
        return root_location.x + root_size.w / 2;
    }
    lookup_close_node(direct) {
        var ns, nl;
        var nodes = this.jm.mind.nodes;
        var layout = this.jm.layout;
        var closest_node = null;
        for (var nodeid in nodes) {
            let node = nodes[nodeid];
            if (!node.isroot && node.direction !== direct) {
                continue;
            }
            if (node.id == this.active_node.id) {
                continue;
            }
            if (!layout.is_visible(node)) {
                continue;
            }
            ns = node.get_size();
            nl = node.get_location();
            if (direct == jsMind.direction.right) {
                if (this.shadow_p_x - nl.x - ns.w <= 0) {
                    continue;
                }
            } else {
                if (nl.x - this.shadow_p_x - this.shadow_w <= 0) {
                    continue;
                }
            }
            let result = this.calc_distance(node, direct);
            if (!closest_node || result.distance < closest_node.distance) {
                closest_node = result;
            }
        }
        return closest_node;
    }

    lookup_hovered_node_parent(direct) {
        let hovered_node_id = this.jm.view.get_binded_nodeid(this.hovered_el);
        if (!hovered_node_id) {
            return null;
        }
        let hovered_node = this.jm.mind.nodes[hovered_node_id];
        if (!hovered_node) {
            return null;
        }
        let node = hovered_node.parent;
        if (!node) {
            return null;
        }
        return this.calc_distance(node, direct);
    }

    calc_distance(node_candidate, direct) {
        let ns = node_candidate.get_size();
        let nl = node_candidate.get_location();
        let np, sp, distance;
        if (direct == jsMind.direction.right) {
            np = { x: nl.x + ns.w - this.options.line_width, y: nl.y + ns.h / 2 };
            sp = {
                x: this.shadow_p_x + this.options.line_width,
                y: this.shadow_p_y + this.shadow_h / 2,
            };
            distance =
                Math.abs(this.shadow_p_x - nl.x - ns.w) +
                Math.abs(this.shadow_p_y + this.shadow_h / 2 - nl.y - ns.h / 2);
        } else {
            np = { x: nl.x + this.options.line_width, y: nl.y + ns.h / 2 };
            sp = {
                x: this.shadow_p_x + this.shadow_w - this.options.line_width,
                y: this.shadow_p_y + this.shadow_h / 2,
            };
            distance =
                Math.abs(this.shadow_p_x + this.shadow_w - nl.x) +
                Math.abs(this.shadow_p_y + this.shadow_h / 2 - nl.y - ns.h / 2);
        }
        return { node: node_candidate, direction: direct, distance: distance, sp: sp, np: np };
    }
    lookup_target_node() {
        let sx = this.shadow.offsetLeft;
        let sy = this.shadow.offsetTop;
        if (sx === this.shadow_p_x && sy === this.shadow_p_y) {
            return;
        }
        this.shadow_p_x = sx;
        this.shadow_p_y = sy;
        let direct =
            this.shadow_p_x + this.shadow_w / 2 >= this.get_root_x()
                ? jsMind.direction.right
                : jsMind.direction.left;
        var hovered_node_parent = this.lookup_hovered_node_parent(direct);
        var node_data = hovered_node_parent || this.lookup_close_node(direct);
        if (!!node_data) {
            this.magnet_shadow(node_data);
            this.target_node = node_data.node;
            this.target_direct = node_data.direction;
        }
    }
    event_bind() {
        var jd = this;
        var container = this.jm.view.container;
        $.on(container, 'mousedown', function (e) {
            var evt = e || event;
            if (evt.button === 0) {
                jd.dragstart.call(jd, evt);
            }
        });
        $.on(container, 'mousemove', function (e) {
            var evt = e || event;
            if (e.movementX !== 0 || e.movementY !== 0) {
                jd.drag.call(jd, evt);
            }
        });
        $.on(container, 'mouseup', function (e) {
            var evt = e || event;
            jd.dragend.call(jd, evt);
        });
        $.on(container, 'mouseover', function (e) {
            var evt = e || event;
            jd.hovered_el = e.target;
        });
        $.on(container, 'touchstart', function (e) {
            var evt = e || event;
            jd.dragstart.call(jd, evt);
        });
        $.on(container, 'touchmove', function (e) {
            var evt = e || event;
            jd.drag.call(jd, evt);
        });
        $.on(container, 'touchend', function (e) {
            var evt = e || event;
            jd.dragend.call(jd, evt);
        });
    }
    dragstart(e) {
        if (!this.jm.get_editable()) {
            return;
        }
        if (this.capture) {
            return;
        }
        this.active_node = null;
        this.view_draggable = this.jm.get_view_draggable();

        var jview = this.jm.view;
        var el = e.target || event.srcElement;
        if (el.tagName.toLowerCase() != 'jmnode') {
            return;
        }
        if (this.view_draggable) {
            this.jm.disable_view_draggable();
        }
        var nodeid = jview.get_binded_nodeid(el);
        if (!!nodeid) {
            var node = this.jm.get_node(nodeid);
            if (!node.isroot) {
                this.reset_shadow(el);
                this.view_panel_rect = this.view_panel.getBoundingClientRect();
                this.active_node = node;
                this.offset_x =
                    (e.clientX || e.touches[0].clientX) / jview.zoom_current - el.offsetLeft;
                this.offset_y =
                    (e.clientY || e.touches[0].clientY) / jview.zoom_current - el.offsetTop;
                this.client_hw = Math.floor(el.clientWidth / 2);
                this.client_hh = Math.floor(el.clientHeight / 2);
                if (this.hlookup_delay != 0) {
                    $.w.clearTimeout(this.hlookup_delay);
                }
                if (this.hlookup_timer != 0) {
                    $.w.clearInterval(this.hlookup_timer);
                }
                var jd = this;
                this.hlookup_delay = $.w.setTimeout(function () {
                    jd.hlookup_delay = 0;
                    jd.hlookup_timer = $.w.setInterval(function () {
                        jd.lookup_target_node.call(jd);
                    }, jd.options.lookup_interval);
                }, this.options.lookup_delay);
                jd.capture = true;
            }
        }
    }
    drag(e) {
        if (!this.jm.get_editable()) {
            return;
        }
        if (this.capture) {
            console.log('move');
            e.preventDefault();
            this.show_shadow();
            this.moved = true;
            clear_selection();
            var jview = this.jm.view;
            var px = (e.clientX || e.touches[0].clientX) / jview.zoom_current - this.offset_x;
            var py = (e.clientY || e.touches[0].clientY) / jview.zoom_current - this.offset_y;
            // scrolling container axisY if drag nodes exceeding container
            if (
                e.clientY - this.view_panel_rect.top < this.options.scrolling_trigger_width &&
                this.view_panel.scrollTop > this.options.scrolling_step_length
            ) {
                this.view_panel.scrollBy(0, -this.options.scrolling_step_length);
                this.offset_y += this.options.scrolling_step_length / jview.zoom_current;
            } else if (
                this.view_panel_rect.bottom - e.clientY < this.options.scrolling_trigger_width &&
                this.view_panel.scrollTop <
                    this.view_panel.scrollHeight -
                        this.view_panel_rect.height -
                        this.options.scrolling_step_length
            ) {
                this.view_panel.scrollBy(0, this.options.scrolling_step_length);
                this.offset_y -= this.options.scrolling_step_length / jview.zoom_current;
            }
            // scrolling container axisX if drag nodes exceeding container
            if (
                e.clientX - this.view_panel_rect.left < this.options.scrolling_trigger_width &&
                this.view_panel.scrollLeft > this.options.scrolling_step_length
            ) {
                this.view_panel.scrollBy(-this.options.scrolling_step_length, 0);
                this.offset_x += this.options.scrolling_step_length / jview.zoom_current;
            } else if (
                this.view_panel_rect.right - e.clientX < this.options.scrolling_trigger_width &&
                this.view_panel.scrollLeft <
                    this.view_panel.scrollWidth -
                        this.view_panel_rect.width -
                        this.options.scrolling_step_length
            ) {
                this.view_panel.scrollBy(this.options.scrolling_step_length, 0);
                this.offset_x -= this.options.scrolling_step_length / jview.zoom_current;
            }
            this.shadow.style.left = px + 'px';
            this.shadow.style.top = py + 'px';
            clear_selection();
        }
    }
    dragend(e) {
        if (!this.jm.get_editable()) {
            return;
        }
        if (this.view_draggable) {
            this.jm.enable_view_draggable();
        }
        if (this.capture) {
            if (this.hlookup_delay != 0) {
                $.w.clearTimeout(this.hlookup_delay);
                this.hlookup_delay = 0;
                this.clear_lines();
            }
            if (this.hlookup_timer != 0) {
                $.w.clearInterval(this.hlookup_timer);
                this.hlookup_timer = 0;
                this.clear_lines();
            }
            if (this.moved) {
                var src_node = this.active_node;
                var target_node = this.target_node;
                var target_direct = this.target_direct;
                this.move_node(src_node, target_node, target_direct);
            }
            this.hide_shadow();
        }
        this.view_panel_rect = null;
        this.moved = false;
        this.capture = false;
    }
    move_node(src_node, target_node, target_direct) {
        var shadow_h = this.shadow.offsetTop;
        if (!!target_node && !!src_node && !jsMind.node.inherited(src_node, target_node)) {
            // lookup before_node
            var sibling_nodes = target_node.children;
            var sc = sibling_nodes.length;
            var node = null;
            var delta_y = Number.MAX_VALUE;
            var node_before = null;
            var beforeid = '_last_';
            while (sc--) {
                node = sibling_nodes[sc];
                if (node.direction == target_direct && node.id != src_node.id) {
                    var dy = node.get_location().y - shadow_h;
                    if (dy > 0 && dy < delta_y) {
                        delta_y = dy;
                        node_before = node;
                        beforeid = '_first_';
                    }
                }
            }
            if (!!node_before) {
                beforeid = node_before.id;
            }
            this.jm.move_node(src_node.id, beforeid, target_node.id, target_direct);
        }
        this.active_node = null;
        this.target_node = null;
        this.target_direct = null;
    }
    jm_event_handle(type, data) {
        if (type === jsMind.event_type.resize) {
            this.resize();
        }
    }
}

var draggable_plugin = new jsMind.plugin('draggable_node', function (jm, options) {
    var jd = new DraggableNode(jm, options);
    jd.init();
    jm.add_event_listener(function (type, data) {
        jd.jm_event_handle.call(jd, type, data);
    });
});

jsMind.register_plugin(draggable_plugin);
