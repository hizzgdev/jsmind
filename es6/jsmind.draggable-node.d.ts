/**
 * TypeScript definitions for jsMind draggable-node plugin
 * @version 0.4.0
 * @author jsMind Community
 * @license BSD-3-Clause
 */

import jsMind, { Node } from './jsmind';

// ============================================================================
// 插件配置选项接口
// ============================================================================

export interface DraggableNodeOptions {
    /** 拖拽线条宽度 */
    line_width?: number;
    /** 拖拽线条颜色 */
    line_color?: string;
    /** 无效拖拽线条颜色 */
    line_color_invalid?: string;
    /** 查找延迟时间（毫秒） */
    lookup_delay?: number;
    /** 查找间隔时间（毫秒） */
    lookup_interval?: number;
    /** 滚动触发宽度 */
    scrolling_trigger_width?: number;
    /** 滚动步长 */
    scrolling_step_length?: number;
    /** 阴影节点CSS类名 */
    shadow_node_class_name?: string;
}

// ============================================================================
// 插件类定义
// ============================================================================

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

    /** 初始化插件 */
    init(): void;

    /** 调整大小 */
    resize(): void;

    /** 创建画布 */
    create_canvas(): void;

    /** 创建阴影节点 */
    create_shadow(): void;

    /** 重置阴影节点 */
    reset_shadow(element: HTMLElement): void;

    /** 显示阴影节点 */
    show_shadow(): void;

    /** 隐藏阴影节点 */
    hide_shadow(): void;

    /** 磁性吸附阴影 */
    magnet_shadow(shadow_p: { x: number; y: number }, node_p: { x: number; y: number }, invalid: boolean): void;

    /** 清除线条 */
    clear_lines(): void;

    /** 画布画线 */
    canvas_lineto(x1: number, y1: number, x2: number, y2: number): void;

    /** 绑定事件 */
    event_bind(): void;

    /** 开始拖拽 */
    dragstart(e: MouseEvent | TouchEvent): void;

    /** 拖拽中 */
    drag(e: MouseEvent | TouchEvent): void;

    /** 结束拖拽 */
    dragend(e: MouseEvent | TouchEvent): void;

    /** 查找节点元素 */
    find_node_element(element: HTMLElement): HTMLElement | null;

    /** 获取根节点X坐标 */
    get_root_x(): number;

    /** 查找目标节点 */
    lookup_target_node(): void;

    /** 根据位置查找重叠的节点父级 */
    lookup_overlapping_node_parent(direction: number): Node | null;

    /** 根据位置查找节点父级 */
    lookup_node_parent_by_location(x: number, y: number): Node | null;

    /** 查找最近的节点 */
    lookup_close_node(direction: number): Node;

    /** 检查阴影是否在目标侧 */
    shadow_on_target_side(node: Node, direction: number): boolean;

    /** 阴影到节点左侧的距离 */
    shadow_to_left_of_node(node: Node): number;

    /** 阴影到节点右侧的距离 */
    shadow_to_right_of_node(node: Node): number;

    /** 阴影到节点基线的距离 */
    shadow_to_base_line_of_node(node: Node): number;

    /** 阴影到节点的距离 */
    shadow_to_node(node: Node, dir: number): number;

    /** 计算节点的点位置 */
    calc_point_of_node(node: Node, dir: number): {
        sp: { x: number; y: number };
        np: { x: number; y: number };
    };

    /** 移动节点 */
    move_node(src_node: Node, target_node: Node | null, target_direct: number | null): void;

    /** jsMind事件处理 */
    jm_event_handle(type: number, data: any): void;
}

// ============================================================================
// 模块声明扩展
// ============================================================================

declare module './jsmind' {
    interface PluginOptions {
        draggable_node?: DraggableNodeOptions;
    }
}

// ============================================================================
// 插件注册
// ============================================================================

/** 拖拽节点插件实例 */
export const draggable_plugin: any;

// 自动注册插件到jsMind
export default DraggableNode;
