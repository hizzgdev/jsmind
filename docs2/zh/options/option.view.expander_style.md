# expander_style 选项

| 选项名 | 数据类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| expander_style | string | 'char' | 子节点展开器的样式（从 0.7.8 版本开始支持） |

## 选项说明

`view.expander_style` 选项用于设置子节点展开控制器的样式。此选项支持以下两种样式：

- `char` - 在展开控制器上显示 `-` 和 `+` 用于表示节点的展开状态，这是默认值。
- `number` - 在展开控制器上显示子节点的数量，当子节点数量超过 99 个时，将显示 `...`。

此选项在 jsMind 0.7.8 及以上版本中支持。

## 使用示例

以下是一个设置 `view.expander_style` 选项为 `number` 的示例：

```javascript
var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary',
    view: {
        expander_style: 'number', // 使用数字显示子节点数量
    }
};
```

在上述示例中，`view.expander_style` 选项被设置为 `number`，这意味着子节点的展开控制器将显示子节点的数量，当子节点数量超过 99 个时，将显示 `...`。

| 'char' | 'number' |
| --- | --- |
| <img width="469" alt="image" src="https://github.com/hizzgdev/jsmind/assets/1690290/8462da63-3c1f-4858-9f66-e088670115e2"> | <img width="396" alt="image" src="https://github.com/hizzgdev/jsmind/assets/1690290/e309e397-dbf5-424d-a0be-32ab99a902d2"> |

## 其它内容

如果需要自定义展开控制器的样式，可以在自定义的 CSS 文件中添加相应的样式定义。例如：

```css
/* 自定义展开控制器样式 */
.jmnodes .jmexpander {
    background-color: #f0f0f0;
    color: #333;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}
```

以上 CSS 代码定义了一个圆形的展开控制器，并设置了背景颜色和文本颜色。你可以根据需要进一步调整样式。更多详细信息，请参见 [theme 选项](option.theme.md)。