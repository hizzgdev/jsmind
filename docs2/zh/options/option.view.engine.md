# engine 选项

**view.engine** : (string) 思维导图各节点之间线条的绘制引擎 [默认值: canvas]

## 选项说明

`view.engine` 选项用于指定思维导图各节点之间线条的绘制引擎。jsMind 目前支持两种绘制引擎：

- `canvas` - 将线条绘制在 canvas 上，这是默认值。
- `svg` - 使用 svg 绘制线条，当思维导图的节点很多，面积巨大的时候，使用该模式能带来显著的性能提升。

## 使用示例

以下是一个设置 `view.engine` 选项为 `svg` 的示例：

```javascript
var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary',
    mode: 'full',
    support_html: true,
    view: {
        engine: 'svg', // 使用 svg 绘制线条
        hmargin: 100,
        vmargin: 50,
        line_width: 2,
        line_color: '#555',
        line_style: 'curved'
    }
};
```

在上述示例中，`view.engine` 选项被设置为 `svg`，这意味着思维导图的线条将使用 svg 进行绘制，从而在节点数量多且面积大的情况下提升性能。

## 自定义线条渲染

如果需要自定义线条的渲染方法，可以使用 `view.custom_line_render` 选项。此选项接受一个函数作为参数，该函数的签名如下：

```javascript
function custom_line_render({ctx, start_point: {x, y}, end_point: {x, y}}) {
    // 自定义渲染逻辑
}
```

- `ctx` 是一个 canvas 上下文对象或一个标签名为 `path` 的 DOM 对象，具体取决于 `view.engine` 的值。
- `start_point` 和 `end_point` 是起始点和终点的坐标对象，包含 `x` 和 `y` 属性。

注意：如果你想要使用 `this` 对象，请不要使用箭头函数。

更多详细信息，请参见 [view.custom_line_render 的文档](option.view.custom_line_render.md)。