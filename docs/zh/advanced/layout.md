# 节点是如何布局的

在使用 jsMind 构建思维导图时，一级子节点可以分布在根节点的左侧或右侧，其它层级的节点的位置都由其父节点决定。一级子节点的具体摆放分以下两种情况。

## 初始数据里节点

在构建思维导图的初始数据时，可以通过 `direction` 字段来指定一级节点相对于根节点的位置。`direction` 字段的取值有：

- `left`：节点位于根节点的左侧。
- `right`：节点位于根节点的右侧。

如果未指定 `direction` 字段，此一级节点将位于根节点的右侧。

### 示例代码

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
                { "id": "sub2", "topic": "Sub2" }  // 未指定方向，默认在右侧
            ]
        }
    };

    var options = {
        container: 'jsmind_container',
        editable: true,
        theme: 'primary',
        mode: 'full', // 设置布局模式为 full
    };
    var mind = new jsMind(options);
    mind.show(mind_data);
</script>
```

## 通过 API 添加的节点

在使用 `add_node` 方法动态添加一级子节点时，可以通过 `direction` 参数来指定其位置。`direction` 参数的取值同样可以是 `left` 或 `right`。

若未指定 `direction` 参数，节点的位置将由 [`mode` 选项](../options/option.mode.md)决定。`mode` 选项有两个取值：

- `full`：jsMind将根据左右子节点的数量动态摆放该节点。这是默认的布局模式，适用于需要均衡分布节点的情况。
- `side`：jsMind将该节点摆放在根节点右侧。适用于需要将所有子节点集中在一侧的情况。

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
    mind.show();

    // 新增节点时指定方向
    mind.add_node('root', 'sub1', 'Sub1', {}, 'left'); // 新节点在左侧
    mind.add_node('root', 'sub2', 'Sub2'); // 未指定方向，默认根据 mode 参数决定
</script>
```

