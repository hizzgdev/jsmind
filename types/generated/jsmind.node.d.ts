export class Node {
    static compare(node1: any, node2: any): number;
    static inherited(parent_node: any, node: any): boolean;
    static is_node(n: any): boolean;
    constructor(sId: any, iIndex: any, sTopic: any, oData: any, bIsRoot: any, oParent: any, eDirection: any, bExpanded: any);
    id: any;
    index: number;
    topic: any;
    data: any;
    isroot: any;
    parent: any;
    direction: any;
    expanded: boolean;
    children: any[];
    _data: {};
    get_location(): {
        x: any;
        y: any;
    };
    get_size(): {
        w: any;
        h: any;
    };
}
