# Custom Styles

When creating mind maps with jsMind, in addition to using built-in themes, you can also set individual styles for each node. 

## Supported Custom Styles

Currently, jsMind supports the following custom styles:

- `background-color`: Background color of the node, e.g., `#1abc9c`, `blue`
- `foreground-color`: Text color of the node, e.g., `#1abc9c`, `blue`
- `width`: Width of the node (px), e.g., `400`
- `height`: Height of the node (px), e.g., `400`
- `font-size`: Font size of the node text (px), e.g., `32`
- `font-weight`: Font weight of the node text, e.g., `bold`
- `font-style`: Font style of the node text, e.g., `italic`
- `background-image`: Background image of the node, can use URL, e.g., `http://fakeurl.com/fake-picture.png`, or data URL format, e.g., `data:image/png;base64,...`
- `background-rotation`: Rotation angle of the background image, e.g., `30`
- `leading-line-color`: Color of the leading line of the node, e.g., `#1abc9c`, `blue`

## Setting Methods

### Configuring via API

Add the above configurations in the `data` parameter.

```javascript
let data = {
    'width': 400,
    'leading-line-color': '#33ff33'
};
jm.add_node(parent_node, 'new_node_id', 'New Node', data);
```

### Configuring in Data Definition (Data File)

Add the above parameters to the `node` definition, for example:

```javascript
var mind = {
    format: 'node_tree',
    data: {
        id: 'root',
        topic: 'jsMind',
        children: [
            {
                'id': 'image-node',
                'background-image': 'http://fakeurl.com/fake-picture.png',
                'width': '100',
                'height': '100',
            }
        ]
    }
};
```
