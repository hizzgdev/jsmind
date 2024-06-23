# node_overflow 选项

| 选项名 | 数据类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| node_overflow | string | 'hidden' | 节点文本过长时的样式（从 0.5.3 版本开始支持） |

## 选项说明

`node_overflow` 选项用于设置当节点文本过长时的显示样式。此选项支持以下两种样式：

- `hidden` - 隐藏部分文本以保持脑图的整体易读性 [默认值]
- `wrap` - 对文本进行换行，以展示全部文本内容

## 使用示例

以下是一个设置 `node_overflow` 选项的示例：

```javascript
var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary',
    view: {
        node_overflow: 'wrap', // 设置节点文本过长时换行显示
    }
};
```

在上述示例中，`node_overflow` 选项被设置为 `wrap`。这个设置将使得节点文本过长时，文本内容会自动换行显示。

| hidden (default) | wrap |
| --- | --- |
| <img width="596" alt="image" src="https://github.com/hizzgdev/jsmind/assets/1690290/8ddf09c6-9bfe-403a-93c5-7c71c0b94aad"> | <img width="619" alt="image" src="https://github.com/hizzgdev/jsmind/assets/1690290/6fbf8104-a7ed-4f25-993e-77fe1565b477"> |


## 相关选项和设置

### custom_node_render

`custom_node_render` 选项允许用户自定义思维导图节点的渲染方法。通过此选项，用户可以完全控制节点的渲染过程。

更多信息请参考 [custom_node_render 选项](option.view.custom_node_render.md)。

### 主题

自定义主题的 `jmnode` 样式可能会影响 node_overflow 选项的效果。

更多信息请参考 [theme 选项](option.theme.md)。
