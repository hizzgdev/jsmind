# line_color Option

| Option Name | Data Type | Default Value | Description |
| --- | --- | --- | --- |
| line_color | string | #555 | The color of the mind map lines (HTML color notation) |

## Option Description

The `line_color` option is used to set the color of the lines connecting the nodes in the mind map. This option allows users to customize the appearance of the mind map to better suit individual or team needs. It is important to note that if a node has `data.leading-line-color` set, this option will be overridden. Additionally, the behavior of `line_color` can also be overridden by `custom_line_render`.

## Usage Example

Below is an example of setting the `line_color` option:

```javascript
var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary',
    mode: 'full',
    support_html: true,
    view: {
        line_color: '#FF0000', // Set the line color to red
        hmargin: 100,
        vmargin: 50
    }
};
```

In the example above, the `line_color` option is set to red (#FF0000). This setting will affect the color of the lines connecting the nodes in the mind map.

<img width="452" alt="line_color:#FF0000" src="https://github.com/hizzgdev/jsmind/assets/1690290/2ae28830-4aee-4c8d-b073-e3e07d33af3c">

## Related Options and Settings

### leading-line-color

If a node has `leading-line-color` attribute, the line color for that node to its parent will override the `line_color` option. For example:

```javascript
var mind = {
    "meta": {
        "name": "example",
        "author": "hizzgdev",
        "version": "0.2"
    },
    "format": "node_array",
    "data": [
        {"id": "root", "isroot": true, "topic": "jsMind Example"},
        {"id": "sub1", "parentid": "root", "topic": "Sub Node 1", "leading-line-color": "#00FF00"},
        {"id": "sub2", "parentid": "root", "topic": "Sub Node 2"}
    ]
};
```

In the example above, the line color for node `sub1` will be set to green (#00FF00) instead of the color set in the `line_color` option.

For more information, please refer to the document: [appearance](../advanced/appearance.md).

### custom_line_render

The `custom_line_render` option allows users to customize the rendering method of the mind map lines. With this option, users can have full control over the drawing process of the lines.

For more information, please refer to the [custom_line_render option](option.view.custom_line_render.md).