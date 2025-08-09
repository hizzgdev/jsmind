/**
 * jsMind TypeScript Demo
 * 这个文件展示了如何在 TypeScript 中使用 jsMind
 * 编译命令: npx tsc example/typescript-demo.ts --outDir example/js --target ES2020 --module ESNext
 */
import jsMind from '../es6/jsmind';
// 全局变量
let jm = null;
let isEditMode = false;
// TypeScript 配置选项 - 享受完整的类型检查和智能提示
const options = {
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
        line_color: '#667eea',
        line_width: 2,
    },
    layout: {
        hspace: 30,
        vspace: 20,
        pspace: 13,
    },
    plugin: {
        draggable_node: {
            line_width: 5,
            line_color: 'rgba(102, 126, 234, 0.6)',
            line_color_invalid: 'rgba(220, 53, 69, 0.6)',
            lookup_delay: 200,
        },
    },
};
// TypeScript 数据格式 - 类型安全的数据定义
const sampleMindData = {
    meta: {
        name: 'TypeScript Demo',
        author: 'jsMind TypeScript',
        version: '1.0',
    },
    format: 'node_tree',
    data: {
        id: 'root',
        topic: 'jsMind TypeScript 集成',
        children: [
            {
                id: 'features',
                topic: '🚀 主要特性',
                direction: jsMind.direction.right,
                expanded: true,
                children: [
                    {
                        id: 'type-safety',
                        topic: '类型安全',
                        data: {
                            note: '编译时类型检查',
                            background: '#e3f2fd',
                        },
                    },
                    {
                        id: 'intellisense',
                        topic: '智能提示',
                        data: {
                            note: 'IDE 自动完成',
                            background: '#f3e5f5',
                        },
                    },
                    {
                        id: 'refactoring',
                        topic: '安全重构',
                        data: {
                            note: '重命名和移动',
                            background: '#e8f5e8',
                        },
                    },
                ],
            },
            {
                id: 'benefits',
                topic: '💡 开发优势',
                direction: jsMind.direction.left,
                expanded: true,
                children: [
                    {
                        id: 'errors',
                        topic: '错误预防',
                        data: { background: '#ff6b6b' },
                    },
                    {
                        id: 'docs',
                        topic: '自文档化',
                        data: { background: '#4ecdc4' },
                    },
                    {
                        id: 'maintenance',
                        topic: '易维护性',
                        data: { background: '#45b7d1' },
                    },
                ],
            },
            {
                id: 'plugins',
                topic: '🔌 插件支持',
                direction: jsMind.direction.right,
                children: [
                    { id: 'draggable', topic: '拖拽节点' },
                    { id: 'screenshot', topic: '截图导出' },
                ],
            },
        ],
    },
};
// 初始化函数 - 类型安全的 jsMind 实例创建
function initJsMind() {
    jm = new jsMind(options);
    // 事件监听 - TypeScript 提供类型安全的事件处理
    jm.add_event_listener((type, data) => {
        let eventName = '';
        switch (type) {
            case jsMind.event_type.show:
                eventName = '显示';
                break;
            case jsMind.event_type.select:
                eventName = '选择';
                break;
            case jsMind.event_type.edit:
                eventName = '编辑';
                break;
            case jsMind.event_type.resize:
                eventName = '调整大小';
                break;
        }
        updateStatus(`事件触发: ${eventName} - ${JSON.stringify(data)}`);
    });
    updateStatus('jsMind 初始化完成 - TypeScript 类型定义已生效');
}
// 加载示例数据
function loadSampleData() {
    if (!jm) initJsMind();
    jm.show(sampleMindData);
    updateStatus('示例数据已加载 - 使用了 TypeScript NodeTreeFormat 类型');
}
// 添加随机节点 - 展示类型安全的 API 调用
function addRandomNode() {
    if (!jm) {
        updateStatus('请先加载数据');
        return;
    }
    const selectedNode = jm.get_selected_node();
    const parentNode = selectedNode || jm.get_root();
    if (parentNode) {
        const nodeId = jsMind.util.uuid.newid();
        const topics = ['新想法', '重要提醒', '待办事项', '灵感闪现', '项目计划'];
        const topic = topics[Math.floor(Math.random() * topics.length)];
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        // TypeScript 确保方法调用的类型正确性
        const newNode = jm.add_node(
            parentNode,
            nodeId,
            topic,
            {
                background: color,
                created: new Date().toISOString(),
            },
            Math.random() > 0.5 ? jsMind.direction.right : jsMind.direction.left
        );
        if (newNode) {
            jm.set_node_color(newNode.id, color, '#ffffff');
            jm.select_node(newNode);
            updateStatus(`已添加新节点: ${topic} (ID: ${nodeId})`);
        }
    }
}
// 切换编辑模式
function toggleEdit() {
    if (!jm) {
        updateStatus('请先加载数据');
        return;
    }
    isEditMode = !isEditMode;
    if (isEditMode) {
        jm.enable_edit();
        updateStatus('编辑模式已启用 - 双击节点可编辑');
    } else {
        jm.disable_edit();
        updateStatus('编辑模式已禁用');
    }
}
// 展开所有节点
function expandAll() {
    if (!jm) return;
    jm.expand_all();
    updateStatus('所有节点已展开');
}
// 收起所有节点
function collapseAll() {
    if (!jm) return;
    jm.collapse_all();
    updateStatus('所有节点已收起');
}
// 清空思维导图
function clearMindMap() {
    if (!jm) return;
    jm.show();
    updateStatus('思维导图已清空');
}
// 更新状态信息
function updateStatus(message) {
    const statusElement = document.getElementById('status');
    if (statusElement) {
        statusElement.textContent = `${new Date().toLocaleTimeString()} - ${message}`;
    }
}
// 演示工具函数的使用
function demonstrateUtilFunctions() {
    // UUID 生成
    const nodeId = jsMind.util.uuid.newid();
    console.log('Generated UUID:', nodeId);
    // JSON 操作
    const jsonString = jsMind.util.json.json2string(sampleMindData);
    const parsedData = jsMind.util.json.string2json(jsonString);
    console.log('JSON serialization test passed');
    // 文本工具
    const isEmpty = jsMind.util.text.is_empty('');
    const isNotEmpty = jsMind.util.text.is_empty('hello');
    console.log('Text utility test:', { isEmpty, isNotEmpty });
    // DOM 工具
    const element = jsMind.$.g('jsmind_container');
    if (element) {
        console.log('DOM element found:', element.tagName);
    }
}
// 导出函数供全局使用
window.loadSampleData = loadSampleData;
window.addRandomNode = addRandomNode;
window.toggleEdit = toggleEdit;
window.expandAll = expandAll;
window.collapseAll = collapseAll;
window.clearMindMap = clearMindMap;
// 页面加载完成后的初始化
window.addEventListener('load', () => {
    updateStatus('页面加载完成 - TypeScript 类型定义验证成功');
    demonstrateUtilFunctions();
});
// 导出主要对象供其他模块使用
export { jm, options, sampleMindData };
