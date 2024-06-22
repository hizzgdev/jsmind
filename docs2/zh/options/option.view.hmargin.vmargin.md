# hmargin 与 vmargin 选项

| 选项名 | 数据类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| hmargin | number | 容器的宽度 | 思维导图距容器外框的最小水平距离（像素） |
| vmargin | number | 容器的高度 | 思维导图距容器外框的最小垂直距离（像素） |

## 选项说明

`hmargin` 和 `vmargin` 选项用于设置思维导图距容器外框的最小水平距离和最小垂直距离。这两个参数决定了思维导图与容器的边框能距离多近。把思维导图本身作为一个对象的话，这两个参数就类似该对象的 margin(css) 属性。

## 使用示例

以下是一个设置 `hmargin` 和 `vmargin` 选项的示例：

```javascript
var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary',
    view: {
        hmargin: 100, // 设置思维导图距容器外框的最小水平距离为 100 像素
        vmargin: 50,  // 设置思维导图距容器外框的最小垂直距离为 50 像素
    }
};
```

在上述示例中，`hmargin` 选项被设置为 100 像素，`vmargin` 选项被设置为 50 像素。这意味着思维导图与容器的水平距离最小为 100 像素，垂直距离最小为 50 像素。
