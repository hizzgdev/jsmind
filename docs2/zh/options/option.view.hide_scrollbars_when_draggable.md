# hide_scrollbars_when_draggable 选项

| 选项名 | 数据类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| hide_scrollbars_when_draggable | bool | false | 当 draggable 为 true 时是否隐藏滚动条 |

## 选项说明

`view.hide_scrollbars_when_draggable` 选项用于设置当 [`view.draggable`](option.view.draggable.md) 选项为 `true` 时，是否隐藏容器内的滚动条。此选项的默认值为 `false`，即显示滚动条。当设置为 `true` 时，容器内的滚动条将会被隐藏，用户无法通过滚动鼠标滚轮的方式查看思维导图的不同部分。

## 使用示例

以下是一个设置 `view.hide_scrollbars_when_draggable` 选项为 `true` 的示例：

```javascript
var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary',
    view: {
        draggable: true, // 允许拖动画布
        hide_scrollbars_when_draggable: true, // 隐藏滚动条
    }
};
```

在上述示例中，`view.draggable` 选项被设置为 `true`，允许用户通过拖动画布的方式查看思维导图的不同部分。同时，`view.hide_scrollbars_when_draggable` 选项被设置为 `true`，隐藏了容器内的滚动条。
