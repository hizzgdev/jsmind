/**
 * @license BSD
 * @copyright 2014-2025 hizzgdev@163.com
 *
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */

import { logger } from './jsmind.common.js';
export class Node {
    /**
     * Create a Node instance.
     * @param {string} sId - Node id
     * @param {number} iIndex - Node index (order among siblings). Use -1 for tail
     * @param {string} sTopic - Node topic text
     * @param {Record<string, any>=} oData - Arbitrary node data
     * @param {boolean=} bIsRoot - Whether it is the root node
     * @param {Node | null=} oParent - Parent node
     * @param {number=} eDirection - Direction for children under root (-1 left, 0 center, 1 right)
     * @param {boolean=} bExpanded - Expanded state
     */
    constructor(sId, iIndex, sTopic, oData, bIsRoot, oParent, eDirection, bExpanded) {
        if (!sId) {
            logger.error('invalid node id');
            return;
        }
        if (typeof iIndex != 'number') {
            logger.error('invalid node index');
            return;
        }
        if (typeof bExpanded === 'undefined') {
            bExpanded = true;
        }
        this.id = sId;
        this.index = iIndex;
        this.topic = sTopic;
        this.data = oData || {};
        this.isroot = bIsRoot;
        this.parent = oParent;
        this.direction = eDirection;
        this.expanded = !!bExpanded;
        this.children = [];
        this._data = {};
    }

    /**
     * Get absolute location of this node in view coordinates.
     * @returns {{x:number,y:number}}
     */
    get_location() {
        var vd = this._data.view;
        return {
            x: vd.abs_x,
            y: vd.abs_y,
        };
    }
    /**
     * Get rendered size of this node.
     * @returns {{w:number,h:number}}
     */
    get_size() {
        var vd = this._data.view;
        return {
            w: vd.width,
            h: vd.height,
        };
    }

    /**
     * Compare two nodes by index for ordering.
     * @param {Node} node1
     * @param {Node} node2
     * @returns {number}
     */
    static compare(node1, node2) {
        // '-1' is always the latest
        var r = 0;
        var i1 = node1.index;
        var i2 = node2.index;
        if (i1 >= 0 && i2 >= 0) {
            r = i1 - i2;
        } else if (i1 == -1 && i2 == -1) {
            r = 0;
        } else if (i1 == -1) {
            r = 1;
        } else if (i2 == -1) {
            r = -1;
        } else {
            r = 0;
        }
        return r;
    }
    /**
     * Check if node is the same as or a descendant of parent_node.
     * @param {Node} parent_node
     * @param {Node} node
     * @returns {boolean}
     */
    static inherited(parent_node, node) {
        if (!!parent_node && !!node) {
            if (parent_node.id === node.id) {
                return true;
            }
            if (parent_node.isroot) {
                return true;
            }
            var pid = parent_node.id;
            var p = node;
            while (!p.isroot) {
                p = p.parent;
                if (p.id === pid) {
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * Runtime check for Node instance.
     * @param {any} n
     * @returns {n is Node}
     */
    static is_node(n) {
        return !!n && n instanceof Node;
    }
}
