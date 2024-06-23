# line_width Option

| Option Name | Data Type | Default Value | Description |
| --- | --- | --- | --- |
| line_width | number | 2 | The thickness of the mind map lines (in pixels) |

## Option Description

The `line_width` option is used to set the thickness of the lines connecting the nodes in the mind map.

It is important to note that the behavior of `line_width` can be overridden by `custom_line_render`.

## Usage Example

Below is an example of setting the `line_width` option:

```javascript
var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary',
    view: {
        line_width: 4, // Set the line thickness to 4 pixels
    }
};
```

In the example above, the `line_width` option is set to 4 pixels. This setting will affect the thickness of the lines connecting the nodes in the mind map.

<img width="401" alt="image" src="https://github.com/hizzgdev/jsmind/assets/1690290/e9bb5035-92e2-41a5-8b43-4d23f63591e4">

## Related Options and Settings

### custom_line_render

The `custom_line_render` option allows users to customize the rendering method of the mind map lines. With this option, users can have full control over the drawing process of the lines.

For more information, please refer to the [custom_line_render option](option.view.custom_line_render.md).