# pspace 选项

| 选项名 | 数据类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| pspace | number | 13 | 节点与连接线之间的水平空间 |

## 选项说明

`pspace` 选项用于设置节点与连接线之间的水平间距，以容纳节点的展开/关闭控制器。此选项的默认值为 13 像素。

## 使用示例

以下是一个设置 `pspace` 选项的示例：

```javascript
var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary',
    layout: {
        pspace: 20 // 设置节点与连接线之间的水平间距为 20 像素
    }
};
```

在上述示例中，`pspace` 选项被设置为 `20`，这意味着节点与连接线之间的水平间距将会是 20 像素。

## 相关选项和设置

- **jmexpander**: 自定义主题中的展开/关闭节点的控制点样式。例如，以下是 `greensea` 主题中 `jmexpander` 的样式定义：

```css
/* greensea theme */
.jmnodes.theme-greensea .jmexpander {
    width: 18px;
    height: 18px;
    border-radius: 9px;
    font-size: 18px;
}
.jmnodes.theme-greensea .jmexpander:hover { /* 鼠标悬停展开/关闭节点的控制点样式 */ }
```

## 预览

| pspace = 13 (默认) | pspace = 20 (应用了自定义主题) |
| --- | --- |
| <img width="397" alt="image" src="https://github.com/hizzgdev/jsmind/assets/1690290/bf0bf558-f8e6-4f05-b71d-e030883af90b"> | <img width="414" alt="image" src="https://github.com/hizzgdev/jsmind/assets/1690290/a29ece77-ee69-49fe-ae9a-aa6c6f663fcc"> |
