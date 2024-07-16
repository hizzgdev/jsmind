# layout.hspace Option

| Option Name | Data Type | Default Value | Description |
| --- | --- | --- | --- |
| layout.hspace | number | 30 | Horizontal spacing between nodes |

## Option Description

The `hspace` option is used to set the horizontal spacing between nodes in the mind map. The default value for this option is 30 pixels.

## Usage Example

Below is an example of setting the `hspace` option:

```javascript
var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary',
    mode: 'full',
    support_html: true,
    layout: {
        hspace: 60 // Set horizontal spacing between nodes to 60 pixels
    }
};
```

| hspace = 10 | hspace = 30 (default) | hspace = 60 |
| --- | --- | --- |
| <img width="358" alt="image" src="https://github.com/hizzgdev/jsmind/assets/1690290/667ff99d-2f65-43a1-9714-1088cfbdf7a8"> | <img width="373" alt="image" src="https://github.com/hizzgdev/jsmind/assets/1690290/45118a06-8683-4e53-92a2-ae255784afd1"> | <img width="442" alt="image" src="https://github.com/hizzgdev/jsmind/assets/1690290/89a2df73-a3dc-45b0-b3c9-1c22ad37a921"> |
