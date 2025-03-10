# view.zoom Option

| Option Name | Data Type | Default Value | Description |
| --- | --- | --- | --- |
| view.zoom | object | | (Since 0.6.3) |
| view.zoom.min | number | 0.5 | Minimum zoom ratio |
| view.zoom.max | number | 2.1 | Maximum zoom ratio |
| view.zoom.step | number | 0.1 | Zoom step |
| view.zoom.mask_key | number | 4096 | Function key to enable this function |

## Option Description

The `zoom` option is used to configure the zoom functionality of the mind map. By setting the minimum and maximum zoom ratios and the zoom step, users can flexibly adjust the display ratio of the mind map for better viewing and editing.

## Usage Example

Below is an example of setting the `zoom` option:

```javascript
var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary',
    view: {
        zoom: {
            min: 0.5, // Minimum zoom ratio
            max: 5.0, // Maximum zoom ratio
            step: 0.1, // Zoom step
            mask_key: 4096 // Ctrl key
        }
    }
};
```

In the above example, the `zoom` option is set to `{ min: 0.5, max: 5.0, step: 0.1 }`. This setting allows users to adjust the zoom ratio of the mind map between 0.5 and 5.0, with a zoom step of 0.1.
The `mask_key` is 4096, which means we have to press the Ctrl key to zoom the mindmap with the mouse wheel, `mask_key` is a key combination. refer to [Combination Keys](option.shortcut.mapping.md) to learn how to configure it.

## How to Zoom

When using jsMind, users can zoom the mind map in the following ways:

1. **Using Keyboard and Mouse**: Hold down the [Ctrl] key (configured by `mask_key`) on the keyboard and scroll the mouse wheel to zoom in or out of the mind map.
2. **Using Touch Screen/Touch panel**: On touch screen devices, users can pinch or spread two fingers to zoom the mind map. This gesture is similar to the zooming method used for viewing images on mobile devices.
