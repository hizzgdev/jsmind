# view.custom_line_render 选项

| 选项名 | 数据类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| view.custom_line_render | function | null | 自定义线条渲染方法（从 0.8.4 版本开始支持） |

## 选项说明

`custom_line_render` 是一个高级选项，允许用户自定义思维导图中节点之间的线条渲染方法，从而实现更灵活和个性化的视觉效果。该选项的数据类型为 `function`，其签名为：

```javascript
function custom_line_render({ctx, start_point: {x, y}, end_point: {x, y}}): void
```

- `ctx`：一个 canvas 上下文对象或一个标签名为 `path` 的 DOM 对象，具体取决于 `view.engine` 的值。
    - 当 `view.engine` 设置为 `canvas` 时，则 `ctx` 是一个 canvas 上下文对象；
    - 当 `view.engine` 设置为 `svg` 时，则 `ctx` 是一个标签名为 `path` 的 DOM 对象。
- `start_point` 和 `end_point`：起始点和终点的坐标对象，包含 `x` 和 `y` 属性。

## 使用示例

以下是一个自定义线条渲染方法的示例：

```javascript
var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary',
    support_html: true,
    view: {
        engine: 'canvas',
        custom_line_render: function({ctx, start_point, end_point}) {
            ctx.beginPath();
            ctx.moveTo(start_point.x, start_point.y);
            ctx.lineTo(end_point.x, end_point.y);
            ctx.strokeStyle = '#FF0000'; // 设置线条颜色为红色
            ctx.lineWidth = 3; // 设置线条宽度为3像素
            ctx.stroke();
        }
    }
};
```

在上述示例中，自定义的线条渲染方法将节点之间的线条绘制为红色的直线，并且线条宽度为 3 像素。

## 贡献者

该参数是由 [YttriumC](https://github.com/YttriumC) 贡献，[YttriumC](https://github.com/YttriumC) 还提供了[一个不同的线型](https://github.com/hizzgdev/jsmind/discussions/608)。在此表示感谢。
