# line_style Option

| Option Name | Data Type | Default Value | Description |
| --- | --- | --- | --- |
| line_style | string | curved | The style of the mind map lines, curved or straight |

## Option Description

The `line_style` option is used to set the style of the lines connecting the nodes in the mind map. This option supports the following two styles:

- `curved` - curved lines. This is the default value.
- `straight` - straight lines

## Usage Example

Below is an example of setting the `line_style` option:

```javascript
var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary',
    view: {
        line_style: 'straight', // Set the line style to straight
    }
};
```

In the example above, the `line_style` option is set to straight. This setting will affect the style of the lines connecting the nodes in the mind map.

<img width="399" alt="image" src="https://github.com/hizzgdev/jsmind/assets/1690290/a21f82c7-1913-4fe1-b854-4921ea55523d">

## Related Options and Settings

### custom_line_render

The `custom_line_render` option allows users to customize the rendering method of the mind map lines. With this option, users can have full control over the drawing process of the lines.

For more information, please refer to the [custom_line_render option](option.view.custom_line_render.md).
