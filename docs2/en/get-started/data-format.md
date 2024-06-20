# Detailed Introduction to jsMind Data Formats

jsMind supports 3 data formats: `node_tree`, `node_array`, and `freemind`. jsMind can load any of these formats and can also export data in any of these formats. Below is a detailed introduction to these three data formats, including examples and explanations, and highlighting the differences between each format.

## node_tree Format

The `node_tree` format is a tree-structured data format suitable for representing mind maps with clear hierarchical relationships. Each node contains the following attributes:

- `id` (required): The unique identifier of the node. All node IDs should be unique; otherwise, nodes with duplicate IDs will be ignored.
- `topic` (required): The content displayed on the node.
- `direction` (optional): The direction of the node. This attribute is only effective for the first-level nodes and currently supports `left` and `right`, with `right` as the default.
- `expanded` (optional): Whether the node is expanded, with `true` as the default.
- `children` (optional): An array of child nodes.

Example:
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

## node_array Format

The `node_array` format is an array-structured data format where each node is an element in the array. Compared to the `node_tree` format, it does not require the `children` field but needs an additional `parentid` field to indicate the parent node.


Example:
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

## freemind Format

The `freemind` format is a data format compatible with the FreeMind mind mapping software. jsMind can load and export data in this format, allowing users to seamlessly switch between FreeMind and jsMind. The freemind format uses an XML structure to represent the mind map.

Example:
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
