/**
 * @license BSD
 * @copyright 2014-2023 hizzgdev@163.com
 *
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */

import { $ } from './jsmind.dom.js';
import { util } from './jsmind.util.js';
import { Direction } from './jsmind.common.js';

export class ShortcutProvider {
    constructor(jm, options) {
        this.jm = jm;
        this.opts = options;
        this.mapping = options.mapping;
        this.handles = options.handles;
        this._newid = null;
        this._mapping = {};
    }
    init() {
        $.on(this.jm.view.e_panel, 'keydown', this.handler.bind(this));

        this.handles['addchild'] = this.handle_addchild;
        this.handles['addbrother'] = this.handle_addbrother;
        this.handles['editnode'] = this.handle_editnode;
        this.handles['delnode'] = this.handle_delnode;
        this.handles['toggle'] = this.handle_toggle;
        this.handles['up'] = this.handle_up;
        this.handles['down'] = this.handle_down;
        this.handles['left'] = this.handle_left;
        this.handles['right'] = this.handle_right;

        for (var handle in this.mapping) {
            if (!!this.mapping[handle] && handle in this.handles) {
                let keys = this.mapping[handle];
                if (!Array.isArray(keys)) {
                    keys = [keys];
                }
                for (let key of keys) {
                    this._mapping[key] = this.handles[handle];
                }
            }
        }

        if (typeof this.opts.id_generator === 'function') {
            this._newid = this.opts.id_generator;
        } else {
            this._newid = util.uuid.newid;
        }
    }
    enable_shortcut() {
        this.opts.enable = true;
    }
    disable_shortcut() {
        this.opts.enable = false;
    }
    handler(e) {
        if (e.which == 9) {
            e.preventDefault();
        } //prevent tab to change focus in browser
        if (this.jm.view.is_editing()) {
            return;
        }
        var evt = e || event;
        if (!this.opts.enable) {
            return true;
        }
        var kc =
            evt.keyCode +
            (evt.metaKey << 13) +
            (evt.ctrlKey << 12) +
            (evt.altKey << 11) +
            (evt.shiftKey << 10);
        if (kc in this._mapping) {
            this._mapping[kc].call(this, this.jm, e);
        }
    }
    handle_addchild(_jm, e) {
        var selected_node = _jm.get_selected_node();
        if (!!selected_node) {
            var node_id = this._newid();
            var node = _jm.add_node(selected_node, node_id, 'New Node');
            if (!!node) {
                _jm.select_node(node_id);
                _jm.begin_edit(node_id);
            }
        }
    }
    handle_addbrother(_jm, e) {
        var selected_node = _jm.get_selected_node();
        if (!!selected_node && !selected_node.isroot) {
            var node_id = this._newid();
            var node = _jm.insert_node_after(selected_node, node_id, 'New Node');
            if (!!node) {
                _jm.select_node(node_id);
                _jm.begin_edit(node_id);
            }
        }
    }
    handle_editnode(_jm, e) {
        var selected_node = _jm.get_selected_node();
        if (!!selected_node) {
            _jm.begin_edit(selected_node);
        }
    }
    handle_delnode(_jm, e) {
        var selected_node = _jm.get_selected_node();
        if (!!selected_node && !selected_node.isroot) {
            _jm.select_node(selected_node.parent);
            _jm.remove_node(selected_node);
        }
    }
    handle_toggle(_jm, e) {
        var evt = e || event;
        var selected_node = _jm.get_selected_node();
        if (!!selected_node) {
            _jm.toggle_node(selected_node.id);
            evt.stopPropagation();
            evt.preventDefault();
        }
    }
    handle_up(_jm, e) {
        var evt = e || event;
        var selected_node = _jm.get_selected_node();
        if (!!selected_node) {
            var up_node = _jm.find_node_before(selected_node);
            if (!up_node) {
                var np = _jm.find_node_before(selected_node.parent);
                if (!!np && np.children.length > 0) {
                    up_node = np.children[np.children.length - 1];
                }
            }
            if (!!up_node) {
                _jm.select_node(up_node);
            }
            evt.stopPropagation();
            evt.preventDefault();
        }
    }
    handle_down(_jm, e) {
        var evt = e || event;
        var selected_node = _jm.get_selected_node();
        if (!!selected_node) {
            var down_node = _jm.find_node_after(selected_node);
            if (!down_node) {
                var np = _jm.find_node_after(selected_node.parent);
                if (!!np && np.children.length > 0) {
                    down_node = np.children[0];
                }
            }
            if (!!down_node) {
                _jm.select_node(down_node);
            }
            evt.stopPropagation();
            evt.preventDefault();
        }
    }
    handle_left(_jm, e) {
        this._handle_direction(_jm, e, Direction.left);
    }
    handle_right(_jm, e) {
        this._handle_direction(_jm, e, Direction.right);
    }
    _handle_direction(_jm, e, d) {
        var evt = e || event;
        var selected_node = _jm.get_selected_node();
        var node = null;
        if (!!selected_node) {
            if (selected_node.isroot) {
                var c = selected_node.children;
                var children = [];
                for (var i = 0; i < c.length; i++) {
                    if (c[i].direction === d) {
                        children.push(i);
                    }
                }
                node = c[children[Math.floor((children.length - 1) / 2)]];
            } else if (selected_node.direction === d) {
                var children = selected_node.children;
                var children_count = children.length;
                if (children_count > 0) {
                    node = children[Math.floor((children_count - 1) / 2)];
                }
            } else {
                node = selected_node.parent;
            }
            if (!!node) {
                _jm.select_node(node);
            }
            evt.stopPropagation();
            evt.preventDefault();
        }
    }
}
