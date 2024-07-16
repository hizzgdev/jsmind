# layout.vspace 选项

| 选项名 | 数据类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| layout.vspace | number | 20 | 节点之间的垂直空间 |

## 选项说明

`vspace` 选项用于设置思维导图中节点之间的垂直间距。此选项的默认值为 20 像素。

## 使用示例

以下是一个设置 `vspace` 选项的示例：

```javascript
var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary',
    layout: {
        vspace: 40 // 设置节点之间的垂直间距为 40 像素
    }
};
```

在上述示例中，`vspace` 选项被设置为 `40`，这意味着思维导图中节点之间的垂直间距将会是 40 像素。

| vspace = 20 (默认) | vspace = 40 |
| --- | --- |
| <img width="382" alt="image" src="https://github.com/hizzgdev/jsmind/assets/1690290/d549ada1-3ff0-4180-bbd8-46890843c9fd"> | <img width="387" alt="image" src="https://github.com/hizzgdev/jsmind/assets/1690290/a50fbd70-89c2-4b76-a1bb-a3cdb14b0056"> |
