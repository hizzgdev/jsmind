# shortcut.handles Option

| Option Name | Data Type | Default Value | Description |
| --- | --- | --- | --- |
| shortcut.handles | object{string : function} | {} | Named shortcut event handlers |

## Option Description

The `handles` option is used to define named shortcut event handlers. jsMind provides some common handlers for operating the mind map. This option allows users to define additional handlers to implement custom shortcut operations. The `handles` option is a `string -> function(jsmind, event)` collection, where the `string` specifies the handler's name, and the `function` is the logic that the handler will execute.

## Built-in Handlers

jsMind provides some common handlers for operating the mind map, and the `handles` option provides the ability to add additional handlers. The default handlers provided by jsMind are:

- `addchild`: Add a child node
- `addbrother`: Add a sibling node
- `editnode`: Enter edit mode
- `delnode`: Delete a node
- `toggle`: Expand/Collapse a node
- `left`: Select the node on the left
- `up`: Select the node above
- `right`: Select the node on the right
- `down`: Select the node below

## Usage Example

Below is an example of setting the `handles` option:

```javascript
var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary',
    shortcut: {
        enable: true,
        handles: {
            'dosomething': function(jm, e) {
                // Perform some operations
                console.log('do something');
            },
            'dosomeotherthing': function(jm, e) {
                // Perform other operations
                console.log('do some other things');
            }
        },
        mapping: {
            addchild: [45, 4096 + 13], // <Insert>, <Ctrl> + <Enter>
            addbrother: 13, // <Enter>
            editnode: 113, // <F2>
            delnode: 46, // <Delete>
            toggle: 32, // <Space>
            left: 37, // <Left>
            up: 38, // <Up>
            right: 39, // <Right>
            down: 40, // <Down>
            dosomething: 112, // <F1>
            dosomeotherthing: 113 // <F2>
        }
    }
};
```

In the above example, two custom handlers `dosomething` and `dosomeotherthing` are defined and mapped to the `F1` and `F2` keys, respectively.

## Related Options and Settings

- **enable**: Whether to enable keyboard shortcuts, default value is `true`. For more information: [shortcut.enable Option](option.shortcut.enable.md)
- **mapping**: Shortcut mapping configuration, used to configure the correspondence between specific keys and handlers. Supports both single keys and combination keys. For more information: [shortcut.mapping Option](option.shortcut.mapping.md)
