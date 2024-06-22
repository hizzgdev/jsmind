# enable_device_pixel_ratio 选项

**view.enable_device_pixel_ratio** : (bool) 按设备像素比例绘制高清思维导图。 (0.8.5 及以上版本支持)

## 选项说明

`enable_device_pixel_ratio` 选项用于在绘制思维导图时，根据设备的像素比例来提升画面的清晰度。此选项仅在使用 `canvas` 作为绘制引擎时有效。此选项的默认值为 `false`。当启用此选项后，思维导图的线条和节点将会更加清晰，特别是在高分辨率屏幕上效果更为显著。

## 使用示例

以下是一个启用 `enable_device_pixel_ratio` 选项的示例：

```javascript
var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary',
    view: {
        engine: 'canvas',
        enable_device_pixel_ratio: true // 启用按设备像素比例绘制高清思维导图
    }
};
```

在上述示例中，`enable_device_pixel_ratio` 选项被设置为 `true`，这意味着思维导图将根据设备的像素比例进行高清绘制。

## 启用该选项的风险

启用 `enable_device_pixel_ratio` 选项后，思维导图的清晰度会显著提升，但也会带来一些潜在的风险。绘制高清思维导图的原理是先将画布设置得更大，然后再缩小至需要的大小，这样视觉上的每个像素实际上是由多个像素共同呈现的，从而使得图形的边缘更加清晰。详细介绍可阅读 [MDN web docs 里的 devicePixelRatio](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio)。

然而，浏览器对 `canvas` 的支持是有限的，当画布的尺寸超过一定的大小时，浏览器可能无法正常显示。例如，Chrome 浏览器上能正常支持的画布大小约为 16,384 x 16,384 (268,435,456 个像素点)，超过这个尺寸后，Chrome 在渲染这个 `canvas` 时就会失败。具体内容参考这个文档：[Canvas Size Limits](https://jhildenbiddle.github.io/canvas-size/#/?id=test-results)。

因此，如果 `jsMind` 的 `view.engine` 选项设置为 `canvas`（默认值就是 `canvas`），过大的思维导图可能在 `jsMind` 中也无法正常呈现。当启用 `enable_device_pixel_ratio` 这个选项后，这个问题可能会变得更容易出现。例如，在未启用这个选项时，一个非常大的思维导图需要 10,000 x 10,000 尺寸的画布，这样的话 Chrome 浏览器能正常显示它；当启用了这个选项时，假设 `device_pixel_ratio` 的值为 2，那么当思维导图的大小超过 9,000 x 9,000 时，Chrome 浏览器就显示不出来了，因为我们实际创建的画布是 (9,000 * 2) x (9,000 * 2)。

要解决这个问题其实也很简单，把 `view.engine` 换成 `svg` 就好了，请参见 [view.engine 选项](option.view.engine.md)。
