# view.line_width 选项

| 选项名 | 数据类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| view.line_width | number | 2 | 思维导图线条的粗细（像素） |

## 选项说明

`line_width` 选项用于设置思维导图中各节点之间连线的粗细。

需要注意的是，`line_width` 的行为可以被 `custom_line_render` 所覆盖。

## 使用示例

以下是一个设置 `line_width` 选项的示例：

```javascript
var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary',
    view: {
        line_width: 4, // 设置线条粗细为4像素
    }
};
```

在上述示例中，`line_width` 选项被设置为4像素。这个设置将影响思维导图中各节点之间连线的粗细。

<img width="401" alt="image" src="https://github.com/hizzgdev/jsmind/assets/1690290/e9bb5035-92e2-41a5-8b43-4d23f63591e4">

## 相关选项和设置

### custom_line_render

`custom_line_render` 选项允许用户自定义思维导图线条的渲染方法。通过此选项，用户可以完全控制线条的绘制过程。

更多信息请参考 [custom_line_render 选项](option.view.custom_line_render.md)。
