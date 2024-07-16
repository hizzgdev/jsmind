# 自定义样式指南

在使用 jsMind 创建思维导图时，除了可以使用内置的主题外，还可以为每一个节点设置单独的样式。

## 支持的自定义样式

目前 jsMind 支持以下自定义样式：

- `background-color`: 节点的背景颜色，如 `#1abc9c`, `blue`
- `foreground-color`: 节点的文本颜色，如 `#1abc9c`, `blue`
- `width`: 节点的宽度(px)，如 `400`
- `height`: 节点的高度(px)，如 `400`
- `font-size`: 节点的文本字体大小(px)，如 `32`
- `font-weight`: 节点的文本重量，如 `bold`
- `font-style`: 节点的文本样式，如 `italic`
- `background-image`: 节点的背景图片，可使用 URL，如 `http://fakeurl.com/fake-picture.png`，或 data URL 形式，如 `data:image/png;base64,...`
- `background-rotation`: 节点的背景图片旋转角度，如 `30`
- `leading-line-color`: 节点的引导线颜色，如 `#1abc9c`, `blue`

## 设置方法

### 通过 API 配置

在 `data` 参数里添加上述配置即可。

```javascript
let data = {
    'width': 400,
    'leading-line-color': '#33ff33'
};
jm.add_node(parent_node, 'new_node_id', 'New Node', data);
```

### 在数据定义(数据文件)中配置

把上述参数添加到 `node` 的定义中即可，如：

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
