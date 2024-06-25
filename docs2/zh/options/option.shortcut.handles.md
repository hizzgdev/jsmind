# handles 选项

| 选项名 | 数据类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| handles | object{string : function} | {} | 命名的快捷键事件处理器 |

## 选项说明

`handles` 选项用于定义命名的快捷键事件处理器。jsMind 提供了一些常用的处理器，用于操作思维导图。该选项允许用户定义额外的处理器，以实现自定义的快捷键操作。`handles` 选项是一个 `string -> function(jsmind, event)` 的集合，其中 `string` 指定处理器的名称，`function` 则是处理器具体要执行的逻辑。

## 内置的处理器

jsMind 提供了一些常用的处理器，用于操作思维导图，`handles` 参数提供了新增其它处理器的能力。jsMind 默认提供的处理器有：

- `addchild`: 添加子节点
- `addbrother`: 添加兄弟节点
- `editnode`: 进行编辑模式
- `delnode`: 删除节点
- `toggle`: 展开/关闭节点
- `left`: 选中左侧的节点
- `up`: 选中上方的节点
- `right`: 选中右侧的节点
- `down`: 选中下方的节点

## 使用示例

以下是一个设置 `handles` 选项的示例：

```javascript
var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary',
    shortcut: {
        enable: true,
        handles: {
            'dosomething': function(jm, e) {
                // 执行某些操作
                console.log('do something');
            },
            'dosomeotherthing': function(jm, e) {
                // 执行其他操作
                console.log('do some other things');
            }
        },
        mapping: {
            addchild: [45, 4096 + 13], // <Insert>, <Ctrl> + <Enter>
            addbrother: 13, // <Enter>
            editnode: 113, // <F2>
            delnode: 46, // <Delete>
            toggle: 32, // <Space>
            left: 37, // <Left>
            up: 38, // <Up>
            right: 39, // <Right>
            down: 40, // <Down>
            dosomething: 112, // <F1>
            dosomeotherthing: 113 // <F2>
        }
    }
};
```

在上述示例中，定义了两个自定义处理器 `dosomething` 和 `dosomeotherthing`，并将它们分别映射到 `F1` 和 `F2` 键。

## 相关选项和设置

- **enable**: 是否启用快捷键，默认值为 `true`。请参考 [shortcut.enable 选项](option.shortcut.enable.md)。
- **mapping**: 快捷键映射配置，用于配置具体的按键与处理器之间的对应关系。支持单一按键和组合按键。请参考 [shortcut.mapping 选项](option.shortcut.mapping.md)。
