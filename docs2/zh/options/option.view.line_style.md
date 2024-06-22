# line_style 选项

| 选项名 | 数据类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| line_style | string | curved | 思维导图线条的样式，曲线或直线 |

## 选项说明

`line_style` 选项用于设置思维导图中各节点之间连线的样式。此选项支持以下两种样式：

- `curved` - 曲线，这是默认值。
- `straight` - 直线。

需要注意的是，`line_style` 的样式可以被 `custom_line_render` 所覆盖。

## 使用示例

以下是一个设置 `line_style` 选项的示例：

```javascript
var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary',
    view: {
        line_style: 'straight', // 设置线条样式为直线
    }
};
```

在上述示例中，`line_style` 选项被设置为直线（straight）。这个设置将影响思维导图中各节点之间连线的样式。

<img width="399" alt="image" src="https://github.com/hizzgdev/jsmind/assets/1690290/a21f82c7-1913-4fe1-b854-4921ea55523d">

## 相关选项和设置

### custom_line_render

`custom_line_render` 选项允许用户自定义思维导图线条的渲染方法。通过此选项，用户可以完全控制线条的绘制过程。

更多信息请参考 [custom_line_render 选项](option.view.custom_line_render.md)。
