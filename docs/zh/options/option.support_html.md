# support_html 选项

| 选项名 | 数据类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| support_html | bool | true | 是否支持节点中的 HTML 元素 |

## 用法
`support_html` 选项用于控制节点内容是否支持 HTML 元素。默认情况下，该选项设置为 `true`，即节点内容支持 HTML 标签。如果将其设置为 `false`，则节点内容仅支持纯文本。

### 示例代码

在启用了 `support_html` 选项后，可以在节点内容中使用 HTML 标签。例如：

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
                { "id": "sub1", "topic": "<b>Bold Text</b>" }, // 使用 HTML 标签
                { "id": "sub2", "topic": "<i>Italic Text</i>" } // 使用 HTML 标签
            ]
        }
    };

    var options = {
        container: 'jsmind_container',
        editable: true,
        theme: 'primary',
        mode: 'full',
        support_html: true, // 启用 HTML 支持
    };
    var mind = new jsMind(options);
    mind.show(mind_data);
</script>
```

在上述示例中，子节点 `sub1` 和 `sub2` 的内容分别使用了 `<b>` 和 `<i>` HTML 标签，从而实现了加粗和斜体效果。

## 注意事项

- 启用 `support_html` 选项后，确保输入的 HTML 内容是安全的，避免 XSS 攻击。
- 复杂的 HTML 内容可能会影响节点的布局和显示效果，需要根据具体情况进行调整。
- 如果思维导图要开放给所有人编辑，建议关闭此选项以确保安全。
