/**
 * @license BSD
 * @copyright 2014-2023 hizzgdev@163.com
 *
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */

import { Node } from './jsmind.node.js';
import { logger, Direction } from './jsmind.common.js';

export class Mind {
    constructor() {
        this.name = null;
        this.author = null;
        this.version = null;
        this.root = null;
        this.selected = null;
        this.nodes = {};
    }
    get_node(node_id) {
        if (node_id in this.nodes) {
            return this.nodes[node_id];
        } else {
            logger.warn('the node[id=' + node_id + '] can not be found');
            return null;
        }
    }
    set_root(node_id, topic, data) {
        if (this.root == null) {
            this.root = new Node(node_id, 0, topic, data, true);
            this._put_node(this.root);
            return this.root;
        } else {
            logger.error('root node is already exist');
            return null;
        }
    }
    add_node(parent_node, node_id, topic, data, direction, expanded, idx) {
        if (!Node.is_node(parent_node)) {
            logger.error('the parent_node ' + parent_node + ' is not a node.');
            return null;
        }
        var node_index = idx || -1;
        var node = new Node(
            node_id,
            node_index,
            topic,
            data,
            false,
            parent_node,
            parent_node.direction,
            expanded
        );
        if (parent_node.isroot) {
            node.direction = direction || Direction.right;
        }
        if (this._put_node(node)) {
            parent_node.children.push(node);
            this._update_index(parent_node);
        } else {
            logger.error("fail, the node id '" + node.id + "' has been already exist.");
            node = null;
        }
        return node;
    }
    insert_node_before(node_before, node_id, topic, data, direction) {
        if (!Node.is_node(node_before)) {
            logger.error('the node_before ' + node_before + ' is not a node.');
            return null;
        }
        var node_index = node_before.index - 0.5;
        return this.add_node(node_before.parent, node_id, topic, data, direction, true, node_index);
    }
    get_node_before(node) {
        if (!Node.is_node(node)) {
            var the_node = this.get_node(node);
            if (!the_node) {
                logger.error('the node[id=' + node + '] can not be found.');
                return null;
            } else {
                return this.get_node_before(the_node);
            }
        }
        if (node.isroot) {
            return null;
        }
        var idx = node.index - 2;
        if (idx >= 0) {
            return node.parent.children[idx];
        } else {
            return null;
        }
    }
    insert_node_after(node_after, node_id, topic, data, direction) {
        if (!Node.is_node(node_after)) {
            logger.error('the node_after ' + node_after + ' is not a node.');
            return null;
        }
        var node_index = node_after.index + 0.5;
        return this.add_node(node_after.parent, node_id, topic, data, direction, true, node_index);
    }
    get_node_after(node) {
        if (!Node.is_node(node)) {
            var the_node = this.get_node(node);
            if (!the_node) {
                logger.error('the node[id=' + node + '] can not be found.');
                return null;
            } else {
                return this.get_node_after(the_node);
            }
        }
        if (node.isroot) {
            return null;
        }
        var idx = node.index;
        var brothers = node.parent.children;
        if (brothers.length > idx) {
            return node.parent.children[idx];
        } else {
            return null;
        }
    }
    move_node(node, before_id, parent_id, direction) {
        if (!Node.is_node(node)) {
            logger.error('the parameter node ' + node + ' is not a node.');
            return null;
        }
        if (!parent_id) {
            parent_id = node.parent.id;
        }
        return this._move_node(node, before_id, parent_id, direction);
    }
    _flow_node_direction(node, direction) {
        if (typeof direction === 'undefined') {
            direction = node.direction;
        } else {
            node.direction = direction;
        }
        var len = node.children.length;
        while (len--) {
            this._flow_node_direction(node.children[len], direction);
        }
    }
    _move_node_internal(node, before_id) {
        if (!!node && !!before_id) {
            if (before_id == '_last_') {
                node.index = -1;
                this._update_index(node.parent);
            } else if (before_id == '_first_') {
                node.index = 0;
                this._update_index(node.parent);
            } else {
                var node_before = !!before_id ? this.get_node(before_id) : null;
                if (
                    node_before != null &&
                    node_before.parent != null &&
                    node_before.parent.id == node.parent.id
                ) {
                    node.index = node_before.index - 0.5;
                    this._update_index(node.parent);
                }
            }
        }
        return node;
    }
    _move_node(node, before_id, parent_id, direction) {
        if (!!node && !!parent_id) {
            var parent_node = this.get_node(parent_id);
            if (Node.inherited(node, parent_node)) {
                logger.error('can not move a node to its children');
                return null;
            }
            if (node.parent.id != parent_id) {
                // remove from parent's children
                var sibling = node.parent.children;
                var si = sibling.length;
                while (si--) {
                    if (sibling[si].id == node.id) {
                        sibling.splice(si, 1);
                        break;
                    }
                }
                node.parent = parent_node;
                parent_node.children.push(node);
            }

            if (node.parent.isroot) {
                if (direction == Direction.left) {
                    node.direction = direction;
                } else {
                    node.direction = Direction.right;
                }
            } else {
                node.direction = node.parent.direction;
            }
            this._move_node_internal(node, before_id);
            this._flow_node_direction(node);
        }
        return node;
    }
    remove_node(node) {
        if (!Node.is_node(node)) {
            logger.error('the parameter node ' + node + ' is not a node.');
            return false;
        }
        if (node.isroot) {
            logger.error('fail, can not remove root node');
            return false;
        }
        if (this.selected != null && this.selected.id == node.id) {
            this.selected = null;
        }
        // clean all subordinate nodes
        var children = node.children;
        var ci = children.length;
        while (ci--) {
            this.remove_node(children[ci]);
        }
        // clean all children
        children.length = 0;
        var node_parent = node.parent;
        // remove from parent's children
        var sibling = node_parent.children;
        var si = sibling.length;
        while (si--) {
            if (sibling[si].id == node.id) {
                sibling.splice(si, 1);
                break;
            }
        }
        // remove from global nodes
        delete this.nodes[node.id];
        // clean all properties
        for (var k in node) {
            delete node[k];
        }
        // remove it's self
        node = null;
        this._update_index(node_parent);
        return true;
    }
    _put_node(node) {
        if (node.id in this.nodes) {
            logger.warn("the node_id '" + node.id + "' has been already exist.");
            return false;
        } else {
            this.nodes[node.id] = node;
            return true;
        }
    }
    _update_index(node) {
        if (node instanceof Node) {
            node.children.sort(Node.compare);
            for (var i = 0; i < node.children.length; i++) {
                node.children[i].index = i + 1;
            }
        }
    }
}
