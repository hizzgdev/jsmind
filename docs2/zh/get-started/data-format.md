# jsMind 支持的数据格式

jsMind 支持三种数据格式，分别是 `node_tree`、`node_array` 和 `freemind` 格式。jsMind 可以加载其中任一种格式，也能将数据导出为任一种格式。

## node_tree 格式

`node_tree` 格式是一种树形结构的数据格式，适用于表示层级关系明确的思维导图。每个节点包含以下属性：

- `id` (必选): 节点的唯一标识符，所有节点的ID不应有重复。
- `topic` (必选): 节点上显示的内容。
- `direction` (可选): 节点的方向，此数据仅在第一层节点上有效，目前仅支持 `left` 和 `right` 两种，默认为 `right`。
- `expanded` (可选): 该节点是否是展开状态，默认为 `true`。
- `children` (可选): 子节点数组。

示例：
```javascript
var mind = {
    "meta": {
        "name": "jsMind-demo-tree",
        "author": "hizzgdev@163.com",
        "version": "0.2"
    },
    "format": "node_tree",
    "data": {
        "id": "root",
        "topic": "jsMind",
        "children": [
            {
                "id": "easy",
                "topic": "Easy",
                "direction": "left",
                "expanded": false,
                "children": [
                    {"id": "easy1", "topic": "Easy to show"},
                    {"id": "easy2", "topic": "Easy to edit"},
                    {"id": "easy3", "topic": "Easy to store"},
                    {"id": "easy4", "topic": "Easy to embed"}
                ]
            },
            {
                "id": "open",
                "topic": "Open Source",
                "direction": "right",
                "expanded": true,
                "children": [
                    {"id": "open1", "topic": "on GitHub"},
                    {"id": "open2", "topic": "BSD License"}
                ]
            },
            {
                "id": "powerful",
                "topic": "Powerful",
                "direction": "right",
                "children": [
                    {"id": "powerful1", "topic": "Base on Javascript"},
                    {"id": "powerful2", "topic": "Base on HTML5"},
                    {"id": "powerful3", "topic": "Depends on you"}
                ]
            },
            {
                "id": "other",
                "topic": "test node",
                "direction": "left",
                "children": [
                    {"id": "other1", "topic": "I'm from local variable"},
                    {"id": "other2", "topic": "I can do everything"}
                ]
            }
        ]
    }
};
```

## node_array 格式

`node_array` 格式是一种数组结构的数据格式，每个节点作为数组中的一个元素。与 `node_tree` 格式相比，它不需要 `children` 属性，但需要额外指定 `parentid` 来表示父节点。

示例：
```javascript
var mind = {
    "meta": {
        "name": "example",
        "author": "hizzgdev@163.com",
        "version": "0.2"
    },
    "format": "node_array",
    "data": [
        {"id": "root", "isroot": true, "topic": "jsMind"},
        {"id": "easy", "parentid": "root", "topic": "Easy", "direction": "left"},
        {"id": "easy1", "parentid": "easy", "topic": "Easy to show"},
        {"id": "easy2", "parentid": "easy", "topic": "Easy to edit"},
        {"id": "easy3", "parentid": "easy", "topic": "Easy to store"},
        {"id": "easy4", "parentid": "easy", "topic": "Easy to embed"},
        {"id": "open", "parentid": "root", "topic": "Open Source", "expanded": false, "direction": "right"},
        {"id": "open1", "parentid": "open", "topic": "on GitHub"},
        {"id": "open2", "parentid": "open", "topic": "BSD License"},
        {"id": "powerful", "parentid": "root", "topic": "Powerful", "direction": "right"},
        {"id": "powerful1", "parentid": "powerful", "topic": "Base on Javascript"},
        {"id": "powerful2", "parentid": "powerful", "topic": "Base on HTML5"},
        {"id": "powerful3", "parentid": "powerful", "topic": "Depends on you"}
    ]
};
```

## freemind 格式

`freemind` 格式是一种兼容 FreeMind 思维导图软件的数据格式。jsMind 可以加载和导出这种格式的数据，使得用户可以在 FreeMind 和 jsMind 之间无缝切换。freemind 格式使用 XML 结构来表示思维导图。

示例：
```javascript
var mind = {
    "meta":{
        "name":"example",
        "author":"hizzgdev@163.com",
        "version":"0.2"
    },
    "format":"freemind",
    "data":"<map version=\"1.0.1\"> <node ID=\"root\" TEXT=\"jsMind\" > <node ID=\"easy\" POSITION=\"left\" TEXT=\"Easy\" > <node ID=\"easy1\" TEXT=\"Easy to show\" /> <node ID=\"easy2\" TEXT=\"Easy to edit\" /> <node ID=\"easy3\" TEXT=\"Easy to store\" /> <node ID=\"easy4\" TEXT=\"Easy to embed\" /> </node> <node ID=\"open\" POSITION=\"right\" TEXT=\"Open Source\" > <node ID=\"open1\" TEXT=\"on GitHub\" /> <node ID=\"open2\" TEXT=\"BSD License\" /> </node> <node ID=\"powerful\" POSITION=\"right\" TEXT=\"Powerful\" > <node ID=\"powerful1\" TEXT=\"Base on Javascript\" /> <node ID=\"powerful2\" TEXT=\"Base on HTML5\" /> <node ID=\"powerful3\" TEXT=\"Depends on you\" /> </node> <node ID=\"other\" POSITION=\"left\" TEXT=\"test node\" > <node ID=\"other1\" TEXT=\"I'm from local variable\" /> <node ID=\"other2\" TEXT=\"I can do everything\" /> </node> </node> </map>"
};
```
