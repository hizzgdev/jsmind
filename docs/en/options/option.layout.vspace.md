# layout.vspace Option

| Option Name | Data Type | Default Value | Description |
| --- | --- | --- | --- |
| layout.vspace | number | 20 | Vertical space between nodes |

## Option Description

The `vspace` option is used to set the vertical spacing between nodes in the mind map. The default value for this option is 20 pixels..

## Usage Example

Below is an example of setting the `vspace` option:

```javascript
var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary',
    layout: {
        vspace: 40 // Set vertical spacing between nodes to 40 pixels
    }
};
```

In the above example, the `vspace` option is set to `40`, which means the vertical spacing between nodes in the mind map will be 40 pixels.

| vspace = 20 (default) | vspace = 40 |
| --- | --- |
| <img width="382" alt="image" src="https://github.com/hizzgdev/jsmind/assets/1690290/d549ada1-3ff0-4180-bbd8-46890843c9fd"> | <img width="387" alt="image" src="https://github.com/hizzgdev/jsmind/assets/1690290/a50fbd70-89c2-4b76-a1bb-a3cdb14b0056"> |
