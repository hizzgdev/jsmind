export class Mind {
    /** @type {string | null} */
    name: string | null;
    /** @type {string | null} */
    author: string | null;
    /** @type {string | null} */
    version: string | null;
    /** @type {Node | null} */
    root: Node | null;
    /** @type {Node | null} */
    selected: Node | null;
    /** @type {Record<string, Node>} */
    nodes: Record<string, Node>;
    /**
     * Get a node by id.
     * @param {string} node_id
     * @returns {Node | null}
     */
    get_node(node_id: string): Node | null;
    /**
     * Set the root node, only once.
     * @param {string} node_id
     * @param {string} topic
     * @param {Record<string,any>=} data
     * @returns {Node | null}
     */
    set_root(node_id: string, topic: string, data?: Record<string, any> | undefined): Node | null;
    /**
     * Add a child node under parent.
     * @param {Node} parent_node
     * @param {string} node_id
     * @param {string} topic
     * @param {Record<string,any>=} data
     * @param {number=} direction
     * @param {boolean=} expanded
     * @param {number=} idx
     * @returns {Node | null}
     */
    add_node(parent_node: Node, node_id: string, topic: string, data?: Record<string, any> | undefined, direction?: number | undefined, expanded?: boolean | undefined, idx?: number | undefined): Node | null;
    /**
     * Insert a node before target node.
     * @param {Node} node_before
     * @param {string} node_id
     * @param {string} topic
     * @param {Record<string,any>=} data
     * @param {number=} direction
     * @returns {Node | null}
     */
    insert_node_before(node_before: Node, node_id: string, topic: string, data?: Record<string, any> | undefined, direction?: number | undefined): Node | null;
    /**
     * Get previous sibling of a node or node id.
     * @param {string | Node} node
     * @returns {Node | null}
     */
    get_node_before(node: string | Node): Node | null;
    /**
     * Insert a node after target node.
     * @param {Node} node_after
     * @param {string} node_id
     * @param {string} topic
     * @param {Record<string,any>=} data
     * @param {number=} direction
     * @returns {Node | null}
     */
    insert_node_after(node_after: Node, node_id: string, topic: string, data?: Record<string, any> | undefined, direction?: number | undefined): Node | null;
    /**
     * Get next sibling of a node or node id.
     * @param {string | Node} node
     * @returns {Node | null}
     */
    get_node_after(node: string | Node): Node | null;
    /**
     * Move a node to new parent/position.
     * @param {Node} node
     * @param {string=} before_id
     * @param {string=} parent_id
     * @param {number=} direction
     * @returns {Node | null}
     */
    move_node(node: Node, before_id?: string | undefined, parent_id?: string | undefined, direction?: number | undefined): Node | null;
    /**
     * Propagate direction to descendants.
     * @param {Node} node
     * @param {number=} direction
     */
    _flow_node_direction(node: Node, direction?: number | undefined): void;
    /**
     * Re-index node among siblings based on before_id marker.
     * @param {Node} node
     * @param {string} before_id
     * @returns {Node}
     */
    _move_node_internal(node: Node, before_id: string): Node;
    /**
     * Internal move implementation.
     * @param {Node} node
     * @param {string} before_id
     * @param {string} parent_id
     * @param {number=} direction
     * @returns {Node | null}
     */
    _move_node(node: Node, before_id: string, parent_id: string, direction?: number | undefined): Node | null;
    /**
     * Remove a node from the mind.
     * @param {Node} node
     * @returns {boolean}
     */
    remove_node(node: Node): boolean;
    /**
     * Put node into the map if id is not taken.
     * @param {Node} node
     * @returns {boolean}
     */
    _put_node(node: Node): boolean;
    /**
     * Re-index children by Node.compare.
     * @param {Node} node
     */
    _update_index(node: Node): void;
}
import { Node } from './jsmind.node.js';
