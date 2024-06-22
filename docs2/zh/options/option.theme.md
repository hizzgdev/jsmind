# theme 选项

| 选项名 | 数据类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| theme | string | null | 主题 |

## 说明

`theme` 选项用于指定 jsMind 的主题名。通过设置不同的主题，可以改变思维导图的整体外观。

## 内置主题

jsMind 提供了 15 种主题，分别是：

- primary
- warning
- danger
- success
- info
- greensea
- nephrite
- belizehole
- wisteria
- asphalt
- orange
- pumpkin
- pomegranate
- clouds
- asbestos

你可以访问[功能示例](http://hizzgdev.github.io/jsmind/example/2_features.html)页面浏览这些主题。

## 配置示例

以下是一个包含 `theme` 选项的配置示例：

```javascript
var options = {
    container: 'jsmind_container', // 容器的ID
    theme: 'primary', // 主题
};
```

在上述示例中，`theme` 选项被设置为 `primary`，即使用默认的 primary 主题。

## 自定义主题

除了使用默认主题外，你还可以添加自己的主题。只需按照以下格式添加样式定义即可：

```css
/* greensea theme */                                                      /* greensea 即是主题名 */
jmnodes.theme-greensea jmnode{background-color:#1abc9c;color:#fff;}       /* 节点样式 */
jmnodes.theme-greensea jmnode:hover{background-color:#16a085;}            /* 鼠标悬停的节点样式 */
jmnodes.theme-greensea jmnode.selected{background-color:#11f;color:#fff;} /* 选中的节点样式 */
jmnodes.theme-greensea jmnode.root{}                                      /* 根节点样式 */
jmnodes.theme-greensea jmexpander{}                                       /* 展开/关闭节点的控制点样式 */
jmnodes.theme-greensea jmexpander:hover{}                                 /* 鼠标悬停展开/关闭节点的控制点样式 */
```
