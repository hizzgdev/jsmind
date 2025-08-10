/**
 * Merge user options with defaults. Throws if container missing.
 * @param {Partial<JsMindRuntimeOptions>} options
 * @returns {JsMindRuntimeOptions}
 */
export function merge_option(options: Partial<JsMindRuntimeOptions>): JsMindRuntimeOptions;
export type JsMindRuntimeOptions = {
    container: string | HTMLElement;
    editable: boolean;
    theme: (string | null);
    mode: ("full" | "side");
    support_html: boolean;
    log_level: "debug" | "info" | "warn" | "error" | "disable";
    view: {
        engine: "canvas" | "svg";
        enable_device_pixel_ratio: boolean;
        hmargin: number;
        vmargin: number;
        line_width: number;
        line_color: string;
        line_style: "curved" | "straight";
        custom_line_render?: Function;
        draggable: boolean;
        hide_scrollbars_when_draggable: boolean;
        node_overflow: "hidden" | "wrap";
        zoom: {
            min: number;
            max: number;
            step: number;
            mask_key: number;
        };
        custom_node_render: (null | ((arg0: any, arg1: HTMLElement, arg2: any) => void));
        expander_style: "char" | "number";
    };
    layout: {
        hspace: number;
        vspace: number;
        pspace: number;
        cousin_space: number;
    };
    default_event_handle: {
        enable_mousedown_handle: boolean;
        enable_click_handle: boolean;
        enable_dblclick_handle: boolean;
        enable_mousewheel_handle: boolean;
    };
    shortcut: {
        enable: boolean;
        handles: Record<string, Function>;
        mapping: Record<string, number | number[]>;
    };
    plugin: Record<string, any>;
};
