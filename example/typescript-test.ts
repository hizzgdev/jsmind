/**
 * TypeScript typings validation example
 * This file exercises jsMind's public API for type-checking purposes only.
 */

// Import core library (resolved via package name to types/)
import jsMind, { Node, Mind, JsMindOptions, NodeTreeFormat, MindMapData } from 'jsmind';
// Note: in real usage, plugins should be imported to register themselves
// import 'jsmind/draggable-node';
// import 'jsmind/screenshot';

// ============================================================================
// Basic options
// ============================================================================

// Minimal options
const basicOptions: JsMindOptions = {
    container: 'jsmind_container',
    editable: true,
    theme: 'orange',
    mode: 'full',
    support_html: true,
    log_level: 'info',
};

// Full options
const fullOptions: JsMindOptions = {
    container: 'jsmind_container',
    editable: true,
    theme: 'greensea',
    mode: 'side',
    support_html: false,
    log_level: 'debug',
    view: {
        engine: 'canvas',
        enable_device_pixel_ratio: true,
        hmargin: 120,
        vmargin: 60,
        line_width: 3,
        line_color: '#333',
        line_style: 'straight',
        draggable: true,
        hide_scrollbars_when_draggable: true,
        node_overflow: 'wrap',
        zoom: {
            min: 0.3,
            max: 3.0,
            step: 0.2,
            mask_key: 4096,
        },
        custom_node_render: (jm, element, node) => {
            element.innerHTML = `<strong>${node.topic}</strong>`;
        },
        expander_style: 'number',
    },
    layout: {
        hspace: 40,
        vspace: 25,
        pspace: 15,
        cousin_space: 5,
    },
    default_event_handle: {
        enable_mousedown_handle: true,
        enable_click_handle: true,
        enable_dblclick_handle: false,
        enable_mousewheel_handle: true,
    },
    shortcut: {
        enable: true,
        handles: {
            custom_action: () => console.log('Custom action triggered'),
        },
        mapping: {
            addchild: [45, 4096 + 13],
            addbrother: 13,
            editnode: 113,
            delnode: 46,
            toggle: 32,
            left: 37,
            up: 38,
            right: 39,
            down: 40,
        },
    },
    plugin: {
        draggable_node: {
            line_width: 6,
            line_color: 'rgba(255,0,0,0.5)',
            lookup_delay: 300,
        },
        screenshot: {
            filename: 'my-mindmap',
            background: '#ffffff',
            watermark: {
                left: 'My Company',
                right: 'https://example.com',
            },
        },
    },
};

// ============================================================================
// Data formats
// ============================================================================

// NodeTreeFormat specimen
const nodeTreeData: NodeTreeFormat = {
    meta: {
        name: 'Test Mind Map',
        author: 'TypeScript Tester',
        version: '1.0',
    },
    format: 'node_tree',
    data: {
        id: 'root',
        topic: 'Root Topic',
        data: {
            background: '#ff0000',
            foreground: '#ffffff',
        },
        children: [
            {
                id: 'child1',
                topic: 'Child 1',
                direction: 1,
                expanded: true,
                children: [
                    {
                        id: 'grandchild1',
                        topic: 'Grandchild 1',
                        data: { note: 'This is a note' },
                    },
                ],
            },
            {
                id: 'child2',
                topic: 'Child 2',
                direction: -1,
                expanded: false,
            },
        ],
    },
};

// ============================================================================
// jsMind instance
// ============================================================================

// Create jsMind instance
const jm = new jsMind(basicOptions);

// Static members
const NodeClass = jsMind.node;
const MindClass = jsMind.mind;
const direction = jsMind.direction;
const eventType = jsMind.event_type;
const domUtil = jsMind.$;
const util = jsMind.util;

// Direction enum
const leftDirection: number = direction.left; // -1
const rightDirection: number = direction.right; // 1
const centerDirection: number = direction.center; // 0
const parsedDirection: number | undefined = direction.of('left');

// Event types
const showEvent: number = eventType.show;
const resizeEvent: number = eventType.resize;

// ============================================================================
// API methods
// ============================================================================

// Show mind map
jm.show(nodeTreeData);
jm.show(); // 显示空白思维导图

// Query state
const meta = jm.get_meta();
const data = jm.get_data('node_tree');
const root = jm.get_root();

// Node operations
if (root) {
    const newNode = jm.add_node(root, 'new_node', 'New Topic', { color: 'blue' }, 1);
    if (newNode) {
        jm.update_node(newNode.id, 'Updated Topic');
        jm.select_node(newNode);

        const selectedNode = jm.get_selected_node();
        if (selectedNode) {
            jm.set_node_color(selectedNode.id, '#ff0000', '#ffffff');
            jm.set_node_font_style(selectedNode.id, 16, 'bold', 'italic');
        }
    }
}

// Edit operations
jm.enable_edit();
const isEditable: boolean = jm.get_editable();
jm.begin_edit();
jm.end_edit();
jm.disable_edit();

// Layout operations
jm.expand_all();
jm.collapse_all();
jm.expand_to_depth(2);

// View operations
jm.enable_view_draggable();
const isDraggable: boolean = jm.get_view_draggable();
jm.disable_view_draggable();
jm.resize();

// Event listener
jm.add_event_listener((type: number, data: any) => {
    console.log(`Event ${type} triggered with data:`, data);
});

// ============================================================================
// Node class
// ============================================================================

// Create node instance (normally created via API)
const testNode = new Node('test_id', 1, 'Test Topic', { custom: 'data' }, false, null, 1, true);

// Node fields
const nodeId: string = testNode.id;
const nodeTopic: string = testNode.topic;
const nodeChildren: Node[] = testNode.children;
const isRoot: boolean = testNode.isroot;

// Node methods
const location = testNode.get_location();
const size = testNode.get_size();

// Static helpers
const isNodeInstance: boolean = Node.is_node(testNode);
const comparison: number = Node.compare(testNode, testNode);

// ============================================================================
// Utils
// ============================================================================

// JSON utils
const jsonString: string = util.json.json2string({ test: 'data' });
const jsonObject: any = util.json.string2json('{"test":"data"}');
const mergedObject: any = util.json.merge({}, { test: 'data' });

// UUID utils
const newId: string = util.uuid.newid();

// Text utils
const isEmpty: boolean = util.text.is_empty('');
const isNotEmpty: boolean = util.text.is_empty('hello');

// File utils (would require a File object)
// util.file.read(fileObject, (result, name) => {
//     console.log(`File ${name} content:`, result);
// });

// DOM utils
const element = domUtil.g('some_id');
const newElement = domUtil.c('div');

// ============================================================================
// Type validation
// ============================================================================

// The code below should pass the TS compiler type-check
function validateTypes() {
    // Validate option types
    const config: JsMindOptions = basicOptions;

    // Validate data format types
    const mindData: MindMapData = nodeTreeData;

    // Validate return types
    const rootNode: Node | null = jm.get_root();
    const selectedNode: Node | null = jm.get_selected_node();

    // Validate event handler shape
    const eventHandler = (type: number, data: any) => {
        if (type === jsMind.event_type.show) {
            console.log('Mind map shown');
        }
    };

    return {
        config,
        mindData,
        rootNode,
        selectedNode,
        eventHandler,
    };
}

// Export for the Jest runner to import if needed
export { validateTypes };

console.log('TypeScript typings validation example done.');
console.log('If this file compiles, typings are consistent.');
