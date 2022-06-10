/**
 * @license BSD
 * @copyright 2014-2022 hizzgdev@163.com
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
    get_node(nodeid) {
        if (nodeid in this.nodes) {
            return this.nodes[nodeid];
        } else {
            logger.warn('the node[id=' + nodeid + '] can not be found');
            return null;
        }
    }
    set_root(nodeid, topic, data) {
        if (this.root == null) {
            this.root = new Node(nodeid, 0, topic, data, true);
            this._put_node(this.root);
            return this.root;
        } else {
            logger.error('root node is already exist');
            return null;
        }
    }
    add_node(parent_node, nodeid, topic, data, direction, expanded, idx) {
        if (!Node.is_node(parent_node)) {
            logger.error('the parent_node ' + parent_node + ' is not a node.');
            return null;
        }
        var node_index = idx || -1;
        var node = new Node(
            nodeid,
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
            this._reindex(parent_node);
        } else {
            logger.error("fail, the nodeid '" + node.id + "' has been already exist.");
            node = null;
        }
        return node;
    }
    insert_node_before(node_before, nodeid, topic, data, direction) {
        if (!Node.is_node(node_before)) {
            logger.error('the node_before ' + node_before + ' is not a node.');
            return null;
        }
        var node_index = node_before.index - 0.5;
        return this.add_node(node_before.parent, nodeid, topic, data, direction, true, node_index);
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
    insert_node_after(node_after, nodeid, topic, data, direction) {
        if (!Node.is_node(node_after)) {
            logger.error('the node_after ' + node_after + ' is not a node.');
            return null;
        }
        var node_index = node_after.index + 0.5;
        return this.add_node(node_after.parent, nodeid, topic, data, direction, true, node_index);
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
    _move_node_internal(node, beforeid) {
        if (!!node && !!beforeid) {
            if (beforeid == '_last_') {
                node.index = -1;
                this._reindex(node.parent);
            } else if (beforeid == '_first_') {
                node.index = 0;
                this._reindex(node.parent);
            } else {
                var node_before = !!beforeid ? this.get_node(beforeid) : null;
                if (
                    node_before != null &&
                    node_before.parent != null &&
                    node_before.parent.id == node.parent.id
                ) {
                    node.index = node_before.index - 0.5;
                    this._reindex(node.parent);
                }
            }
        }
        return node;
    }
    _move_node(node, beforeid, parentid, direction) {
        if (!!node && !!parentid) {
            var parent_node = this.get_node(parentid);
            if (Node.inherited(node, parent_node)) {
                logger.error('can not move a node to its children');
                return null;
            }
            if (node.parent.id != parentid) {
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
            this._move_node_internal(node, beforeid);
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
        // remove from parent's children
        var sibling = node.parent.children;
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
        //delete node;
        return true;
    }
    _put_node(node) {
        if (node.id in this.nodes) {
            logger.warn("the nodeid '" + node.id + "' has been already exist.");
            return false;
        } else {
            this.nodes[node.id] = node;
            return true;
        }
    }
    _reindex(node) {
        if (node instanceof Node) {
            node.children.sort(Node.compare);
            for (var i = 0; i < node.children.length; i++) {
                node.children[i].index = i + 1;
            }
        }
    }
}
