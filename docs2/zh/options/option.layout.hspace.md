# hspace 选项

| 选项名 | 数据类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| hspace | number | 30 | 节点之间的水平间距 |

## 选项说明

`hspace` 选项用于设置思维导图中节点之间的水平间距。此选项的默认值为 30 像素。

## 使用示例

以下是一个设置 `hspace` 选项的示例：

```javascript
var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary',
    layout: {
        hspace: 60 // 设置节点之间的水平间距为 60 像素
    }
};
```

| hspace = 10 | hspace = 30 (默认) | hspace = 60 |
| --- | --- | --- |
| <img width="358" alt="image" src="https://github.com/hizzgdev/jsmind/assets/1690290/667ff99d-2f65-43a1-9714-1088cfbdf7a8"> | <img width="373" alt="image" src="https://github.com/hizzgdev/jsmind/assets/1690290/45118a06-8683-4e53-92a2-ae255784afd1"> | <img width="442" alt="image" src="https://github.com/hizzgdev/jsmind/assets/1690290/89a2df73-a3dc-45b0-b3c9-1c22ad37a921"> |
