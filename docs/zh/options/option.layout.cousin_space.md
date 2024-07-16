# layout.cousin_space 选项

| 选项名 | 数据类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| layout.cousin_space | number | 0 | 相邻节点子节点之间的额外垂直空间（从 0.5.5 版本开始支持） |

## 选项说明

`cousin_space` 选项用于设置相邻节点的子节点之间的额外垂直间距。此选项在 0.5.5 及以上版本中支持，默认值为零，即不添加额外的间距。

## 使用示例

以下是一个设置 `cousin_space` 选项的示例：

```javascript
var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary',
    layout: {
        cousin_space: 10 // 设置相邻节点的子节点之间的额外垂直间距为 10 像素
    }
};
```

在上述示例中，`cousin_space` 选项被设置为 `10`，这意味着相邻节点的子节点之间将会有额外的 10 像素的垂直间距。

| cousin_space = 0 (默认) | cousin_space = 10 | cousin_space = 50 |
| --- | --- | --- |
| <img alt="image" src="https://github.com/hizzgdev/jsmind/assets/1690290/dfff9a11-87aa-4e14-ae27-1f1a2c42b5d5"> | <img alt="image" src="https://github.com/hizzgdev/jsmind/assets/1690290/934f2c5c-10d5-4d32-94ad-7da7de04242e"> | <img alt="image" src="https://github.com/hizzgdev/jsmind/assets/1690290/cad19844-1f6a-4bd9-bf68-fb295d51d88e"> |
