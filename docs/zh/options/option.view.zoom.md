# view.zoom 选项

| 选项名 | 数据类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| view.zoom | object | | （从 0.6.3 版本开始支持） |
| view.zoom.min | number | 0.5 | 最小缩放比例 |
| view.zoom.max | number | 2.1 | 最大缩放比例 |
| view.zoom.step | number | 0.1 | 缩放步长 |
| view.zoom.mask_key | number | 4096 | 启用缩放操作的功能键 |

## 选项说明

`zoom` 选项用于配置思维导图的缩放功能。通过设置最小和最大的缩放比例以及缩放的步长，用户可以灵活地调整思维导图的显示比例，以便更好地查看和编辑内容。

## 使用示例

以下是一个设置 `zoom` 选项的示例：

```javascript
var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary',
    view: {
        zoom: {
            min: 0.5, // 最小缩放比例
            max: 5.0, // 最大缩放比例
            step: 0.1, // 缩放步长
            mask_key: 4096 // Ctrl Key
        }
    }
};
```

在上述示例中，`zoom` 选项被设置为 `{ min: 0.5, max: 5.0, step: 0.1 }`。这个设置将允许用户将思维导图的缩放比例调整到 0.5 到 5.0 之间，每次缩放的步长为 0.1。
`mask_key` 设置为 4096，意思是我们需要按下 Ctrl 键才能用鼠标滚轮缩放思维导图，`mask_key` 是一个组合键，请参阅[组合按键](option.shortcut.mapping.md)来了解如何配置它。

## 如何进行缩放

在使用 jsMind 时，用户可以通过以下几种方式来缩放思维导图：

1. **使用键盘和鼠标**：按住键盘上的 [Ctrl] 键（通过 mask_key 参数设置），同时滚动鼠标滚轮，可以放大或缩小思维导图。
2. **使用触摸屏/触摸板**：在触摸屏设备上，用户可以通过双指捏合或张开来缩放思维导图。这种手势操作与在移动设备上查看图片的缩放方式类似。
