/**
 * TypeScript 类型定义验证测试文件
 * 用于验证 jsMind 的 TypeScript 类型定义是否正确
 */

// 导入主库（通过包名解析到 types/）
import jsMind, { Node, Mind, JsMindOptions, NodeTreeFormat, MindMapData } from 'jsmind';
// 注意：在实际使用中，插件需要单独导入来注册
// import 'jsmind/draggable-node';
// import 'jsmind/screenshot';

// ============================================================================
// 基础配置测试
// ============================================================================

// 测试基本配置选项
const basicOptions: JsMindOptions = {
    container: 'jsmind_container',
    editable: true,
    theme: 'orange',
    mode: 'full',
    support_html: true,
    log_level: 'info',
};

// 测试完整配置选项
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
// 数据格式测试
// ============================================================================

// 测试节点树格式数据
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
// jsMind 实例测试
// ============================================================================

// 创建 jsMind 实例
const jm = new jsMind(basicOptions);

// 测试静态属性
const NodeClass = jsMind.node;
const MindClass = jsMind.mind;
const direction = jsMind.direction;
const eventType = jsMind.event_type;
const domUtil = jsMind.$;
const util = jsMind.util;

// 测试方向枚举
const leftDirection: number = direction.left; // -1
const rightDirection: number = direction.right; // 1
const centerDirection: number = direction.center; // 0
const parsedDirection: number | undefined = direction.of('left');

// 测试事件类型
const showEvent: number = eventType.show;
const resizeEvent: number = eventType.resize;

// ============================================================================
// API 方法测试
// ============================================================================

// 显示思维导图
jm.show(nodeTreeData);
jm.show(); // 显示空白思维导图

// 获取信息
const meta = jm.get_meta();
const data = jm.get_data('node_tree');
const root = jm.get_root();

// 节点操作
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

// 编辑操作
jm.enable_edit();
const isEditable: boolean = jm.get_editable();
jm.begin_edit();
jm.end_edit();
jm.disable_edit();

// 布局操作
jm.expand_all();
jm.collapse_all();
jm.expand_to_depth(2);

// 视图操作
jm.enable_view_draggable();
const isDraggable: boolean = jm.get_view_draggable();
jm.disable_view_draggable();
jm.resize();

// 事件监听
jm.add_event_listener((type: number, data: any) => {
    console.log(`Event ${type} triggered with data:`, data);
});

// ============================================================================
// Node 类测试
// ============================================================================

// 创建节点实例（通常不直接创建，而是通过 jsMind API）
const testNode = new Node('test_id', 1, 'Test Topic', { custom: 'data' }, false, null, 1, true);

// 测试节点属性
const nodeId: string = testNode.id;
const nodeTopic: string = testNode.topic;
const nodeChildren: Node[] = testNode.children;
const isRoot: boolean = testNode.isroot;

// 测试节点方法
const location = testNode.get_location();
const size = testNode.get_size();

// 测试静态方法
const isNodeInstance: boolean = Node.is_node(testNode);
const comparison: number = Node.compare(testNode, testNode);

// ============================================================================
// 工具类测试
// ============================================================================

// JSON 工具
const jsonString: string = util.json.json2string({ test: 'data' });
const jsonObject: any = util.json.string2json('{"test":"data"}');
const mergedObject: any = util.json.merge({}, { test: 'data' });

// UUID 工具
const newId: string = util.uuid.newid();

// 文本工具
const isEmpty: boolean = util.text.is_empty('');
const isNotEmpty: boolean = util.text.is_empty('hello');

// 文件工具（需要 File 对象）
// util.file.read(fileObject, (result, name) => {
//     console.log(`File ${name} content:`, result);
// });

// DOM 工具
const element = domUtil.g('some_id');
const newElement = domUtil.c('div');

// ============================================================================
// 类型检查验证
// ============================================================================

// 这些代码应该通过 TypeScript 编译器的类型检查
function validateTypes() {
    // 验证配置选项类型
    const config: JsMindOptions = basicOptions;

    // 验证数据格式类型
    const mindData: MindMapData = nodeTreeData;

    // 验证方法返回类型
    const rootNode: Node | null = jm.get_root();
    const selectedNode: Node | null = jm.get_selected_node();

    // 验证事件处理器类型
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

// 导出验证函数供测试使用
export { validateTypes };

console.log('TypeScript 类型定义验证测试完成！');
console.log('如果此文件能够成功编译，说明类型定义是正确的。');
