/**
 * Mind data format handlers.
 * @type {{
 *  node_tree: { example:{meta:MindMapMeta,format:'node_tree',data:any}, get_mind:(src:any)=>Mind, get_data:(mind:Mind)=>any },
 *  node_array: { example:{meta:MindMapMeta,format:'node_array',data:any[]}, get_mind:(src:any)=>Mind, get_data:(mind:Mind)=>any },
 *  freemind: { example:{meta:MindMapMeta,format:'freemind',data:string}, get_mind:(src:any)=>Mind, get_data:(mind:Mind)=>any },
 *  text: { example:{meta:MindMapMeta,format:'text',data:string}, get_mind:(src:any)=>Mind, get_data:(mind:Mind)=>any }
 * }}
 */
export const format: {
    node_tree: {
        example: {
            meta: MindMapMeta;
            format: "node_tree";
            data: any;
        };
        get_mind: (src: any) => Mind;
        get_data: (mind: Mind) => any;
    };
    node_array: {
        example: {
            meta: MindMapMeta;
            format: "node_array";
            data: any[];
        };
        get_mind: (src: any) => Mind;
        get_data: (mind: Mind) => any;
    };
    freemind: {
        example: {
            meta: MindMapMeta;
            format: "freemind";
            data: string;
        };
        get_mind: (src: any) => Mind;
        get_data: (mind: Mind) => any;
    };
    text: {
        example: {
            meta: MindMapMeta;
            format: "text";
            data: string;
        };
        get_mind: (src: any) => Mind;
        get_data: (mind: Mind) => any;
    };
};
export type MindMapMeta = {
    name: string;
    author: string;
    version: string;
};
import { Mind } from './jsmind.mind.js';
