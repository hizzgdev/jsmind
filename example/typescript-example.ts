/**
 * jsMind TypeScript 使用示例
 * 展示如何在 TypeScript 项目中使用 jsMind
 */

import jsMind, { JsMindOptions, NodeTreeFormat } from '../es6/jsmind';

// 创建配置选项
const options: JsMindOptions = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary',
    view: {
        engine: 'canvas',
        draggable: true,
        zoom: {
            min: 0.5,
            max: 2.0,
            step: 0.1,
        },
    },
    layout: {
        hspace: 30,
        vspace: 20,
    },
};

// 创建思维导图数据
const mindData: NodeTreeFormat = {
    meta: {
        name: 'TypeScript Example',
        author: 'jsMind User',
        version: '1.0',
    },
    format: 'node_tree',
    data: {
        id: 'root',
        topic: 'TypeScript Integration',
        children: [
            {
                id: 'features',
                topic: 'Features',
                direction: 1,
                children: [
                    { id: 'types', topic: 'Type Safety' },
                    { id: 'intellisense', topic: 'IntelliSense' },
                    { id: 'refactoring', topic: 'Safe Refactoring' },
                ],
            },
            {
                id: 'benefits',
                topic: 'Benefits',
                direction: -1,
                children: [
                    { id: 'errors', topic: 'Compile-time Error Detection' },
                    { id: 'docs', topic: 'Self-documenting Code' },
                    { id: 'maintenance', topic: 'Better Maintainability' },
                ],
            },
        ],
    },
};

// 创建 jsMind 实例
const jm = new jsMind(options);

// 显示思维导图
jm.show(mindData);

// 添加事件监听器
jm.add_event_listener((type, data) => {
    switch (type) {
        case jsMind.event_type.show:
            console.log('Mind map displayed');
            break;
        case jsMind.event_type.select:
            console.log('Node selected:', data);
            break;
        case jsMind.event_type.edit:
            console.log('Node edited:', data);
            break;
    }
});

// 获取根节点并添加新节点
const root = jm.get_root();
if (root) {
    const newNode = jm.add_node(
        root,
        'new_feature',
        'New Feature',
        {
            background: '#ff6b6b',
            foreground: '#ffffff',
        },
        jsMind.direction.right
    );

    if (newNode) {
        // 设置节点样式
        jm.set_node_color(newNode.id, '#ff6b6b', '#ffffff');
        jm.set_node_font_style(newNode.id, 14, 'bold');

        // 选择新节点
        jm.select_node(newNode);
    }
}

// 工具函数使用示例
const nodeId = jsMind.util.uuid.newid();
const isEmpty = jsMind.util.text.is_empty('');
const jsonData = jsMind.util.json.json2string(mindData);

console.log('Generated node ID:', nodeId);
console.log('Is empty string:', isEmpty);
console.log('JSON data length:', jsonData.length);

// 导出实例供其他模块使用
export { jm, options, mindData };
