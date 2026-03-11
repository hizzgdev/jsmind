# 多行文本插件

多行文本插件为 jsMind 提供了完整的多行文本支持，包括显示和编辑功能。

## 功能特性

- ✅ **多行文本显示**：在节点中显示多行文本
- ✅ **多行文本编辑**：使用 `contentEditable` 实现的富文本编辑器
- ✅ **自动换行**：文本超过最大宽度时自动换行
- ✅ **自动扩展高度**：编辑器高度随内容自动调整
- ✅ **键盘快捷键**：
  - `Shift + Enter`：插入换行符
  - `Enter`：保存更改
  - `Esc`：取消编辑
  - `Tab`：保存更改
- ✅ **文本规范化**：自动去除首尾空白、统一换行符、限制连续空行

## 安装

### 方式 1：UMD（浏览器）

```html
<script src="es6/jsmind.js"></script>
<script src="es6/jsmind.multiline-text.js"></script>
```

### 方式 2：ES6 模块

```javascript
import jsMind from './es6/jsmind.js';
import { createMultilineRender } from './es6/jsmind.multiline-text.js';
```

## 使用方法

### 基本用法

```javascript
// UMD（浏览器）
const options = {
    container: 'jsmind_container',
    editable: true,
    view: {
        // 使用插件提供的自定义渲染函数
        custom_node_render: jsMindMultilineText.createMultilineRender({
            text_width: 200,
            line_height: '1.5',
        })
    },
    plugin: {
        multiline_text: {
            text_width: 200,
            line_height: '1.5',
        }
    }
};

const jm = new jsMind(options);
jm.show(mind_data);
```

### ES6 模块用法

```javascript
import jsMind from './es6/jsmind.js';
import { createMultilineRender } from './es6/jsmind.multiline-text.js';

const options = {
    container: 'jsmind_container',
    editable: true,
    view: {
        custom_node_render: createMultilineRender({
            text_width: 200,
            line_height: '1.5',
        })
    },
    plugin: {
        multiline_text: {
            text_width: 200,
            line_height: '1.5',
        }
    }
};

const jm = new jsMind(options);
jm.show(mind_data);
```

## 配置选项

### `createMultilineRender(options)`

创建多行文本的自定义节点渲染函数。

**参数：**

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `text_width` | `number` | `200` | 多行文本节点的最大宽度（像素） |
| `line_height` | `string` | `'1.5'` | 文本行高 |

**返回值：** `function(jsMind, HTMLElement, Node): boolean`

**示例：**

```javascript
const customRender = createMultilineRender({
    text_width: 250,
    line_height: '1.6',
});
```

### 插件选项

在 `options.plugin.multiline_text` 中配置插件行为：

```javascript
{
    plugin: {
        multiline_text: {
            text_width: 200,      // 多行文本最大宽度
            line_height: '1.5',   // 行高
        }
    }
}
```

## 工作原理

### 1. 节点渲染

插件提供的自定义渲染函数：

1. 检测节点主题是否包含换行符（`\n`）
2. 如果包含，应用多行样式：
   - `white-space: pre-wrap` - 保留换行和空格
   - `word-break: break-word` - 断开长单词
   - `max-width: {text_width}px` - 限制最大宽度
3. 如果不包含，使用默认渲染

### 2. 节点编辑

编辑节点时，插件会：

1. 创建 `<div contenteditable="plaintext-only">` 编辑器
2. 设置编辑器样式以匹配节点元素：
   - 宽度 = 节点宽度
   - 最小高度 = 节点高度
   - 根据内容自动扩展高度
3. 处理键盘事件：
   - `Shift + Enter`：插入换行符
   - `Enter`：保存更改
   - `Esc`：取消编辑
   - `Tab`：保存更改
4. 输入时自动扩展高度
5. 失焦时保存更改（延迟 100ms）

### 3. 文本规范化

保存时，插件会规范化文本：

```javascript
const topic = (editor.textContent || '')
    .trim()                      // 去除首尾空白
    .replace(/\r\n/g, '\n')      // 统一 Windows 换行符
    .replace(/\r/g, '\n')        // 统一 Mac 换行符
    .replace(/\n{3,}/g, '\n\n'); // 限制连续空行最多 2 个
```

## 示例

### 示例 1：基本多行文本

```javascript
const mind = {
    meta: { name: 'Demo', author: 'jsMind', version: '1.0' },
    format: 'node_tree',
    data: {
        id: 'root',
        topic: '多行文本\n思维导图',
        children: [
            {
                id: 'node1',
                topic: '第一行\n第二行\n第三行',
            },
        ],
    },
};

jm.show(mind);
```

### 示例 2：编程方式添加多行节点

```javascript
// 添加多行子节点
jm.add_node(
    'parent_node_id',
    'new_node_id',
    '第一行\n第二行\n第三行'
);
```

### 示例 3：更新节点为多行文本

```javascript
// 更新现有节点为多行文本
jm.update_node('node_id', '新的第一行\n新的第二行');
```

## 编辑器行为

### 自动扩展高度

编辑器根据内容自动扩展高度：

```javascript
const autoExpand = () => {
    editor.style.height = 'auto';
    editor.style.height = editor.scrollHeight + 'px';
};
$.on(editor, 'input', autoExpand);
setTimeout(autoExpand, 0);  // 初始扩展
```

**行为：**
- 初始高度 = 节点高度
- 内容超过初始高度时扩展
- 删除内容时收缩（但不会小于初始高度）
- 无滚动条（overflow: hidden）

### 编辑器样式

```css
.jsmind-multiline-editor {
    width: {node.clientWidth}px;
    min-height: {node.clientHeight}px;
    line-height: {opts.line_height};
    border: none;
    outline: none;
    white-space: pre-wrap;
    word-break: break-word;
    box-sizing: border-box;
    overflow: hidden;
}
```

## API 参考

### `createMultilineRender(options)`

创建自定义节点渲染函数。

**类型：**
```typescript
function createMultilineRender(options?: {
    text_width?: number;
    line_height?: string;
}): (jm: jsMind, element: HTMLElement, node: Node) => boolean
```

**示例：**
```javascript
const render = createMultilineRender({
    text_width: 250,
    line_height: '1.6',
});
```

## 浏览器兼容性

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+

**注意：** 需要支持 `contenteditable="plaintext-only"`。

## 故障排除

### 问题：插件不工作

**解决方案：**
1. 确保插件脚本在 jsMind 核心之后加载
2. 检查 `custom_node_render` 是否在 options 中设置
3. 检查 `plugin.multiline_text` 是否配置
4. 打开浏览器控制台查看是否有 `[Multiline Plugin] Initializing...`

### 问题：编辑器不显示

**解决方案：**
1. 检查节点是否可编辑（`options.editable = true`）
2. 检查浏览器控制台是否有错误
3. 验证浏览器是否支持 `contenteditable`

### 问题：高度不扩展

**解决方案：**
1. 检查编辑器是否设置了 `overflow: hidden`
2. 验证 `input` 事件是否触发
3. 检查浏览器控制台是否有 JavaScript 错误

## 许可证

BSD-3-Clause

## 作者

UmbraCi

## 链接

- [GitHub 仓库](https://github.com/hizzgdev/jsmind/)
- [文档](https://hizzgdev.github.io/jsmind/)

