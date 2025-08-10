/**
 * Mind data format handlers.
 * @type {{
 *  node_tree: { example:NodeTreeFormat, get_mind:(src:NodeTreeFormat)=>Mind, get_data:(mind:Mind)=>NodeTreeFormat },
 *  node_array: { example:NodeArrayFormat, get_mind:(src:NodeArrayFormat)=>Mind, get_data:(mind:Mind)=>NodeArrayFormat },
 *  freemind: { example:{meta:MindMapMeta,format:'freemind',data:string}, get_mind:(src:any)=>Mind, get_data:(mind:Mind)=>any },
 *  text: { example:{meta:MindMapMeta,format:'text',data:string}, get_mind:(src:any)=>Mind, get_data:(mind:Mind)=>any }
 * }}
 */
export const format: {
    node_tree: {
        example: NodeTreeFormat;
        get_mind: (src: NodeTreeFormat) => Mind;
        get_data: (mind: Mind) => NodeTreeFormat;
    };
    node_array: {
        example: NodeArrayFormat;
        get_mind: (src: NodeArrayFormat) => Mind;
        get_data: (mind: Mind) => NodeArrayFormat;
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
/**
 * Node tree data item
 */
export type NodeTreeData = {
    id: string;
    topic: string;
    data?: Record<string, any>;
    direction?: (number | string);
    expanded?: boolean;
    children?: NodeTreeData[];
};
/**
 * Node tree formatted payload
 */
export type NodeTreeFormat = {
    meta?: MindMapMeta;
    format: "node_tree";
    data: NodeTreeData;
};
/**
 * Node array data item
 */
export type NodeArrayItem = {
    id: string;
    topic: string;
    parentid?: string;
    data?: Record<string, any>;
    direction?: (number | string);
    expanded?: boolean;
    isroot?: boolean;
};
/**
 * Node array formatted payload
 */
export type NodeArrayFormat = {
    meta?: MindMapMeta;
    format: "node_array";
    data: NodeArrayItem[];
};
import { Mind } from './jsmind.mind.js';
