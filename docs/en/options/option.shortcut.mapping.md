# shortcut.mapping Option

| Option Name | Data Type | Default Value | Description |
| --- | --- | --- | --- |
| shortcut.mapping | object{string : number \| [number]} | {} | Shortcut mapping configuration |

## Option Description

The `mapping` option is used to configure the correspondence between specific keys and handlers. Through this option, users can map specific keyboard keys to corresponding handlers to achieve shortcut operations. jsMind provides some default shortcut mappings and supports user-defined mappings for both single keys and combination keys.

## Usage Example

Below is an example of setting the `mapping` option:

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

In the above example, multiple shortcut mappings are defined, binding specific keyboard keys to handlers. For example, the `<Insert>` key and the `<Ctrl> + <Enter>` key are mapped to the `addchild` handler.

## Related Options and Settings

- **enable**: Whether to enable keyboard shortcuts, default value is `true`. For more information: [shortcut.enable Option](option.shortcut.enable.md)
- **handles**: Named shortcut event handlers, used to define additional handlers to implement custom shortcut operations. For more information: [shortcut.handles Option](option.shortcut.handles.md)

## Combination Keys

In addition to single keys, jsMind also supports combination keys. The code for combination shortcuts is the code for regular keys plus the identifier code for function keys. The supported function keys and their identifier codes are as follows:

- Meta: 8192
- Ctrl: 4096
- ALT: 2048
- SHIFT: 1024

Here are some examples of combination keys:

```javascript
var options = {
    shortcut: {
        mapping: {
            addchild: 4096 + 73, // <Ctrl> + <I>
            delnode: 4096 + 2048 + 68 // <Ctrl> + <ALT> + <D>
        }
    }
};
```

## Multiple Shortcut Mappings

jsMind supports configuring multiple shortcuts for a single handler. Simply replace the key code with an array. Below is an example of multiple shortcut mappings:

```javascript
var options = {
    shortcut: {
        mapping: {
            addchild: [45, 4096 + 13], // <Insert>, <Ctrl> + <Enter>
            delnode: [46, 4096 + 68] // <Delete>, <Ctrl> + <D>
        }
    }
};
```

In the above example, the `addchild` handler is mapped to both the `<Insert>` key and the `<Ctrl> + <Enter>` key, and the `delnode` handler is mapped to both the `<Delete>` key and the `<Ctrl> + <D>` key.
