# support_html Option

| Option Name | Data Type | Default Value | Description |
| --- | --- | --- | --- |
| support_html | bool | true | Whether HTML elements in nodes are supported |

## Usage

The `support_html` option controls whether node content supports HTML elements. By default, this option is set to `true`, meaning that node content supports HTML tags. If set to `false`, node content will only support plain text.

### Example Code

With the `support_html` option enabled, you can use HTML tags in node content. For example:

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
                { "id": "sub1", "topic": "<b>Bold Text</b>" }, // Using HTML tags
                { "id": "sub2", "topic": "<i>Italic Text</i>" } // Using HTML tags
            ]
        }
    };

    var options = {
        container: 'jsmind_container',
        editable: true,
        theme: 'primary',
        mode: 'full',
        support_html: true, // Enable HTML support
    };
    var mind = new jsMind(options);
    mind.show(mind_data);
</script>
```

In the above example, the content of the child nodes `sub1` and `sub2` uses the `<b>` and `<i>` HTML tags, respectively, to achieve bold and italic effects.

## Notes

- When the `support_html` option is enabled, ensure that the HTML content is safe to avoid XSS attacks.
- Complex HTML content may affect the layout and display of nodes, so adjustments may be necessary based on specific situations.
- If the mind map is open for editing by everyone, it is recommended to disable this option to ensure security.
