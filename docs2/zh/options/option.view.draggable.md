# draggable 选项

**view.draggable** : (bool) 当容器不能完全容纳思维导图时，是否允许拖动画布代替鼠标滚动

## 选项说明

当思维导图不能在容器中完全显示时，默认情况下容器内会出现滚动条。开启此选项后，将允许通过拖拽画布的方式查看思维导图的不同部分。此参数默认值为 `false` (不开启此功能)。

## 使用示例

以下是一个启用 `draggable` 选项的示例：

```javascript
var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary',
    mode: 'full',
    support_html: true,
    view: {
        engine: 'canvas',
        draggable: true, // 启用拖动画布功能
        hide_scrollbars_when_draggable: true // 启用拖动时隐藏滚动条
    }
};
```

在上述示例中，`draggable` 选项被设置为 `true`，这意味着用户可以通过拖拽画布来查看思维导图的不同部分。同时，`hide_scrollbars_when_draggable` 选项也被设置为 `true`，这将隐藏滚动条。

## 注意事项

- `draggable` 选项仅在思维导图无法完全显示在容器内时生效。
- 当 `draggable` 选项为 `true` 时，可以通过设置 `hide_scrollbars_when_draggable` 选项来控制是否隐藏滚动条。
- 在触摸屏设备上不建议启用此选项，因为触摸屏上的拖动操作实际上等同于滚动条的拖动。