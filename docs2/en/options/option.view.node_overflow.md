# node_overflow Option

| Option Name | Data Type | Default Value | Description |
| --- | --- | --- | --- |
| node_overflow | string | 'hidden' | Style when node text is too long (Since 0.5.3) |

## Option Description

The `node_overflow` option is used to set the display style when the node text is too long. This option supports the following two styles:

- `hidden` - Hide part of them to maintain the overall readability of the mind map [default]
- `wrap` - Wrap the text to display the entire content

## Usage Example

Below is an example of setting the `node_overflow` option:

```javascript
var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary',
    mode: 'full',
    support_html: true,
    view: {
        node_overflow: 'wrap', // Set the node text to wrap when it is too long
        hmargin: 100,
        vmargin: 50
    }
};
```

In the example above, the `node_overflow` option is set to `wrap`. This setting will cause the node text to automatically wrap when it is too long.

| hidden (default) | wrap |
| --- | --- |
| <img width="596" alt="image" src="https://github.com/hizzgdev/jsmind/assets/1690290/8ddf09c6-9bfe-403a-93c5-7c71c0b94aad"> | <img width="619" alt="image" src="https://github.com/hizzgdev/jsmind/assets/1690290/6fbf8104-a7ed-4f25-993e-77fe1565b477"> |


## Related Options and Settings

### custom_node_render

The `custom_node_render` option allows users to customize the rendering method of the mind map nodes. With this option, users can have full control over the rendering process of the nodes.

For more information, please refer to the [custom_node_render option](option.view.custom_node_render.md).

### Themes

It should be noted that the `jmnode` style in custom themes may affect the effectiveness of the `node_overflow option`.

For more information, please refer to the [theme Option](option.theme.md)。
