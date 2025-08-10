export class LayoutProvider {
    constructor(jm: any, options: any);
    opts: any;
    jm: any;
    isside: boolean;
    bounds: {
        n: number;
        s: number;
        w: number;
        e: number;
    };
    cache_valid: boolean;
    init(): void;
    reset(): void;
    calculate_next_child_direction(node: any): number;
    layout(): void;
    layout_direction(): void;
    _layout_direction_root(): void;
    _layout_direction_side(node: any, direction: any, side_index: any): void;
    layout_offset(): void;
    _layout_offset_subnodes(nodes: any): number;
    _layout_offset_subnodes_height(nodes: any): number;
    _should_reserve_cousin_space(node: any): boolean;
    get_node_offset(node: any): any;
    get_node_point(node: any): {
        x: any;
        y: number;
    };
    get_node_point_in(node: any): any;
    get_node_point_out(node: any): any;
    get_expander_point(node: any): {
        x: any;
        y: number;
    };
    get_min_size(): {
        w: number;
        h: number;
    };
    toggle_node(node: any): void;
    expand_node(node: any): void;
    collapse_node(node: any): void;
    expand_all(): void;
    collapse_all(): void;
    expand_to_depth(target_depth: any, curr_nodes: any, curr_depth: any): void;
    part_layout(node: any): void;
    set_visible(nodes: any, visible: any): void;
    is_expand(node: any): any;
    is_visible(node: any): boolean;
}
