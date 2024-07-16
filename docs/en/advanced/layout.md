# How Nodes Are Layout

When using jsMind to render mind maps, the first-level child nodes can be placed either on the left or right side of the root node, while the positions of nodes at other levels are determined by their parent nodes. The specific placement of first-level child nodes falls into the following two cases.

## Nodes in the Initial Data

When constructing the initial data for the mind map, the `direction` field can be used to specify the position of the first-level nodes relative to the root node. The values for the `direction` field are:

- `left`: The node is placed on the left side of the root node.
- `right`: The node is placed on the right side of the root node.

If the `direction` field is not specified, the first-level node will be placed on the right side of the root node.

### Example Code

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
                { "id": "sub1", "topic": "Sub1", "direction": "left" }, // Place the new node on the left
                { "id": "sub2", "topic": "Sub2" }  // Not specified, the node will be placed on the right
            ]
        }
    };

    var options = {
        container: 'jsmind_container',
        editable: true,
        theme: 'primary',
        mode: 'full', // Set layout mode to full
    };
    var mind = new jsMind(options);
    mind.show(mind_data);
</script>
```

## New Nodes Added By API

When dynamically adding first-level child nodes using the `add_node` method, you can specify their position with the `direction` parameter. The `direction` parameter can also be set to either `left` or `right`.

If the `direction` parameter is not specified, the position of the node will be determined by the [`mode` option](../options/option.mode.md). The `mode` option has two possible values:

- `full`: jsMind will place the node dynamically based on the number of left and right child nodes. This is the default layout mode, suitable for scenarios where nodes need to be evenly distributed.
- `side`: jsMind will place the node on the right side of the root node. This mode is suitable for scenarios where all child nodes need to be concentrated on one side.

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
    mind.show();

    // Specify the direction
    mind.add_node('root', 'sub1', 'Sub1', {}, 'left'); // Place the new node on the left
    mind.add_node('root', 'sub2', 'Sub2'); // Not specified, the will be placed automatically
</script>
```
