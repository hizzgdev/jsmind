# shortcut.enable 选项

| 选项名 | 数据类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| shortcut.enable | bool | true | 是否启用快捷键 |

## 选项说明

`enable` 选项用于控制是否可以在 jsMind 界面上使用键盘快捷键对思维导图进行编辑或其它操作。默认值为 `true`，即启用快捷键。

## 使用示例

以下是一个设置 `enable` 选项的示例：

```javascript
var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary',
    shortcut: {
        enable: false, // 禁用快捷键
        handles: {},
        mapping: {}
    }
};
```

在上述示例中，`enable` 选项被设置为 `false`，这意味着在 jsMind 界面上将禁用所有快捷键。

## 相关选项和设置

- **handles**: 命名的快捷键事件处理器。jsMind 提供了一些常用的处理器，用于操作思维导图。用户也可以定义额外的处理器。详见 [shortcut.handles 选项](option.shortcut.handles.md)
- **mapping**: 快捷键映射配置。用于配置具体的按键与处理器之间的对应关系。支持单一按键和组合按键。详见 [shortcut.mapping 选项](option.shortcut.mapping.md)
