# enable_device_pixel_ratio Option

| Option Name | Data Type | Default Value | Description |
| --- | --- | --- | --- |
| enable_device_pixel_ratio | bool | false | Render high-definition mind maps according to device pixel ratio (Since 0.8.5) |

## Option Description

The `enable_device_pixel_ratio` option is used to enhance the clarity of the mind map by rendering it according to the device's pixel ratio. This option is only effective when using `canvas` as the rendering engine. The default value of this option is `false`. When enabled, the lines and nodes of the mind map will be clearer, especially on high-resolution screens.

## Usage Example

Below is an example of enabling the `enable_device_pixel_ratio` option:

```javascript
var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary',
    view: {
        engine: 'canvas',
        enable_device_pixel_ratio: true // Enable high-definition mind map rendering according to device pixel ratio
    }
};
```

In the example above, the `enable_device_pixel_ratio` option is set to `true`, which means the mind map will be rendered in high definition according to the device's pixel ratio.

## Risks of Enabling This Option

Enabling the `enable_device_pixel_ratio` option significantly enhances the clarity of the mind map but also introduces some potential risks. The principle behind rendering high-definition mind maps is to first set the canvas larger and then scale it down to the required size. This way, each visual pixel is actually composed of multiple pixels, making the edges of the graphics appear clearer. For a detailed explanation, you can refer to the [MDN web docs on devicePixelRatio](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio).

However, browser support for `canvas` is limited. When the canvas size exceeds a certain limit, the browser may not display it correctly. For example, Chrome can support a canvas size of approximately 16,384 x 16,384 (268,435,456 pixels). Beyond this size, Chrome will fail to render the canvas. For more details, refer to this document: [Canvas Size Limits](https://jhildenbiddle.github.io/canvas-size/#/?id=test-results).

Therefore, if the `view.engine` option in `jsMind` is set to `canvas` (which is the default value), very large mind maps may not be displayed correctly in `jsMind`. When the `enable_device_pixel_ratio` option is enabled, this issue may become more pronounced. For example, without this option enabled, a very large mind map might require a canvas size of 10,000 x 10,000, which Chrome can display correctly. However, if this option is enabled and the `device_pixel_ratio` is 2, then when the mind map size exceeds 9,000 x 9,000, Chrome will fail to display it because the actual canvas created is (9,000 * 2) x (9,000 * 2).

To solve this issue, simply change the `view.engine` to `svg`. For more details, refer to the [view.engine Option](option.view.engine.md).