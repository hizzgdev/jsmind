# view.custom_node_render Option

| Option Name | Data Type | Default Value | Description |
| --- | --- | --- | --- |
| custom_node_render | function | null | Custom node rendering method (Since 0.7.6) |

## Option Description

The `custom_node_render` option allows users to customize the rendering method of nodes in the mind map. By setting this option, users can fully control the drawing logic of the nodes, achieving more flexible and personalized visual effects. The data type for this option is `function`, and the function should follow this signature:

```javascript
function custom_node_render(jm, element, node): boolean
```

- `jm`: The jsMind instance object.
- `element`: A DOM element representing the HTML container of the node.
- `node`: An object containing the node data.

The return value indicates whether the node has been rendered:
- If it returns `true`, jsMind will not render this node again.
- If it returns `false`, jsMind will use the default rendering logic to render this node.

### Usage Example

Below is an example of a custom node rendering method:

```javascript
var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary',
    mode: 'full',
    support_html: true,
    view: {
        engine: 'canvas',
        custom_node_render: function(jm, element, node) {
            let emoji = pickRandomEmoji();
            element.innerHTML = `<img src="${emoji}">${node.topic}`;
            return true; // Indicate that this node has been rendered
        }
    }
};
```

### Notes

- Ensure that the custom rendering method does not break the basic functionality of the node, such as dragging and zooming.
- Do not use asynchronous DOM models to implement this method, as it will cause layout errors. Relevant discussion can be found [here](https://github.com/hizzgdev/jsmind/discussions/607).
