export namespace format {
    namespace node_tree {
        namespace example {
            export { DEFAULT_META as meta };
            export let format: string;
            export namespace data {
                let id: string;
                let topic: string;
            }
        }
        function get_mind(source: any): Mind;
        function get_data(mind: any): {
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
        };
        function _parse(mind: any, node_root: any): void;
        function _extract_data(node_json: any): {};
        function _extract_subnode(mind: any, node_parent: any, node_json: any): void;
        function _build_node(node: any): {
            id: any;
            topic: any;
            expanded: boolean;
        };
    }
    namespace node_array {
        export namespace example_1 {
            export { DEFAULT_META as meta };
            let format_1: string;
            export { format_1 as format };
            let data_1: {
                id: string;
                topic: string;
                isroot: boolean;
            }[];
            export { data_1 as data };
        }
        export { example_1 as example };
        export function get_mind_1(source: any): Mind;
        export { get_mind_1 as get_mind };
        export function get_data_1(mind: any): {
            meta: {
                name: any;
                author: any;
                version: any;
            };
            format: string;
            data: any[];
        };
        export { get_data_1 as get_data };
        export function _parse_1(mind: any, node_array: any): void;
        export { _parse_1 as _parse };
        export function _extract_root(mind: any, node_array: any): any;
        export function _extract_subnode_1(mind: any, parent_node: any, node_array: any): number;
        export { _extract_subnode_1 as _extract_subnode };
        export function _extract_data_1(node_json: any): {};
        export { _extract_data_1 as _extract_data };
        export function _array(mind: any, node_array: any): void;
        export function _array_node(node: any, node_array: any): void;
    }
    namespace freemind {
        export namespace example_2 {
            export { DEFAULT_META as meta };
            let format_2: string;
            export { format_2 as format };
            let data_2: string;
            export { data_2 as data };
        }
        export { example_2 as example };
        export function get_mind_2(source: any): Mind;
        export { get_mind_2 as get_mind };
        export function get_data_2(mind: any): {
            meta: {
                name: any;
                author: any;
                version: any;
            };
            format: string;
            data: string;
        };
        export { get_data_2 as get_data };
        export function _parse_xml(xml: any): any;
        export function _find_root(xml_doc: any): any;
        export function _load_node(mind: any, parent_node: any, xml_node: any): void;
        export function _load_attributes(xml_node: any): {};
        export function _build_map(node: any, xml_lines: any): void;
        export function _escape(text: any): any;
    }
    namespace text {
        export namespace example_3 {
            export { DEFAULT_META as meta };
            let format_3: string;
            export { format_3 as format };
            let data_3: string;
            export { data_3 as data };
        }
        export { example_3 as example };
        export let _line_regex: RegExp;
        export function get_mind_3(source: any): Mind;
        export { get_mind_3 as get_mind };
        export function _fill_nodes(mind: any, lines: any): void;
        export function get_data_3(mind: any): {
            meta: {
                name: any;
                author: any;
                version: any;
            };
            format: string;
            data: string;
        };
        export { get_data_3 as get_data };
        export function _build_lines(lines: any, nodes: any, level: any): void;
    }
}
declare namespace DEFAULT_META {
    export let name: string;
    export { __author__ as author };
    export { __version__ as version };
}
import { Mind } from './jsmind.mind.js';
import { __author__ } from './jsmind.common.js';
import { __version__ } from './jsmind.common.js';
export {};
