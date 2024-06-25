# shortcut.mapping 选项

| 选项名 | 数据类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| shortcut.mapping | object{string : number \| [number]} | {} | 快捷键映射配置 |

## 选项说明

`mapping` 选项用于配置具体的按键与处理器之间的对应关系。通过该选项，用户可以将特定的键盘按键映射到相应的处理器，以实现快捷操作的目的。jsMind 提供了一些默认的快捷键映射，同时支持用户自定义单一按键和组合按键的映射。

## 使用示例

以下是一个设置 `mapping` 选项的示例：

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

在上述示例中，定义了多个快捷键映射，将特定的键盘按键与处理器绑定。例如，`<Insert>` 键和 `<Ctrl> + <Enter>` 键被映射到 `addchild` 处理器。

## 相关选项和设置

- **enable**: 是否启用快捷键，默认值为 `true`。请参考 [shortcut.enable 选项](option.shortcut.enable.md)。
- **handles**: 命名的快捷键事件处理器，用于定义额外的处理器，以实现自定义的快捷键操作。请参考 [shortcut.handles 选项](option.shortcut.handles.md)。

## 组合按键

除了单一按键，jsMind 还支持组合按键。组合快捷键的代码为常规按键的代码加上功能键的标识代码。目前支持四种功能键，对应的标识代码分别为：

- Meta: 8192
- Ctrl: 4096
- ALT: 2048
- SHIFT: 1024

以下是一些组合按键的示例：

```javascript
var options = {
    shortcut: {
        mapping: {
            addchild: 4096 + 73, // <Ctrl> + <I>
            delnode: 4096 + 2048 + 68 // <Ctrl> + <ALT> + <D>
        }
    }
};
```

## 多快捷键映射

jsMind 支持为一个处理器配置多个快捷键。只需将键码替换为数组即可。以下是一个多快捷键映射的示例：

```javascript
var options = {
    shortcut: {
        mapping: {
            addchild: [45, 4096 + 13], // <Insert>, <Ctrl> + <Enter>
            delnode: [46, 4096 + 68] // <Delete>, <Ctrl> + <D>
        }
    }
};
```

在上述示例中，`addchild` 处理器被映射到 `<Insert>` 键和 `<Ctrl> + <Enter>` 键，`delnode` 处理器被映射到 `<Delete>` 键和 `<Ctrl> + <D>` 键。
