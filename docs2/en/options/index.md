# jsMind Supported Options

jsMind provides various options to customize the behavior and appearance of mind maps.

## General Options

| Option Name   | Data Type | Default Value | Description                                      | Details                                      |
| ------------- | --------- | ------------- | ------------------------------------------------ | -------------------------------------------- |
| container     | string    | ''            | [Required] ID of the container                   | [Details](option.container.md)       |
| editable      | bool      | false         | Whether editing is enabled                       | [Details](option.editable.md)        |
| log_level     | string    | 'info'        | Log level                                        | [Details](option.log_level.md)       |
| mode          | string    | 'full'        | Layout mode                                      | [Details](option.mode.md)            |
| support_html  | bool      | true          | Whether HTML elements in nodes are supported     | [Details](option.support_html.md)    |
| theme         | string    | null          | Theme                                            | [Details](option.theme.md)           |

## View Options

| Option Name                | Data Type | Default Value | Description                                      | Details                                      |
| -------------------------- | --------- | ------------- | ------------------------------------------------ | -------------------------------------------- |
| custom_line_render         | function  | null          | Custom line rendering method (Since 0.8.4)       | [Details](option.view.custom_line_render.md) |
| custom_node_render         | function  | null          | Custom node rendering method (Since 0.7.6) | [Details](option.view.custom_node_render.md) |
| draggable                  | bool      | false         | Whether dragging the canvas is allowed           | [Details](option.view.draggable.md)          |
| enable_device_pixel_ratio  | bool      | false         | Render high-definition mind maps according to device pixel ratio (Since 0.8.5) | [Details](option.view.enable_device_pixel_ratio.md) |
| engine                     | string    | 'canvas'      | Rendering engine for lines between nodes         | [Details](option.view.engine.md)             |
| expander_style             | string    | 'char'        | Style of the child node expander (Since 0.7.8) | [Details](option.view.expander_style.md)     |
| hide_scrollbars_when_draggable | bool  | false         | Whether to hide scrollbars when draggable is true | [Details](option.view.hide_scrollbars_when_draggable.md) |
| hmargin                    | number    | Container's width | Minimum horizontal distance between the mind map and the container's outer frame (in pixels) | [Details](option.view.hmargin.vmargin.md)            |
| line_color                 | string    | '#555'        | The color of the mind map lines (HTML color notation) | [Details](option.view.line_color.md)         |
| line_style                 | string    | 'curved'      | The style of the mind map lines, curved or straight | [Details](option.view.line_style.md)         |
| line_width                 | number    | 2             | The thickness of the mind map lines (in pixels) | [Details](option.view.line_width.md)         |
| node_overflow              | string    | 'hidden'      | Style when node text is too long (Since 0.5.3) | [Details](option.view.node_overflow.md)      |
| vmargin                    | number    | Container's height | Minimum vertical distance between the mind map and the container's outer frame (in pixels)| [Details](option.view.hmargin.vmargin.md)            |
| zoom                       | object    | `{min: 0.5, max: 2.1, step: 0.1}` | Zoom configuration (Since 0.6.3) | [Details](option.view.zoom.md)               |

## Layout Options

| Option Name   | Data Type | Default Value | Description                                      | Details                                      |
| ------------- | --------- | ------------- | ------------------------------------------------ | -------------------------------------------- |
| cousin_space  | number    | 0             | Extra vertical space between adjacent nodes' children (Since 0.5.5) | [Details](option.layout.cousin_space.md)    |
| hspace        | number    | 30            | Horizontal space between nodes                   | [Details](option.layout.hspace.md)           |
| pspace        | number    | 13            | Horizontal space between nodes and connection lines | [Details](option.layout.pspace.md)          |
| vspace        | number    | 20            | Vertical space between nodes                     | [Details](option.layout.vspace.md)           |

## Shortcut Options

| Option Name   | Data Type | Default Value | Description                                      | Details                                      |
| ------------- | --------- | ------------- | ------------------------------------------------ | -------------------------------------------- |
| enable        | bool      | true          | Whether shortcuts are enabled                    | [Details](option.shortcut.enable.md)         |
| handles       | object    | `{}`            | Named shortcut event handlers                    | [Details](option.shortcut.handles.md)        |
| mapping       | object    | `{addchild: [45, 4096 + 13], addbrother: 13, editnode: 113, delnode: 46, toggle: 32, left: 37, up: 38, right: 39, down: 40}` | Shortcut mappings | [Details](option.shortcut.mapping.md) |

## Plugin Options

| Option Name   | Data Type | Default Value | Description                                      | Details                                      |
| ------------- | --------- | ------------- | ------------------------------------------------ | -------------------------------------------- |
| plugin        | object    | `{}`            | Options for plugins                              | [Details](option.plugin.md)           |


## Default Options Code

```javascript
options = {
    container: '', // [Required] ID of the container
    editable: false, // Whether editing is enabled
    theme: null, // Theme
    mode: 'full', // Layout mode
    support_html: true, // Whether HTML elements in nodes are supported
    log_level: 'info', // Log level
    view: {
        engine: 'canvas', // Rendering engine for lines between nodes
        hmargin: 100, // Minimum horizontal distance from the container
        vmargin: 50, // Minimum vertical distance from the container
        line_width: 2, // Width of the lines
        line_color: '#555', // Color of the lines
        line_style: 'curved', // Style of the lines, straight or curved
        custom_line_render: null, // Custom line rendering method
        draggable: false, // Whether dragging the canvas is allowed
        hide_scrollbars_when_draggable: false, // Whether to hide scrollbars when draggable is true
        node_overflow: 'hidden', // Style when node text is too long
        enable_device_pixel_ratio: false, // Render high-definition mind maps according to device pixel ratio
        expander_style: 'char', // Style of the child node expander
        zoom: { // Zoom configuration
            min: 0.5, // Minimum zoom ratio
            max: 2.1, // Maximum zoom ratio
            step: 0.1, // Zoom ratio step
        },
        custom_node_render: null, // Custom node rendering method
    },
    layout: {
        hspace: 30, // Horizontal space between nodes
        vspace: 20, // Vertical space between nodes
        pspace: 13, // Horizontal space between nodes and connection lines
        cousin_space: 0, // Extra vertical space between adjacent nodes' children
    },
    shortcut: {
        enable: true, // Whether shortcuts are enabled
        handles: {}, // Named shortcut event handlers
        mapping: { // Shortcut mappings
            addchild: [45, 4096 + 13], // <Insert>, <Ctrl> + <Enter>
            addbrother: 13, // <Enter>
            editnode: 113, // <F2>
            delnode: 46, // <Delete>
            toggle: 32, // <Space>
            left: 37, // <Left>
            up: 38, // <Up>
            right: 39, // <Right>
            down: 40, // <Down>
        }
    },
    plugin: {}, // Options for plugins
};
```