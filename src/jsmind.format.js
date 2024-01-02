/**
 * @license BSD
 * @copyright 2014-2023 hizzgdev@163.com
 *
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */

import { __author__, __version__, logger, Direction } from './jsmind.common.js';
import { Mind } from './jsmind.mind.js';
import { Node } from './jsmind.node.js';
import { util } from './jsmind.util.js';

const DEFAULT_META = { name: 'jsMind', author: __author__, version: __version__ };

export const format = {
    node_tree: {
        example: {
            meta: DEFAULT_META,
            format: 'node_tree',
            data: { id: 'root', topic: 'jsMind node_tree example' },
        },
        get_mind: function (source) {
            var df = format.node_tree;
            var mind = new Mind();
            mind.name = source.meta.name;
            mind.author = source.meta.author;
            mind.version = source.meta.version;
            df._parse(mind, source.data);
            return mind;
        },
        get_data: function (mind) {
            var df = format.node_tree;
            var json = {};
            json.meta = {
                name: mind.name,
                author: mind.author,
                version: mind.version,
            };
            json.format = 'node_tree';
            json.data = df._build_node(mind.root);
            return json;
        },

        _parse: function (mind, node_root) {
            var df = format.node_tree;
            var data = df._extract_data(node_root);
            mind.set_root(node_root.id, node_root.topic, data);
            if ('children' in node_root) {
                var children = node_root.children;
                for (var i = 0; i < children.length; i++) {
                    df._extract_subnode(mind, mind.root, children[i]);
                }
            }
        },

        _extract_data: function (node_json) {
            var data = {};
            for (var k in node_json) {
                if (
                    k == 'id' ||
                    k == 'topic' ||
                    k == 'children' ||
                    k == 'direction' ||
                    k == 'expanded'
                ) {
                    continue;
                }
                data[k] = node_json[k];
            }
            return data;
        },

        _extract_subnode: function (mind, node_parent, node_json) {
            var df = format.node_tree;
            var data = df._extract_data(node_json);
            var d = null;
            if (node_parent.isroot) {
                d = node_json.direction == 'left' ? Direction.left : Direction.right;
            }
            var node = mind.add_node(
                node_parent,
                node_json.id,
                node_json.topic,
                data,
                d,
                node_json.expanded
            );
            if (!!node_json['children']) {
                var children = node_json.children;
                for (var i = 0; i < children.length; i++) {
                    df._extract_subnode(mind, node, children[i]);
                }
            }
        },

        _build_node: function (node) {
            var df = format.node_tree;
            if (!(node instanceof Node)) {
                return;
            }
            var o = {
                id: node.id,
                topic: node.topic,
                expanded: node.expanded,
            };
            if (!!node.parent && node.parent.isroot) {
                o.direction = node.direction == Direction.left ? 'left' : 'right';
            }
            if (node.data != null) {
                var node_data = node.data;
                for (var k in node_data) {
                    o[k] = node_data[k];
                }
            }
            var children = node.children;
            if (children.length > 0) {
                o.children = [];
                for (var i = 0; i < children.length; i++) {
                    o.children.push(df._build_node(children[i]));
                }
            }
            return o;
        },
    },

    node_array: {
        example: {
            meta: DEFAULT_META,
            format: 'node_array',
            data: [{ id: 'root', topic: 'jsMind node_array example', isroot: true }],
        },

        get_mind: function (source) {
            var df = format.node_array;
            var mind = new Mind();
            mind.name = source.meta.name;
            mind.author = source.meta.author;
            mind.version = source.meta.version;
            df._parse(mind, source.data);
            return mind;
        },

        get_data: function (mind) {
            var df = format.node_array;
            var json = {};
            json.meta = {
                name: mind.name,
                author: mind.author,
                version: mind.version,
            };
            json.format = 'node_array';
            json.data = [];
            df._array(mind, json.data);
            return json;
        },

        _parse: function (mind, node_array) {
            var df = format.node_array;
            var nodes = node_array.slice(0);
            // reverse array for improving looping performance
            nodes.reverse();
            var root_node = df._extract_root(mind, nodes);
            if (!!root_node) {
                df._extract_subnode(mind, root_node, nodes);
            } else {
                logger.error('root node can not be found');
            }
        },

        _extract_root: function (mind, node_array) {
            var df = format.node_array;
            var i = node_array.length;
            while (i--) {
                if ('isroot' in node_array[i] && node_array[i].isroot) {
                    var root_json = node_array[i];
                    var data = df._extract_data(root_json);
                    var node = mind.set_root(root_json.id, root_json.topic, data);
                    node_array.splice(i, 1);
                    return node;
                }
            }
            return null;
        },

        _extract_subnode: function (mind, parent_node, node_array) {
            var df = format.node_array;
            var i = node_array.length;
            var node_json = null;
            var data = null;
            var extract_count = 0;
            while (i--) {
                node_json = node_array[i];
                if (node_json.parentid == parent_node.id) {
                    data = df._extract_data(node_json);
                    var d = null;
                    var node_direction = node_json.direction;
                    if (!!node_direction) {
                        d = node_direction == 'left' ? Direction.left : Direction.right;
                    }
                    var node = mind.add_node(
                        parent_node,
                        node_json.id,
                        node_json.topic,
                        data,
                        d,
                        node_json.expanded
                    );
                    node_array.splice(i, 1);
                    extract_count++;
                    var sub_extract_count = df._extract_subnode(mind, node, node_array);
                    if (sub_extract_count > 0) {
                        // reset loop index after extract subordinate node
                        i = node_array.length;
                        extract_count += sub_extract_count;
                    }
                }
            }
            return extract_count;
        },

        _extract_data: function (node_json) {
            var data = {};
            for (var k in node_json) {
                if (
                    k == 'id' ||
                    k == 'topic' ||
                    k == 'parentid' ||
                    k == 'isroot' ||
                    k == 'direction' ||
                    k == 'expanded'
                ) {
                    continue;
                }
                data[k] = node_json[k];
            }
            return data;
        },

        _array: function (mind, node_array) {
            var df = format.node_array;
            df._array_node(mind.root, node_array);
        },

        _array_node: function (node, node_array) {
            var df = format.node_array;
            if (!(node instanceof Node)) {
                return;
            }
            var o = {
                id: node.id,
                topic: node.topic,
                expanded: node.expanded,
            };
            if (!!node.parent) {
                o.parentid = node.parent.id;
            }
            if (node.isroot) {
                o.isroot = true;
            }
            if (!!node.parent && node.parent.isroot) {
                o.direction = node.direction == Direction.left ? 'left' : 'right';
            }
            if (node.data != null) {
                var node_data = node.data;
                for (var k in node_data) {
                    o[k] = node_data[k];
                }
            }
            node_array.push(o);
            var ci = node.children.length;
            for (var i = 0; i < ci; i++) {
                df._array_node(node.children[i], node_array);
            }
        },
    },

    freemind: {
        example: {
            meta: DEFAULT_META,
            format: 'freemind',
            data: '<map version="1.0.1"><node ID="root" TEXT="jsMind freemind example"/></map>',
        },
        get_mind: function (source) {
            var df = format.freemind;
            var mind = new Mind();
            mind.name = source.meta.name;
            mind.author = source.meta.author;
            mind.version = source.meta.version;
            var xml = source.data;
            var xml_doc = df._parse_xml(xml);
            var xml_root = df._find_root(xml_doc);
            df._load_node(mind, null, xml_root);
            return mind;
        },

        get_data: function (mind) {
            var df = format.freemind;
            var json = {};
            json.meta = {
                name: mind.name,
                author: mind.author,
                version: mind.version,
            };
            json.format = 'freemind';
            var xml_lines = [];
            xml_lines.push('<map version="1.0.1">');
            df._build_map(mind.root, xml_lines);
            xml_lines.push('</map>');
            json.data = xml_lines.join(' ');
            return json;
        },

        _parse_xml: function (xml) {
            var xml_doc = null;
            if (window.DOMParser) {
                var parser = new DOMParser();
                xml_doc = parser.parseFromString(xml, 'text/xml');
            } else {
                // Internet Explorer
                xml_doc = new ActiveXObject('Microsoft.XMLDOM');
                xml_doc.async = false;
                xml_doc.loadXML(xml);
            }
            return xml_doc;
        },

        _find_root: function (xml_doc) {
            var nodes = xml_doc.childNodes;
            var node = null;
            var root = null;
            var n = null;
            for (var i = 0; i < nodes.length; i++) {
                n = nodes[i];
                if (n.nodeType == 1 && n.tagName == 'map') {
                    node = n;
                    break;
                }
            }
            if (!!node) {
                var ns = node.childNodes;
                node = null;
                for (var i = 0; i < ns.length; i++) {
                    n = ns[i];
                    if (n.nodeType == 1 && n.tagName == 'node') {
                        node = n;
                        break;
                    }
                }
            }
            return node;
        },

        _load_node: function (mind, parent_node, xml_node) {
            var df = format.freemind;
            var node_id = xml_node.getAttribute('ID');
            var node_topic = xml_node.getAttribute('TEXT');
            // look for richcontent
            if (node_topic == null) {
                var topic_children = xml_node.childNodes;
                var topic_child = null;
                for (var i = 0; i < topic_children.length; i++) {
                    topic_child = topic_children[i];
                    if (topic_child.nodeType == 1 && topic_child.tagName === 'richcontent') {
                        node_topic = topic_child.textContent;
                        break;
                    }
                }
            }
            var node_data = df._load_attributes(xml_node);
            var node_expanded = 'expanded' in node_data ? node_data.expanded == 'true' : true;
            delete node_data.expanded;

            var node_position = xml_node.getAttribute('POSITION');
            var node_direction = null;
            if (!!node_position) {
                node_direction = node_position == 'left' ? Direction.left : Direction.right;
            }
            var node = null;
            if (!!parent_node) {
                node = mind.add_node(
                    parent_node,
                    node_id,
                    node_topic,
                    node_data,
                    node_direction,
                    node_expanded
                );
            } else {
                node = mind.set_root(node_id, node_topic, node_data);
            }
            var children = xml_node.childNodes;
            var child = null;
            for (var i = 0; i < children.length; i++) {
                child = children[i];
                if (child.nodeType == 1 && child.tagName == 'node') {
                    df._load_node(mind, node, child);
                }
            }
        },

        _load_attributes: function (xml_node) {
            var children = xml_node.childNodes;
            var attr = null;
            var attr_data = {};
            for (var i = 0; i < children.length; i++) {
                attr = children[i];
                if (attr.nodeType == 1 && attr.tagName === 'attribute') {
                    attr_data[attr.getAttribute('NAME')] = attr.getAttribute('VALUE');
                }
            }
            return attr_data;
        },

        _build_map: function (node, xml_lines) {
            var df = format.freemind;
            var pos = null;
            if (!!node.parent && node.parent.isroot) {
                pos = node.direction === Direction.left ? 'left' : 'right';
            }
            xml_lines.push('<node');
            xml_lines.push('ID="' + node.id + '"');
            if (!!pos) {
                xml_lines.push('POSITION="' + pos + '"');
            }
            xml_lines.push('TEXT="' + node.topic + '">');

            // store expanded status as an attribute
            xml_lines.push('<attribute NAME="expanded" VALUE="' + node.expanded + '"/>');

            // for attributes
            var node_data = node.data;
            if (node_data != null) {
                for (var k in node_data) {
                    xml_lines.push('<attribute NAME="' + k + '" VALUE="' + node_data[k] + '"/>');
                }
            }

            // for children
            var children = node.children;
            for (var i = 0; i < children.length; i++) {
                df._build_map(children[i], xml_lines);
            }

            xml_lines.push('</node>');
        },
    },
    text: {
        example: {
            meta: DEFAULT_META,
            format: 'text',
            data: 'jsMind text example\n node1\n  node1-sub\n  node1-sub\n node2',
        },
        _line_regex: /\s*/,
        get_mind: function (source) {
            var df = format.text;
            var mind = new Mind();
            mind.name = source.meta.name;
            mind.author = source.meta.author;
            mind.version = source.meta.version;
            var lines = source.data.split(/\n|\r/);
            df._fill_nodes(mind, lines, 0, 0);
            return mind;
        },

        _fill_nodes: function (mind, lines) {
            let node_path = [];
            let i = 0;
            while (i < lines.length) {
                let line = lines[i];
                let level = line.match(/\s*/)[0].length;
                let topic = line.substr(level);

                if (level == 0 && node_path.length > 0) {
                    log.error('more than 1 root node was found: ' + topic);
                    return;
                }
                if (level > node_path.length) {
                    log.error('a suspended node was found: ' + topic);
                    return;
                }
                let diff = node_path.length - level;
                while (diff--) {
                    node_path.pop();
                }

                if (level == 0 && node_path.length == 0) {
                    let node = mind.set_root(util.uuid.newid(), topic);
                    node_path.push(node);
                } else {
                    let node = mind.add_node(
                        node_path[level - 1],
                        util.uuid.newid(),
                        topic,
                        {},
                        null
                    );
                    node_path.push(node);
                }
                i++;
            }
            node_path.length = 0;
        },

        get_data: function (mind) {
            var df = format.text;
            var json = {};
            json.meta = {
                name: mind.name,
                author: mind.author,
                version: mind.version,
            };
            json.format = 'text';
            let lines = [];
            df._build_lines(lines, [mind.root], 0);
            json.data = lines.join('\n');
            return json;
        },

        _build_lines: function (lines, nodes, level) {
            let prefix = new Array(level + 1).join(' ');
            for (let node of nodes) {
                lines.push(prefix + node.topic);
                if (!!node.children) {
                    format.text._build_lines(lines, node.children, level + 1);
                }
            }
        },
    },
};
