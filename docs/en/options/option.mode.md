# mode Option

| Option Name | Data Type | Default Value | Description |
| --- | --- | --- | --- |
| mode | string | 'full' | Layout mode |

## Usage

The `mode` parameter is used to control the layout of first-level child nodes in the mind map. jsMind provides two layout modes:

- `full`: Child nodes are dynamically distributed on both sides of the root node. This is the default layout mode, suitable for scenarios where nodes need to be evenly distributed.
- `side`: Child nodes are only distributed on the right side of the root node. This is suitable for scenarios where all child nodes need to be concentrated on one side.

It is important to note that the `mode` parameter only affects nodes added through the `add_node` method. If the `direction` parameter is specified when using the `add_node` method, the direction specified in the `direction` parameter will take precedence.

### Example Code

```html
<div id="jsmind_container"></div>
<script>
    var options = {
        container: 'jsmind_container',
        editable: true,
        theme: 'primary',
        mode: 'full', // Set layout mode to full
    };
    var mind = new jsMind(options);
</script>
```

### Notes

- **Effective When Adding Nodes**: The `mode` parameter only takes effect when adding nodes (`jsMind.add_node(...)`). This means that after setting this parameter, only new first-level child nodes will be arranged according to the specified layout mode.
- **Ignoring the `mode` Parameter**: When using the `add_node` method, if the `direction` parameter is specified, the `mode` parameter will be ignored. The `direction` parameter is used to specify the position of the node relative to its parent node and can be either `left` or `right`.

## Initial Layout

When constructing mind map data, you can set the position of nodes using the `direction` field in the data format. The `direction` field specifies the position of the node relative to its parent node, with common values being:

- `left`: The node is positioned to the left of the parent node.
- `right`: The node is positioned to the right of the parent node.

### Example Code (Initial Layout)

```html
<div id="jsmind_container"></div>
<script>
    var mind_data = {
        "meta": {
            "name": "example",
            "author": "jsMind",
            "version": "0.2"
        },
        "format": "node_tree",
        "data": {
            "id": "root",
            "topic": "Root",
            "children": [
                { "id": "sub1", "topic": "Sub1", "direction": "left" }, // Set child node on the left
                { "id": "sub2", "topic": "Sub2", "direction": "right" } // Set child node on the right
            ]
        }
    };

    var options = {
        container: 'jsmind_container',
        editable: true,
        theme: 'primary'
    };
    var mind = new jsMind(options);
    mind.show(mind_data);
</script>
```

## Related Article
- [How Nodes Are Layout](../advanced/layout.md)
