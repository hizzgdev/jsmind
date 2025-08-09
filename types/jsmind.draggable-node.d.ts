/**
 * TypeScript definitions for jsMind draggable-node plugin
 * @version 0.4.0
 */

import jsMind, { Node } from './jsmind';

export interface DraggableNodeOptions {
    line_width?: number;
    line_color?: string;
    line_color_invalid?: string;
    lookup_delay?: number;
    lookup_interval?: number;
    scrolling_trigger_width?: number;
    scrolling_step_length?: number;
    shadow_node_class_name?: string;
}

export class DraggableNode {
    version: string;
    jm: jsMind;
    options: Required<DraggableNodeOptions>;
    e_canvas: HTMLCanvasElement | null;
    canvas_ctx: CanvasRenderingContext2D | null;
    shadow: HTMLElement | null;
    shadow_p_x: number;
    shadow_p_y: number;
    shadow_w: number;
    shadow_h: number;
    active_node: Node | null;
    target_node: Node | null;
    target_direct: number | null;
    client_w: number;
    client_h: number;
    offset_x: number;
    offset_y: number;
    hlookup_delay: number;
    hlookup_timer: number;
    capture: boolean;
    moved: boolean;
    canvas_draggable: boolean;
    view_panel: HTMLElement;
    view_panel_rect: DOMRect | null;

    constructor(jm: jsMind, options?: DraggableNodeOptions);
    init(): void;
    resize(): void;
    create_canvas(): void;
    create_shadow(): void;
    reset_shadow(element: HTMLElement): void;
    show_shadow(): void;
    hide_shadow(): void;
    magnet_shadow(
        shadow_p: { x: number; y: number },
        node_p: { x: number; y: number },
        invalid: boolean
    ): void;
    clear_lines(): void;
    canvas_lineto(x1: number, y1: number, x2: number, y2: number): void;
    event_bind(): void;
    dragstart(e: MouseEvent | TouchEvent): void;
    drag(e: MouseEvent | TouchEvent): void;
    dragend(e: MouseEvent | TouchEvent): void;
    find_node_element(element: HTMLElement): HTMLElement | null;
    get_root_x(): number;
    lookup_target_node(): void;
    lookup_overlapping_node_parent(direction: number): Node | null;
    lookup_node_parent_by_location(x: number, y: number): Node | null;
    lookup_close_node(direction: number): Node;
    shadow_on_target_side(node: Node, direction: number): boolean;
    shadow_to_left_of_node(node: Node): number;
    shadow_to_right_of_node(node: Node): number;
    shadow_to_base_line_of_node(node: Node): number;
    shadow_to_node(node: Node, dir: number): number;
    calc_point_of_node(
        node: Node,
        dir: number
    ): {
        sp: { x: number; y: number };
        np: { x: number; y: number };
    };
    move_node(src_node: Node, target_node: Node | null, target_direct: number | null): void;
    jm_event_handle(type: number, data: any): void;
}

declare module './jsmind' {
    interface PluginOptions {
        draggable_node?: DraggableNodeOptions;
    }
}

export const draggable_plugin: any;
export default DraggableNode;
