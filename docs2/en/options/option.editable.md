# editable Option

**editable** : (bool) Whether to enable editing

## Usage

The `editable` option in jsMind determines whether users can edit the mind map. When set to `true`, users can add, delete, and modify nodes directly in the mind map interface. If set to `false`, the mind map will be in read-only mode, and users will not be able to make any changes.

### Example Code

```html
<div id="jsmind_container"></div>
<script>
    var options = {
        container: 'jsmind_container',
        editable: true, // Enable editing
        theme: 'primary',
    };
    var mind = new jsMind(options);
</script>
```

### Notes

- **User Interaction**: When `editable` is set to `true`, users can interact with the mind map by adding new nodes, deleting existing nodes, and editing node content. This is useful for applications where users need to dynamically create or modify the mind map.
- **Read-Only Mode**: If you want to display a mind map that does not allow any modifications, you can set `editable` to `false`. This is useful for scenarios where static information needs to be displayed without user interaction.

### Example Code for Read-Only Mode

```html
<div id="jsmind_container"></div>
<script>
    var options = {
        container: 'jsmind_container',
        editable: false, // Disable editing
        theme: 'primary',
    };
    var mind = new jsMind(options);
</script>
```

## Dynamically Enabling or Disabling Editing

When using jsMind, there are times when you need to dynamically enable or disable the editing functionality of the mind map based on specific conditions. jsMind provides the `enable_edit` and `disable_edit` API methods to achieve this. Additionally, there are `begin_edit` and `end_edit` methods to control the editing state of nodes.

### Enabling Editing

The `jm.enable_edit()` method can be used to enable the editing functionality of the current mind map. Once enabled, users can add, delete, and modify nodes.

#### Example Code

```html
<div id="jsmind_container"></div>
<script>
    var options = {
        container: 'jsmind_container',
        editable: false, // Initially not editable
        theme: 'primary',
    };
    var mind = new jsMind(options);

    // Enable editing
    mind.enable_edit();
</script>
```

### Disabling Editing

The `jm.disable_edit()` method can be used to disable the editing functionality of the current mind map. Once disabled, users will not be able to make any modifications to the mind map.

#### Example Code

```html
<div id="jsmind_container"></div>
<script>
    var options = {
        container: 'jsmind_container',
        editable: true, // Initially editable
        theme: 'primary',
    };
    var mind = new jsMind(options);

    // Disable editing
    mind.disable_edit();
</script>
```

## Editing Nodes

- **Begin Editing a Node**: The `jm.begin_edit(node)` method can be used to set a specified node to the editing state. Users can directly modify the node content in the interface.
- **End Editing a Node**: The `jm.end_edit()` method can be used to set the currently editing node back to the read-only state.

### Example Code

```html
<div id="jsmind_container"></div>
<script>
    var options = {
        container: 'jsmind_container',
        editable: true,
        theme: 'primary',
    };
    var mind = new jsMind(options);

    // Begin editing a node
    var node = mind.get_selected_node();
    if (node) {
        mind.begin_edit(node);
    }

    // End editing a node
    mind.end_edit();
</script>
```

By using these API methods, you can flexibly control the editing state of the mind map to meet the needs of different scenarios. Detailed usage of the API methods will be further introduced in the related documentation.