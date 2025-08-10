export class Mind {
    name: any;
    author: any;
    version: any;
    root: Node;
    selected: any;
    nodes: {};
    get_node(node_id: any): any;
    set_root(node_id: any, topic: any, data: any): Node;
    add_node(parent_node: any, node_id: any, topic: any, data: any, direction: any, expanded: any, idx: any): Node;
    insert_node_before(node_before: any, node_id: any, topic: any, data: any, direction: any): Node;
    get_node_before(node: any): any;
    insert_node_after(node_after: any, node_id: any, topic: any, data: any, direction: any): Node;
    get_node_after(node: any): any;
    move_node(node: any, before_id: any, parent_id: any, direction: any): any;
    _flow_node_direction(node: any, direction: any): void;
    _move_node_internal(node: any, before_id: any): any;
    _move_node(node: any, before_id: any, parent_id: any, direction: any): any;
    remove_node(node: any): boolean;
    _put_node(node: any): boolean;
    _update_index(node: any): void;
}
import { Node } from './jsmind.node.js';
