# engine Option

| Option Name | Data Type | Default Value | Description |
| --- | --- | --- | --- |
| engine | string | 'canvas' | Rendering engine for lines between nodes |

## Option Description

The `view.engine` option is used to specify the rendering engine for drawing lines between nodes in the mind map. jsMind currently supports two rendering engines:

- `canvas` - Draws lines on a canvas, which is the default value.
- `svg` - Uses SVG to draw lines, which can significantly improve performance when the mind map has many nodes and covers a large area.

## Usage Example

Below is an example of setting the `view.engine` option to `svg`:

```javascript
var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary',
    mode: 'full',
    support_html: true,
    view: {
        engine: 'svg', // Use SVG to draw lines
    }
};
```

In the example above, the `view.engine` option is set to `svg`, which means the lines in the mind map will be drawn using SVG, thus improving performance when there are many nodes and a large area.

## Custom Line Rendering

If you need to customize the line rendering method, you can use the `view.custom_line_render` option. For more detailed information, please refer to the [view.custom_line_render Option](option.view.custom_line_render.md).