# view.custom_node_render 选项

| 选项名 | 数据类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| view.custom_node_render | function | null | 自定义节点渲染方法（从 0.7.6 版本开始支持） |

## 选项说明

`custom_node_render` 选项允许用户自定义思维导图中节点的渲染方法。通过设置这个选项，用户可以完全控制节点的绘制逻辑，从而实现更灵活和个性化的视觉效果。该选项的数据类型为 `function`，其签名为：

```javascript
function custom_node_render(jm, element, node): boolean
```

- `jm`：jsMind 实例对象。
- `element`：一个 DOM 元素，表示节点的 HTML 容器。
- `node`：一个包含节点数据的对象。

返回值用于表示是否已经对此节点进行了渲染：
- 如果返回 `true`，jsMind 将不会再次渲染此节点。
- 如果返回 `false`，jsMind 将使用默认渲染逻辑对此节点进行渲染。

## 使用示例

以下是一个自定义节点渲染方法的示例：

```javascript
var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary',
    mode: 'full',
    support_html: true,
    view: {
        engine: 'canvas',
        custom_node_render: function(jm, element, node) {
            let emoji = pickRandomEmoji();
            element.innerHTML = `<img src="${emoji}">${node.topic}`;
            return true; // 表示已经渲染此节点
        }
    }
};
```

## 注意事项

- 确保自定义渲染方法不会破坏节点的基本功能，例如拖动、缩放等。
- 不要使用异步 DOM 模型实现此方法，否则会导致排版错误，相关的讨论参见[这里](https://github.com/hizzgdev/jsmind/discussions/607)。
