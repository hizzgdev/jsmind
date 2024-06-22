# line_color 选项

| 选项名 | 数据类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| line_color | string | #555 | 思维导图线条的颜色（HTML颜色表示方法） |

## 选项说明

`line_color` 选项用于设置思维导图中各节点之间连线的颜色。此选项可以帮助用户自定义思维导图的外观，使其更符合个人或团队的需求。需要注意的是，如果一个节点设置了 `data.leading-line-color`，此选项将会被覆盖。此外，`line_color` 的行为也可以被 `custom_line_render` 所覆盖。

## 使用示例

以下是一个设置 `line_color` 选项的示例：

```javascript
var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary',
    mode: 'full',
    support_html: true,
    view: {
        line_color: '#FF0000', // 设置线条颜色为红色
    }
};
```

在上述示例中，`line_color` 选项被设置为红色（#FF0000）。这个设置将影响思维导图中各节点之间连线的颜色。

<img width="452" alt="line_color:#FF0000" src="https://github.com/hizzgdev/jsmind/assets/1690290/2ae28830-4aee-4c8d-b073-e3e07d33af3c">


## 相关选项和设置

### leading-line-color

如果一个节点设置了 `leading-line-color`，则该节点与其父节点的连线颜色将会覆盖 `line_color` 选项的设置。例如：

```javascript
var mind = {
    "meta": {
        "name": "example",
        "author": "hizzgdev",
        "version": "0.2"
    },
    "format": "node_array",
    "data": [
        {"id": "root", "isroot": true, "topic": "jsMind Example"},
        {"id": "sub1", "parentid": "root", "topic": "Sub Node 1", "leading-line-color": "#00FF00"},
        {"id": "sub2", "parentid": "root", "topic": "Sub Node 2"}
    ]
};
```

在上述示例中，节点 `sub1` 的连线颜色将会被设置为绿色（#00FF00），而不是 `line_color` 选项中设置的颜色。
更多信息请参考文档: [外观](../advanced/appearance.md)。

### custom_line_render

`custom_line_render` 选项允许用户自定义思维导图线条的渲染方法。通过此选项，用户可以完全控制线条的绘制过程。

更多信息请参考 [custom_line_render 选项](option.view.custom_line_render.md)。
