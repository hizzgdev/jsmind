# shortcut.enable Option

| Option Name | Data Type | Default Value | Description |
| --- | --- | --- | --- |
| shortcut.enable | bool | true | Whether to enable keyboard shortcuts |

## Option Description

The `enable` option is used to control whether keyboard shortcuts can be used to edit or perform other operations on the mind map in the jsMind interface. The default value is `true`, which means shortcuts are enabled.

## Usage Example

Below is an example of setting the `enable` option:

```javascript
var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary',
    shortcut: {
        enable: false, // Disable keyboard shortcuts
        handles: {},
        mapping: {}
    }
};
```

In the above example, the `enable` option is set to `false`, which means all keyboard shortcuts will be disabled in the jsMind interface.

## Related Options and Settings

- **handles**: Named shortcut event handlers. jsMind provides some common handlers for operating the mind map. Users can define additional handlers. For more informationn: [shortcut.handles Option](option.shortcut.handles.md)
- **mapping**: Shortcut mapping configuration. Used to configure the correspondence between specific keys and handlers. Supports both single keys and combination keys. For more information: [shortcut.mapping Option](option.shortcut.mapping.md)
