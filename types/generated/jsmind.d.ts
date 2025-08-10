export default class jsMind {
    static mind: typeof Mind;
    static node: typeof Node;
    static direction: {
        left: number;
        center: number;
        right: number;
        of: (dir: any) => any;
    };
    static event_type: {
        show: number;
        resize: number;
        edit: number;
        select: number;
    };
    static $: {
        w: any;
        d: any;
        g: (id: any) => any;
        c: (tag: any) => any;
        t: (n: any, t: any) => void;
        h: (n: any, t: any) => void;
        i: (el: any) => boolean;
        on: (t: any, e: any, h: any) => void;
    };
    static plugin: typeof Plugin;
    static register_plugin: typeof _register_plugin;
    static util: {
        file: {
            read: (file_data: any, fn_callback: any) => void;
            save: (file_data: any, type: any, name: any) => void;
        };
        json: {
            json2string: (json: any) => string;
            string2json: (json_str: any) => any;
            merge: (b: any, a: any) => any;
        };
        uuid: {
            newid: () => string;
        };
        text: {
            is_empty: (s: any) => boolean;
        };
    };
    static show(options: any, mind: any): jsMind;
    constructor(options: any);
    options: {};
    version: string;
    initialized: boolean;
    mind: Mind;
    event_handles: any[];
    init(): void;
    data: DataProvider;
    layout: LayoutProvider;
    view: ViewProvider;
    shortcut: ShortcutProvider;
    get_editable(): any;
    enable_edit(): void;
    disable_edit(): void;
    get_view_draggable(): any;
    enable_view_draggable(): void;
    disable_view_draggable(): void;
    enable_event_handle(event_handle: any): void;
    disable_event_handle(event_handle: any): void;
    set_theme(theme: any): void;
    _event_bind(): void;
    mousedown_handle(e: any): void;
    click_handle(e: any): void;
    dblclick_handle(e: any): void;
    mousewheel_handle(e: any): void;
    begin_edit(node: any): any;
    end_edit(): void;
    toggle_node(node: any): any;
    expand_node(node: any): any;
    collapse_node(node: any): any;
    expand_all(): void;
    collapse_all(): void;
    expand_to_depth(depth: any): void;
    _reset(): void;
    _show(mind: any, skip_centering: any): void;
    show(mind: any, skip_centering: any): void;
    get_meta(): {
        name: any;
        author: any;
        version: any;
    };
    get_data(data_format: any): {
        meta: {
            name: any;
            author: any;
            version: any;
        };
        format: string;
        data: {
            id: any;
            topic: any;
            expanded: boolean;
        };
    } | {
        meta: {
            name: any;
            author: any;
            version: any;
        };
        format: string;
        data: any[];
    } | {
        meta: {
            name: any;
            author: any;
            version: any;
        };
        format: string;
        data: string;
    };
    get_root(): Node;
    get_node(node: any): any;
    add_node(parent_node: any, node_id: any, topic: any, data: any, direction: any): Node;
    insert_node_before(node_before: any, node_id: any, topic: any, data: any, direction: any): Node;
    insert_node_after(node_after: any, node_id: any, topic: any, data: any, direction: any): Node;
    remove_node(node: any): any;
    update_node(node_id: any, topic: any): void;
    move_node(node_id: any, before_id: any, parent_id: any, direction: any): void;
    select_node(node: any): any;
    get_selected_node(): any;
    select_clear(): void;
    is_node_visible(node: any): boolean;
    scroll_node_to_center(node: any): void;
    find_node_before(node: any): any;
    find_node_after(node: any): any;
    set_node_color(node_id: any, bg_color: any, fg_color: any): any;
    set_node_font_style(node_id: any, size: any, weight: any, style: any): any;
    set_node_background_image(node_id: any, image: any, width: any, height: any, rotation: any): any;
    set_node_background_rotation(node_id: any, rotation: any): any;
    resize(): void;
    add_event_listener(callback: any): void;
    clear_event_listener(): void;
    invoke_event_handle(type: any, data: any): void;
    _invoke_event_handle(type: any, data: any): void;
}
import { Mind } from './jsmind.mind.js';
import { DataProvider } from './jsmind.data_provider.js';
import { LayoutProvider } from './jsmind.layout_provider.js';
import { ViewProvider } from './jsmind.view_provider.js';
import { ShortcutProvider } from './jsmind.shortcut_provider.js';
import { Node } from './jsmind.node.js';
import { Plugin } from './jsmind.plugin.js';
import { register as _register_plugin } from './jsmind.plugin.js';
