/**
 * @license BSD
 * @copyright 2014-2022 hizzgdev@163.com
 *
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */

if (!jsMind) {
    throw new Error('jsMind is not defined');
}

const jm = jsMind;
const $ = jm.$;

const clear_selection =
    'getSelection' in $.w
        ? function () {
              $.w.getSelection().removeAllRanges();
          }
        : function () {
              $.d.selection.empty();
          };

const options = {
    line_width: 5,
    lookup_delay: 500,
    lookup_interval: 80,
};

class DraggableNode {
    constructor(jm) {
        this.jm = jm;
        this.e_canvas = null;
        this.canvas_ctx = null;
        this.shadow = null;
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
        this.canvas_draggable = this.jm.get_view_draggable();
    }
    init() {
        this._create_canvas();
        this._create_shadow();
        this._event_bind();
    }
    resize() {
        this.jm.view.e_nodes.appendChild(this.shadow);
        this.e_canvas.width = this.jm.view.size.w;
        this.e_canvas.height = this.jm.view.size.h;
    }
    _create_canvas() {
        var c = $.c('canvas');
        this.jm.view.e_panel.appendChild(c);
        var ctx = c.getContext('2d');
        this.e_canvas = c;
        this.canvas_ctx = ctx;
    }
    _create_shadow() {
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
    _magnet_shadow(node) {
        if (!!node) {
            this.canvas_ctx.lineWidth = options.line_width;
            this.canvas_ctx.strokeStyle = 'rgba(0,0,0,0.3)';
            this.canvas_ctx.lineCap = 'round';
            this._clear_lines();
            this._canvas_lineto(node.sp.x, node.sp.y, node.np.x, node.np.y);
        }
    }
    _clear_lines() {
        this.canvas_ctx.clearRect(0, 0, this.jm.view.size.w, this.jm.view.size.h);
    }
    _canvas_lineto(x1, y1, x2, y2) {
        this.canvas_ctx.beginPath();
        this.canvas_ctx.moveTo(x1, y1);
        this.canvas_ctx.lineTo(x2, y2);
        this.canvas_ctx.stroke();
    }
    _lookup_close_node() {
        var root = this.jm.get_root();
        var root_location = root.get_location();
        var root_size = root.get_size();
        var root_x = root_location.x + root_size.w / 2;

        var sw = this.shadow_w;
        var sh = this.shadow_h;
        var sx = this.shadow.offsetLeft;
        var sy = this.shadow.offsetTop;

        var ns, nl;

        var direct = sx + sw / 2 >= root_x ? jsMind.direction.right : jsMind.direction.left;
        var nodes = this.jm.mind.nodes;
        var node = null;
        var layout = this.jm.layout;
        var min_distance = Number.MAX_VALUE;
        var distance = 0;
        var closest_node = null;
        var closest_p = null;
        var shadow_p = null;
        for (var nodeid in nodes) {
            var np, sp;
            node = nodes[nodeid];
            if (node.isroot || node.direction == direct) {
                if (node.id == this.active_node.id) {
                    continue;
                }
                if (!layout.is_visible(node)) {
                    continue;
                }
                ns = node.get_size();
                nl = node.get_location();
                if (direct == jsMind.direction.right) {
                    if (sx - nl.x - ns.w <= 0) {
                        continue;
                    }
                    distance = Math.abs(sx - nl.x - ns.w) + Math.abs(sy + sh / 2 - nl.y - ns.h / 2);
                    np = { x: nl.x + ns.w - options.line_width, y: nl.y + ns.h / 2 };
                    sp = { x: sx + options.line_width, y: sy + sh / 2 };
                } else {
                    if (nl.x - sx - sw <= 0) {
                        continue;
                    }
                    distance = Math.abs(sx + sw - nl.x) + Math.abs(sy + sh / 2 - nl.y - ns.h / 2);
                    np = { x: nl.x + options.line_width, y: nl.y + ns.h / 2 };
                    sp = { x: sx + sw - options.line_width, y: sy + sh / 2 };
                }
                if (distance < min_distance) {
                    closest_node = node;
                    closest_p = np;
                    shadow_p = sp;
                    min_distance = distance;
                }
            }
        }
        var result_node = null;
        if (!!closest_node) {
            result_node = {
                node: closest_node,
                direction: direct,
                sp: shadow_p,
                np: closest_p,
            };
        }
        return result_node;
    }
    lookup_close_node() {
        var node_data = this._lookup_close_node();
        if (!!node_data) {
            this._magnet_shadow(node_data);
            this.target_node = node_data.node;
            this.target_direct = node_data.direction;
        }
    }
    _event_bind() {
        var jd = this;
        var container = this.jm.view.container;
        $.on(container, 'mousedown', function (e) {
            var evt = e || event;
            jd.dragstart.call(jd, evt);
        });
        $.on(container, 'mousemove', function (e) {
            var evt = e || event;
            jd.drag.call(jd, evt);
        });
        $.on(container, 'mouseup', function (e) {
            var evt = e || event;
            jd.dragend.call(jd, evt);
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
                this.active_node = node;
                this.offset_x =
                    (e.clientX || e.touches[0].clientX) / jview.actualZoom - el.offsetLeft;
                this.offset_y =
                    (e.clientY || e.touches[0].clientY) / jview.actualZoom - el.offsetTop;
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
                        jd.lookup_close_node.call(jd);
                    }, options.lookup_interval);
                }, options.lookup_delay);
                this.capture = true;
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
            var px = (e.clientX || e.touches[0].clientX) / jview.actualZoom - this.offset_x;
            var py = (e.clientY || e.touches[0].clientY) / jview.actualZoom - this.offset_y;
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
                this._clear_lines();
            }
            if (this.hlookup_timer != 0) {
                $.w.clearInterval(this.hlookup_timer);
                this.hlookup_timer = 0;
                this._clear_lines();
            }
            if (this.moved) {
                var src_node = this.active_node;
                var target_node = this.target_node;
                var target_direct = this.target_direct;
                this.move_node(src_node, target_node, target_direct);
            }
            this.hide_shadow();
        }
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

var draggable_plugin = new jm.plugin('draggable_node', function (jm) {
    var jd = new DraggableNode(jm);
    jd.init();
    jm.add_event_listener(function (type, data) {
        jd.jm_event_handle.call(jd, type, data);
    });
});

jsMind.register_plugin(draggable_plugin);
