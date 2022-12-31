/**
 * @license BSD
 * @copyright 2014-2023 hizzgdev@163.com
 *
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */

import { logger } from './jsmind.common.js';
export class Node {
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

    get_location() {
        var vd = this._data.view;
        return {
            x: vd.abs_x,
            y: vd.abs_y,
        };
    }
    get_size() {
        var vd = this._data.view;
        return {
            w: vd.width,
            h: vd.height,
        };
    }

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
    static is_node(n) {
        return !!n && n instanceof Node;
    }
}
