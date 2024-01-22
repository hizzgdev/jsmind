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
    line_color_invalid: 'rgba(255,51,51,0.6)',
    lookup_delay: 200,
    lookup_interval: 100,
    scrolling_trigger_width: 20,
    scrolling_step_length: 10,
    shadow_node_class_name: 'jsmind-draggable-shadow-node',
};

class DraggableNode {
    constructor(jm, options) {
        var opts = {};
        jsMind.util.json.merge(opts, DEFAULT_OPTIONS);
        jsMind.util.json.merge(opts, options);

        this.version = '0.4.0';
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
        s.className = this.options.shadow_node_class_name;
        this.shadow = s;
    }
    reset_shadow(el) {
        var s = this.shadow.style;
        this.shadow.innerHTML = el.innerHTML;
        s.left = el.style.left;
        s.top = el.style.top;
        s.width = el.style.width;
        s.height = el.style.height;
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
    magnet_shadow(shadow_p, node_p, invalid) {
        this.canvas_ctx.lineWidth = this.options.line_width;
        this.canvas_ctx.strokeStyle = invalid
            ? this.options.line_color_invalid
            : this.options.line_color;
        this.canvas_ctx.lineCap = 'round';
        this.clear_lines();
        this.canvas_lineto(shadow_p.x, shadow_p.y, node_p.x, node_p.y);
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
    event_bind() {
        var jd = this;
        var container = this.jm.view.container;
        $.on(container, 'mousedown', function (e) {
            if (e.button === 0) {
                jd.dragstart.call(jd, e);
            }
        });
        $.on(container, 'mousemove', function (e) {
            if (e.movementX !== 0 || e.movementY !== 0) {
                jd.drag.call(jd, e);
            }
        });
        $.on(container, 'mouseup', function (e) {
            jd.dragend.call(jd, e);
        });
        $.on(container, 'touchstart', function (e) {
            jd.dragstart.call(jd, e);
        });
        $.on(container, 'touchmove', function (e) {
            jd.drag.call(jd, e);
        });
        $.on(container, 'touchend', function (e) {
            jd.dragend.call(jd, e);
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
        var el = this.find_node_element(e.target);
        if (!el) {
            console.log('throw away');
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
    find_node_element(el) {
        if (
            el === this.jm.view.e_nodes ||
            el === this.jm.view.e_panel ||
            el === this.jm.view.container
        ) {
            return null;
        }
        if (el.tagName.toLowerCase() === 'jmnode') {
            return el;
        }
        return this.find_node_element(el.parentNode);
    }
    lookup_target_node() {
        let sx = this.shadow.offsetLeft;
        let sy = this.shadow.offsetTop;
        if (sx === this.shadow_p_x && sy === this.shadow_p_y) {
            return;
        }
        this.shadow_p_x = sx;
        this.shadow_p_y = sy;

        let target_direction =
            this.shadow_p_x + this.shadow_w / 2 >= this.get_root_x()
                ? jsMind.direction.right
                : jsMind.direction.left;
        let overlapping_node = this.lookup_overlapping_node_parent(target_direction);
        let target_node = overlapping_node || this.lookup_close_node(target_direction);
        if (!!target_node) {
            let points = this.calc_point_of_node(target_node, target_direction);
            let invalid = jsMind.node.inherited(this.active_node, target_node);
            this.magnet_shadow(points.sp, points.np, invalid);
            this.target_node = target_node;
            this.target_direct = target_direction;
        }
    }
    get_root_x() {
        let root = this.jm.get_root();
        let root_location = root.get_location();
        let root_size = root.get_size();
        return root_location.x + root_size.w / 2;
    }

    lookup_overlapping_node_parent(direction) {
        let shadowRect = this.shadow.getBoundingClientRect();
        let x = shadowRect.x + (shadowRect.width * (1 - direction)) / 2;
        let deltaX = (this.jm.options.layout.hspace + this.jm.options.layout.pspace) * direction;
        let deltaY = shadowRect.height;
        let points = [
            [x, shadowRect.y],
            [x, shadowRect.y + deltaY / 2],
            [x, shadowRect.y + deltaY],
            [x + deltaX / 2, shadowRect.y],
            [x + deltaX / 2, shadowRect.y + deltaY / 2],
            [x + deltaX / 2, shadowRect.y + deltaY],
            [x + deltaX, shadowRect.y],
            [x + deltaX, shadowRect.y + deltaY / 2],
            [x + deltaX, shadowRect.y + deltaY],
        ];
        for (const p of points) {
            let n = this.lookup_node_parent_by_location(p[0], p[1]);
            if (!!n) {
                return n;
            }
        }
    }

    lookup_node_parent_by_location(x, y) {
        return $.d
            .elementsFromPoint(x, y)
            .filter(
                x => x.tagName === 'JMNODE' && x.className !== this.options.shadow_node_class_name
            )
            .map(el => this.jm.view.get_binded_nodeid(el))
            .map(id => id && this.jm.mind.nodes[id])
            .map(n => n && n.parent)
            .find(n => n);
    }

    lookup_close_node(direction) {
        return Object.values(this.jm.mind.nodes)
            .filter(n => n.direction == direction || n.isroot)
            .filter(n => this.jm.layout.is_visible(n))
            .filter(n => this.shadow_on_target_side(n, direction))
            .map(n => ({ node: n, distance: this.shadow_to_node(n, direction) }))
            .reduce(
                (prev, curr) => {
                    return prev.distance < curr.distance ? prev : curr;
                },
                { node: this.jm.get_root(), distance: Number.MAX_VALUE }
            ).node;
    }

    shadow_on_target_side(node, dir) {
        return (
            (dir == jsMind.direction.right && this.shadow_to_right_of_node(node) > 0) ||
            (dir == jsMind.direction.left && this.shadow_to_left_of_node(node) > 0)
        );
    }

    shadow_to_right_of_node(node) {
        return this.shadow_p_x - node.get_location().x - node.get_size().w;
    }

    shadow_to_left_of_node(node) {
        return node.get_location().x - this.shadow_p_x - this.shadow_w;
    }

    shadow_to_base_line_of_node(node) {
        return this.shadow_p_y + this.shadow_h / 2 - node.get_location().y - node.get_size().h / 2;
    }

    shadow_to_node(node, dir) {
        let distance_x =
            dir === jsMind.direction.right
                ? Math.abs(this.shadow_to_right_of_node(node))
                : Math.abs(this.shadow_to_left_of_node(node));
        let distance_y = Math.abs(this.shadow_to_base_line_of_node(node));
        return distance_x + distance_y;
    }

    calc_point_of_node(node, dir) {
        let ns = node.get_size();
        let nl = node.get_location();
        let node_x = node.isroot
            ? nl.x + ns.w / 2
            : nl.x + (ns.w * (1 + dir)) / 2 + this.options.line_width * dir;
        let node_y = nl.y + ns.h / 2;
        let shadow_x =
            this.shadow_p_x + (this.shadow_w * (1 - dir)) / 2 - this.options.line_width * dir;
        let shadow_y = this.shadow_p_y + this.shadow_h / 2;
        return {
            sp: { x: shadow_x, y: shadow_y },
            np: { x: node_x, y: node_y },
        };
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
