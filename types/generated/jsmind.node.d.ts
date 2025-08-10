export class Node {
    /**
     * Compare two nodes by index for ordering.
     * @param {Node} node1
     * @param {Node} node2
     * @returns {number}
     */
    static compare(node1: Node, node2: Node): number;
    /**
     * Check if node is the same as or a descendant of parent_node.
     * @param {Node} parent_node
     * @param {Node} node
     * @returns {boolean}
     */
    static inherited(parent_node: Node, node: Node): boolean;
    /**
     * Runtime check for Node instance.
     * @param {unknown} n
     * @returns {n is Node}
     */
    static is_node(n: unknown): n is Node;
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
    constructor(sId: string, iIndex: number, sTopic: string, oData?: Record<string, any> | undefined, bIsRoot?: boolean | undefined, oParent?: (Node | null) | undefined, eDirection?: number | undefined, bExpanded?: boolean | undefined);
    id: string;
    index: number;
    topic: string;
    /** @type {Record<string, any>} */
    data: Record<string, any>;
    isroot: boolean;
    parent: Node;
    direction: number;
    expanded: boolean;
    /** @type {Node[]} */
    children: Node[];
    _data: {};
    /**
     * Get absolute location of this node in view coordinates.
     * @returns {{x:number,y:number}}
     */
    get_location(): {
        x: number;
        y: number;
    };
    /**
     * Get rendered size of this node.
     * @returns {{w:number,h:number}}
     */
    get_size(): {
        w: number;
        h: number;
    };
}
