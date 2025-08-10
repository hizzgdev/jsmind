/**
 * TypeScript definitions for jsMind
 * @version 0.8.7
 * @author jsMind Community
 * @license BSD-3-Clause
 */

// ============================================================================
// Basic enums and constants
// ============================================================================

export interface DirectionType {
    left: -1;
    center: 0;
    right: 1;
    of(dir: string | number): number | undefined;
}

export interface EventTypeEnum {
    show: 1;
    resize: 2;
    edit: 3;
    select: 4;
}

export interface LogLevelEnum {
    debug: 1;
    info: 2;
    warn: 3;
    error: 4;
    disable: 9;
}

export interface KeyEnum {
    meta: 8192;
    ctrl: 4096;
    alt: 2048;
    shift: 1024;
}

// ============================================================================
// Data format interfaces
// ============================================================================

export interface NodeData {
    // Arbitrary custom data attached to a node
    [key: string]: any;
}

export interface MindMapMeta {
    name?: string;
    author?: string;
    version?: string;
}

export interface NodeTreeFormat {
    meta?: MindMapMeta;
    format: 'node_tree';
    data: NodeTreeData;
}

export interface NodeTreeData {
    id: string;
    topic: string;
    data?: NodeData;
    direction?: number;
    expanded?: boolean;
    children?: NodeTreeData[];
}

export interface NodeArrayFormat {
    meta?: MindMapMeta;
    format: 'node_array';
    data: NodeArrayData[];
}

export interface NodeArrayData {
    id: string;
    topic: string;
    parentid?: string;
    data?: NodeData;
    direction?: number;
    expanded?: boolean;
    isroot?: boolean;
}

export type MindMapData = NodeTreeFormat | NodeArrayFormat | string;

// ============================================================================
// Options interfaces
// ============================================================================

export interface ZoomOptions {
    min?: number;
    max?: number;
    step?: number;
    mask_key?: number;
}

export interface ViewOptions {
    engine?: 'canvas' | 'svg';
    enable_device_pixel_ratio?: boolean;
    hmargin?: number;
    vmargin?: number;
    line_width?: number;
    line_color?: string;
    line_style?: 'curved' | 'straight';
    draggable?: boolean;
    hide_scrollbars_when_draggable?: boolean;
    node_overflow?: 'hidden' | 'wrap';
    zoom?: ZoomOptions;
    custom_node_render?: ((jm: jsMind, element: HTMLElement, node: Node) => void) | null;
    expander_style?: 'char' | 'number';
}

export interface LayoutOptions {
    hspace?: number;
    vspace?: number;
    pspace?: number;
    cousin_space?: number;
}

export interface DefaultEventHandleOptions {
    enable_mousedown_handle?: boolean;
    enable_click_handle?: boolean;
    enable_dblclick_handle?: boolean;
    enable_mousewheel_handle?: boolean;
}

export interface ShortcutMapping {
    addchild?: number | number[];
    addbrother?: number | number[];
    editnode?: number | number[];
    delnode?: number | number[];
    toggle?: number | number[];
    left?: number | number[];
    up?: number | number[];
    right?: number | number[];
    down?: number | number[];
    [key: string]: number | number[] | undefined;
}

export interface ShortcutOptions {
    enable?: boolean;
    handles?: { [key: string]: () => void };
    mapping?: ShortcutMapping;
}

export interface PluginOptions {
    [pluginName: string]: any;
}

export interface JsMindOptions {
    container: string;
    editable?: boolean;
    theme?: string | null;
    mode?: 'full' | 'side';
    support_html?: boolean;
    log_level?: 'debug' | 'info' | 'warn' | 'error' | 'disable';
    view?: ViewOptions;
    layout?: LayoutOptions;
    default_event_handle?: DefaultEventHandleOptions;
    shortcut?: ShortcutOptions;
    plugin?: PluginOptions;
}

// ============================================================================
// Core class interfaces
// ============================================================================

export interface NodeLocation {
    x: number;
    y: number;
}

export interface NodeSize {
    w: number;
    h: number;
}

export class Node {
    id: string;
    index: number;
    topic: string;
    data: NodeData;
    isroot: boolean;
    parent: Node | null;
    direction: number;
    expanded: boolean;
    children: Node[];
    _data: any;

    constructor(
        sId: string,
        iIndex: number,
        sTopic: string,
        oData?: NodeData,
        bIsRoot?: boolean,
        oParent?: Node | null,
        eDirection?: number,
        bExpanded?: boolean
    );

    get_location(): NodeLocation;
    get_size(): NodeSize;

    static compare(node1: Node, node2: Node): number;
    static inherited(parent_node: Node, node: Node): boolean;
    static is_node(n: any): n is Node;
}

export class Mind {
    name: string | null;
    author: string | null;
    version: string | null;
    root: Node | null;
    selected: Node | null;
    nodes: { [id: string]: Node };

    constructor();

    get_node(node_id: string): Node | null;
    set_root(node_id: string, topic: string, data?: NodeData): Node | null;
    add_node(
        parent_node: Node,
        node_id: string,
        topic: string,
        data?: NodeData,
        direction?: number,
        expanded?: boolean,
        idx?: number
    ): Node | null;
    insert_node_before(
        node_before: Node,
        node_id: string,
        topic: string,
        data?: NodeData
    ): Node | null;
    insert_node_after(
        node_after: Node,
        node_id: string,
        topic: string,
        data?: NodeData
    ): Node | null;
    remove_node(node: Node): boolean;
    move_node(node: Node, before_id?: string, parent_id?: string, direction?: number): Node | null;
}

// ============================================================================
// Utility interfaces
// ============================================================================

export interface FileUtil {
    read(file_data: File, fn_callback: (result: string, name: string) => void): void;
    save(file_data: string, type: string, name: string): void;
}

export interface JsonUtil {
    json2string(json: any): string;
    string2json(json_str: string): any;
    merge(target: any, source: any): any;
}

export interface UuidUtil {
    newid(): string;
}

export interface TextUtil {
    is_empty(s?: string | null): boolean;
}

export interface Util {
    file: FileUtil;
    json: JsonUtil;
    uuid: UuidUtil;
    text: TextUtil;
}

export interface Dom {
    w: Window;
    d: Document;
    g(id: string): HTMLElement | null;
    c(tag: string): HTMLElement;
    t(n: HTMLElement, t: string): void;
    h(n: HTMLElement, t: string | HTMLElement): void;
    i(el: any): el is HTMLElement;
    on(t: HTMLElement, e: string, h: EventListener): void;
}

// ============================================================================
// Event handling interfaces
// ============================================================================

export interface EventData {
    evt?: string;
    data?: any[];
    node?: string;
}

export type EventHandler = (type: number, data: EventData) => void;

// ============================================================================
// Main class
// ============================================================================

export default class jsMind {
    static mind: typeof Mind;
    static node: typeof Node;
    static direction: DirectionType;
    static event_type: EventTypeEnum;
    static $: Dom;
    static plugin: any;
    static register_plugin(plugin_name: string, plugin_init: (jm: jsMind) => void): void;
    static util: Util;
    static current: jsMind;

    version: string;
    options: JsMindOptions;
    initialized: boolean;
    mind: Mind | null;
    event_handles: EventHandler[];
    data: any;
    layout: any;
    view: any;
    shortcut: any;

    constructor(options: JsMindOptions);

    init(): void;
    show(mind?: MindMapData, skip_centering?: boolean): void;
    get_editable(): boolean;
    enable_edit(): void;
    disable_edit(): void;
    get_view_draggable(): boolean;
    enable_view_draggable(): void;
    disable_view_draggable(): void;
    get_meta(): MindMapMeta;
    get_data(data_format?: 'node_tree' | 'node_array' | 'freemind' | 'text'): any;
    get_root(): Node | null;
    get_node(node: string | Node): Node | null;
    add_node(
        parent_node: Node | string,
        node_id: string,
        topic: string,
        data?: NodeData,
        direction?: number
    ): Node | null;
    insert_node_before(
        node_before: Node | string,
        node_id: string,
        topic: string,
        data?: NodeData
    ): Node | null;
    insert_node_after(
        node_after: Node | string,
        node_id: string,
        topic: string,
        data?: NodeData
    ): Node | null;
    remove_node(node: Node | string): boolean;
    update_node(node_id: string, topic: string): void;
    move_node(
        node: Node | string,
        before_id?: string,
        parent_id?: string,
        direction?: number
    ): void;
    select_node(node: Node | string): void;
    select_clear(): void;
    get_selected_node(): Node | null;
    is_node_visible(node: Node | string): boolean;
    find_node_before(node: Node | string): Node | null;
    find_node_after(node: Node | string): Node | null;
    set_node_color(node_id: string, bg_color?: string, fg_color?: string): void;
    set_node_font_style(node_id: string, size?: number, weight?: string, style?: string): void;
    set_node_background_image(
        node_id: string,
        image: string,
        width?: number,
        height?: number,
        rotation?: number
    ): void;
    set_node_background_rotation(node_id: string, rotation: number): void;
    resize(): void;
    begin_edit(node?: Node | string): void;
    end_edit(): void;
    toggle_node(node?: Node | string): void;
    expand_node(node: Node | string): void;
    collapse_node(node: Node | string): void;
    expand_all(): void;
    collapse_all(): void;
    expand_to_depth(depth: number): void;
    scroll_node_to_center(node: Node | string): void;
    scroll_node_to_visible(node: Node | string): void;
    add_event_listener(event_listener: EventHandler): void;
    invoke_event_handle(type: number, data: EventData): void;
}

// ============================================================================
// Module exports
// ============================================================================

export { jsMind };
export const direction: DirectionType;
export const event_type: EventTypeEnum;
export const $: Dom;
export const util: Util;
