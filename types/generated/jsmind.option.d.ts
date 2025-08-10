/**
 * Merge user options with defaults. Throws if container missing.
 * @param {Partial<JsMindRuntimeOptions>} options
 * @returns {JsMindRuntimeOptions}
 */
export function merge_option(options: Partial<JsMindRuntimeOptions>): JsMindRuntimeOptions;
export type JsMindRuntimeOptions = {
    container: string | HTMLElement;
    editable: boolean;
    theme: string | null;
    mode: 'full' | 'side';
    support_html: boolean;
    log_level: 'debug' | 'info' | 'warn' | 'error' | 'disable';
    view: {
        engine: 'canvas' | 'svg';
        enable_device_pixel_ratio: boolean;
        hmargin: number;
        vmargin: number;
        line_width: number;
        line_color: string;
        line_style: 'curved' | 'straight';
        custom_line_render?: (
            this: object,
            arg: {
                ctx: CanvasRenderingContext2D | SVGPathElement;
                start_point: {
                    x: number;
                    y: number;
                };
                end_point: {
                    x: number;
                    y: number;
                };
            }
        ) => void;
        draggable: boolean;
        hide_scrollbars_when_draggable: boolean;
        node_overflow: 'hidden' | 'wrap';
        zoom: {
            min: number;
            max: number;
            step: number;
            mask_key: number;
        };
        custom_node_render:
            | null
            | ((
                  jm: import('./jsmind.js').default,
                  ele: HTMLElement,
                  node: import('./jsmind.node.js').Node
              ) => void);
        expander_style: 'char' | 'number';
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
        handles: Record<string, (jm: import('./jsmind.js').default, e: KeyboardEvent) => void>;
        mapping: Record<string, number | number[]>;
        id_generator?: () => string;
    };
    plugin: Record<string, object>;
};
