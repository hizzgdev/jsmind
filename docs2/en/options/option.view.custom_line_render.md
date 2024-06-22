# view.custom_line_render Option

| Option Name | Data Type | Default Value | Description |
| --- | --- | --- | --- |
| custom_line_render | function | null | Custom line rendering method (Since 0.8.4) |

## Option Description

The `custom_line_render` option is an advanced feature that allows users to customize the rendering of lines between nodes in a mind map, providing more flexibility and personalized visual effects. The data type for this option is `function`, and the function should follow this signature:

```javascript
function custom_line_render({ctx, start_point: {x, y}, end_point: {x, y}}): void
```

- `ctx`: A canvas context object or a DOM object with the tag name `path`, depending on the value of `view.engine`.
    - when `view.engine` is set to `canvas`, `ctx` is a canvas context object;
    - when `view.engine` if set to `svg`, `ctx` is a DOM object with the tag name `path`.
- `start_point` and `end_point`: Coordinate objects for the start and end points, containing `x` and `y` properties.

## Usage Example

Here is an example of a custom line rendering method:

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
            ctx.strokeStyle = '#FF0000'; // Set line color to red
            ctx.lineWidth = 3; // Set line width to 3 pixels
            ctx.stroke();
        }
    }
};
```

In the example above, the custom line rendering method draws red straight lines between nodes with a line width of 3 pixels.

## Contributor

This option was contributed by [YttriumC](https://github.com/YttriumC), [YttriumC](https://github.com/YttriumC) also shared a [custom render method](https://github.com/hizzgdev/jsmind/discussions/608). Thanks!
