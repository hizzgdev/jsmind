/**
 * @license BSD
 * @copyright 2014-2023 hizzgdev@163.com
 *
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */
import { logger, Direction, EventType } from './jsmind.common.js';

export class LayoutProvider {
    constructor(jm, options) {
        this.opts = options;
        this.jm = jm;
        this.isside = this.opts.mode == 'side';
        this.bounds = null;

        this.cache_valid = false;
    }
    init() {
        logger.debug('layout.init');
    }
    reset() {
        logger.debug('layout.reset');
        this.bounds = { n: 0, s: 0, w: 0, e: 0 };
    }
    calculate_next_child_direction(node) {
        if (this.isside) {
            return Direction.right;
        }
        var children = node.children || [];
        var children_len = children.length;
        var r = 0;
        for (var i = 0; i < children_len; i++) {
            if (children[i].direction === Direction.left) {
                r--;
            } else {
                r++;
            }
        }
        return children_len > 1 && r > 0 ? Direction.left : Direction.right;
    }
    layout() {
        logger.debug('layout.layout');
        this.layout_direction();
        this.layout_offset();
    }
    layout_direction() {
        this._layout_direction_root();
    }
    _layout_direction_root() {
        var node = this.jm.mind.root;
        var layout_data = null;
        if ('layout' in node._data) {
            layout_data = node._data.layout;
        } else {
            layout_data = {};
            node._data.layout = layout_data;
        }
        var children = node.children;
        var children_count = children.length;
        layout_data.direction = Direction.center;
        layout_data.side_index = 0;
        if (this.isside) {
            var i = children_count;
            while (i--) {
                this._layout_direction_side(children[i], Direction.right, i);
            }
        } else {
            var i = children_count;
            var subnode = null;
            while (i--) {
                subnode = children[i];
                if (subnode.direction == Direction.left) {
                    this._layout_direction_side(subnode, Direction.left, i);
                } else {
                    this._layout_direction_side(subnode, Direction.right, i);
                }
            }
        }
    }
    _layout_direction_side(node, direction, side_index) {
        var layout_data = null;
        if ('layout' in node._data) {
            layout_data = node._data.layout;
        } else {
            layout_data = {};
            node._data.layout = layout_data;
        }
        var children = node.children;
        var children_count = children.length;

        layout_data.direction = direction;
        layout_data.side_index = side_index;
        var i = children_count;
        while (i--) {
            this._layout_direction_side(children[i], direction, i);
        }
    }
    layout_offset() {
        var node = this.jm.mind.root;
        var layout_data = node._data.layout;
        layout_data.offset_x = 0;
        layout_data.offset_y = 0;
        layout_data.outer_height = 0;
        var children = node.children;
        var i = children.length;
        var left_nodes = [];
        var right_nodes = [];
        var subnode = null;
        while (i--) {
            subnode = children[i];
            if (subnode._data.layout.direction == Direction.right) {
                right_nodes.unshift(subnode);
            } else {
                left_nodes.unshift(subnode);
            }
        }
        layout_data.left_nodes = left_nodes;
        layout_data.right_nodes = right_nodes;
        layout_data.outer_height_left = this._layout_offset_subnodes(left_nodes);
        layout_data.outer_height_right = this._layout_offset_subnodes(right_nodes);
        this.bounds.e = node._data.view.width / 2;
        this.bounds.w = 0 - this.bounds.e;
        this.bounds.n = 0;
        this.bounds.s = Math.max(layout_data.outer_height_left, layout_data.outer_height_right);
    }
    // layout both the x and y axis
    _layout_offset_subnodes(nodes) {
        var total_height = 0;
        var nodes_count = nodes.length;
        var i = nodes_count;
        var node = null;
        var node_outer_height = 0;
        var layout_data = null;
        var base_y = 0;
        var pd = null; // parent._data
        while (i--) {
            node = nodes[i];
            layout_data = node._data.layout;
            if (pd == null) {
                pd = node.parent._data;
            }

            node_outer_height = this._layout_offset_subnodes(node.children);
            if (!node.expanded) {
                node_outer_height = 0;
                this.set_visible(node.children, false);
            }
            node_outer_height = Math.max(node._data.view.height, node_outer_height);
            if (node.children.length > 1) {
                node_outer_height += this.opts.cousin_space;
            }

            layout_data.outer_height = node_outer_height;
            layout_data.offset_y = base_y - node_outer_height / 2;
            layout_data.offset_x =
                this.opts.hspace * layout_data.direction +
                (pd.view.width * (pd.layout.direction + layout_data.direction)) / 2;
            if (!node.parent.isroot) {
                layout_data.offset_x += this.opts.pspace * layout_data.direction;
            }

            base_y = base_y - node_outer_height - this.opts.vspace;
            total_height += node_outer_height;
        }
        if (nodes_count > 1) {
            total_height += this.opts.vspace * (nodes_count - 1);
        }
        i = nodes_count;
        var middle_height = total_height / 2;
        while (i--) {
            node = nodes[i];
            node._data.layout.offset_y += middle_height;
        }
        return total_height;
    }
    // layout the y axis only, for collapse/expand a node
    _layout_offset_subnodes_height(nodes) {
        var total_height = 0;
        var nodes_count = nodes.length;
        var i = nodes_count;
        var node = null;
        var node_outer_height = 0;
        var layout_data = null;
        var base_y = 0;
        var pd = null; // parent._data
        while (i--) {
            node = nodes[i];
            layout_data = node._data.layout;
            if (pd == null) {
                pd = node.parent._data;
            }

            node_outer_height = this._layout_offset_subnodes_height(node.children);
            if (!node.expanded) {
                node_outer_height = 0;
            }
            node_outer_height = Math.max(node._data.view.height, node_outer_height);
            if (node.children.length > 1) {
                node_outer_height += this.opts.cousin_space;
            }

            layout_data.outer_height = node_outer_height;
            layout_data.offset_y = base_y - node_outer_height / 2;
            base_y = base_y - node_outer_height - this.opts.vspace;
            total_height += node_outer_height;
        }
        if (nodes_count > 1) {
            total_height += this.opts.vspace * (nodes_count - 1);
        }
        i = nodes_count;
        var middle_height = total_height / 2;
        while (i--) {
            node = nodes[i];
            node._data.layout.offset_y += middle_height;
        }
        return total_height;
    }
    get_node_offset(node) {
        var layout_data = node._data.layout;
        var offset_cache = null;
        if ('_offset_' in layout_data && this.cache_valid) {
            offset_cache = layout_data._offset_;
        } else {
            offset_cache = { x: -1, y: -1 };
            layout_data._offset_ = offset_cache;
        }
        if (offset_cache.x == -1 || offset_cache.y == -1) {
            var x = layout_data.offset_x;
            var y = layout_data.offset_y;
            if (!node.isroot) {
                var offset_p = this.get_node_offset(node.parent);
                x += offset_p.x;
                y += offset_p.y;
            }
            offset_cache.x = x;
            offset_cache.y = y;
        }
        return offset_cache;
    }
    get_node_point(node) {
        var view_data = node._data.view;
        var offset_p = this.get_node_offset(node);
        var p = {};
        p.x = offset_p.x + (view_data.width * (node._data.layout.direction - 1)) / 2;
        p.y = offset_p.y - view_data.height / 2;
        return p;
    }
    get_node_point_in(node) {
        var p = this.get_node_offset(node);
        return p;
    }
    get_node_point_out(node) {
        var layout_data = node._data.layout;
        var pout_cache = null;
        if ('_pout_' in layout_data && this.cache_valid) {
            pout_cache = layout_data._pout_;
        } else {
            pout_cache = { x: -1, y: -1 };
            layout_data._pout_ = pout_cache;
        }
        if (pout_cache.x == -1 || pout_cache.y == -1) {
            if (node.isroot) {
                pout_cache.x = 0;
                pout_cache.y = 0;
            } else {
                var view_data = node._data.view;
                var offset_p = this.get_node_offset(node);
                pout_cache.x =
                    offset_p.x + (view_data.width + this.opts.pspace) * node._data.layout.direction;
                pout_cache.y = offset_p.y;
            }
        }
        return pout_cache;
    }
    get_expander_point(node) {
        var p = this.get_node_point_out(node);
        var ex_p = {};
        if (node._data.layout.direction == Direction.right) {
            ex_p.x = p.x - this.opts.pspace;
        } else {
            ex_p.x = p.x;
        }
        ex_p.y = p.y - Math.ceil(this.opts.pspace / 2);
        return ex_p;
    }
    get_min_size() {
        var nodes = this.jm.mind.nodes;
        var node = null;
        var pout = null;
        for (var node_id in nodes) {
            node = nodes[node_id];
            pout = this.get_node_point_out(node);
            if (pout.x > this.bounds.e) {
                this.bounds.e = pout.x;
            }
            if (pout.x < this.bounds.w) {
                this.bounds.w = pout.x;
            }
        }
        return {
            w: this.bounds.e - this.bounds.w,
            h: this.bounds.s - this.bounds.n,
        };
    }
    toggle_node(node) {
        if (node.isroot) {
            return;
        }
        if (node.expanded) {
            this.collapse_node(node);
        } else {
            this.expand_node(node);
        }
    }
    expand_node(node) {
        node.expanded = true;
        this.part_layout(node);
        this.set_visible(node.children, true);
        this.jm.invoke_event_handle(EventType.show, {
            evt: 'expand_node',
            data: [],
            node: node.id,
        });
    }
    collapse_node(node) {
        node.expanded = false;
        this.part_layout(node);
        this.set_visible(node.children, false);
        this.jm.invoke_event_handle(EventType.show, {
            evt: 'collapse_node',
            data: [],
            node: node.id,
        });
    }
    expand_all() {
        var nodes = this.jm.mind.nodes;
        var c = 0;
        var node;
        for (var node_id in nodes) {
            node = nodes[node_id];
            if (!node.expanded) {
                node.expanded = true;
                c++;
            }
        }
        if (c > 0) {
            var root = this.jm.mind.root;
            this.part_layout(root);
            this.set_visible(root.children, true);
        }
    }
    collapse_all() {
        var nodes = this.jm.mind.nodes;
        var c = 0;
        var node;
        for (var node_id in nodes) {
            node = nodes[node_id];
            if (node.expanded && !node.isroot) {
                node.expanded = false;
                c++;
            }
        }
        if (c > 0) {
            var root = this.jm.mind.root;
            this.part_layout(root);
            this.set_visible(root.children, true);
        }
    }
    expand_to_depth(target_depth, curr_nodes, curr_depth) {
        if (target_depth < 1) {
            return;
        }
        var nodes = curr_nodes || this.jm.mind.root.children;
        var depth = curr_depth || 1;
        var i = nodes.length;
        var node = null;
        while (i--) {
            node = nodes[i];
            if (depth < target_depth) {
                if (!node.expanded) {
                    this.expand_node(node);
                }
                this.expand_to_depth(target_depth, node.children, depth + 1);
            }
            if (depth == target_depth) {
                if (node.expanded) {
                    this.collapse_node(node);
                }
            }
        }
    }
    part_layout(node) {
        var root = this.jm.mind.root;
        if (!!root) {
            var root_layout_data = root._data.layout;
            if (node.isroot) {
                root_layout_data.outer_height_right = this._layout_offset_subnodes_height(
                    root_layout_data.right_nodes
                );
                root_layout_data.outer_height_left = this._layout_offset_subnodes_height(
                    root_layout_data.left_nodes
                );
            } else {
                if (node._data.layout.direction == Direction.right) {
                    root_layout_data.outer_height_right = this._layout_offset_subnodes_height(
                        root_layout_data.right_nodes
                    );
                } else {
                    root_layout_data.outer_height_left = this._layout_offset_subnodes_height(
                        root_layout_data.left_nodes
                    );
                }
            }
            this.bounds.s = Math.max(
                root_layout_data.outer_height_left,
                root_layout_data.outer_height_right
            );
            this.cache_valid = false;
        } else {
            logger.warn('can not found root node');
        }
    }
    set_visible(nodes, visible) {
        var i = nodes.length;
        var node = null;
        var layout_data = null;
        while (i--) {
            node = nodes[i];
            layout_data = node._data.layout;
            if (node.expanded) {
                this.set_visible(node.children, visible);
            } else {
                this.set_visible(node.children, false);
            }
            if (!node.isroot) {
                node._data.layout.visible = visible;
            }
        }
    }
    is_expand(node) {
        return node.expanded;
    }
    is_visible(node) {
        var layout_data = node._data.layout;
        if ('visible' in layout_data && !layout_data.visible) {
            return false;
        } else {
            return true;
        }
    }
}
