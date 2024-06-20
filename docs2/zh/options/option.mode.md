# mode 选项

**mode** : (string) 布局模式

## 用法

`mode` 参数用于控制在思维导图中添加一级子节点时，节点的布局方式。jsMind 提供了两种布局模式：

- `full`：子节点动态分布在根节点两侧。这是默认的布局模式，适用于需要均衡分布节点的情况。
- `side`：子节点只分布在根节点右侧。适用于需要将所有子节点集中在一侧的情况。

需要注意的是，`mode` 参数只会影响通过 `add_node` 方法添加的节点。如果在使用 `add_node` 方法时指定了 `direction` 参数，将以 `direction` 参数里的方向为准。

### 示例代码

```html
<div id="jsmind_container"></div>
<script>
    var options = {
        container: 'jsmind_container',
        editable: true,
        theme: 'primary',
        mode: 'full', // 设置布局模式为 full
    };
    var mind = new jsMind(options);
</script>
```

### 注意事项

- **添加节点时生效**：`mode` 参数仅在添加节点时（`jsMind.add_node(...)`）生效。也就是说，设置该参数后，只有在添加新的一级子节点时，才会按照指定的布局模式进行排列。
- **忽略 `mode` 参数**：在使用 `add_node` 方法时，如果指定了 `direction` 参数，将忽略 `mode` 参数。`direction` 参数用于指定节点相对于父节点的位置，可以是 `left` 或 `right`。

## 初始布局

在构建思维导图数据时，可以通过数据格式中的 `direction` 字段来设置节点的摆放位置。`direction` 字段用于指定节点相对于父节点的位置，常见的取值有：

- `left`：节点位于父节点的左侧。
- `right`：节点位于父节点的右侧。

### 示例代码（初始布局）

```html
<div id="jsmind_container"></div>
<script>
    var mind_data = {
        "meta": {
            "name": "example",
            "author": "jsMind",
            "version": "0.2"
        },
        "format": "node_tree",
        "data": {
            "id": "root",
            "topic": "Root",
            "children": [
                { "id": "sub1", "topic": "Sub1", "direction": "left" }, // 设置子节点在左侧
                { "id": "sub2", "topic": "Sub2", "direction": "right" } // 设置子节点在右侧
            ]
        }
    };

    var options = {
        container: 'jsmind_container',
        editable: true,
        theme: 'primary'
    };
    var mind = new jsMind(options);
    mind.show(mind_data);
</script>
```

## 相关文档
- [节点是如何布局的](../advanced/layout.md)