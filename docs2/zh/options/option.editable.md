# editable 选项

**editable** : (bool) 是否启用编辑

## 用法

jsMind 中的 `editable` 选项决定了用户是否可以编辑思维导图。当设置为 `true` 时，用户可以直接在思维导图界面中添加、删除和修改节点。如果设置为 `false`，思维导图将处于只读状态，用户将无法对其进行任何更改。

### 示例代码

```html
<div id="jsmind_container"></div>
<script>
    var options = {
        container: 'jsmind_container',
        editable: true, // 启用编辑功能
        theme: 'primary',
    };
    var mind = new jsMind(options);
</script>
```

### 注意事项

- **用户交互**：当 `editable` 设置为 `true` 时，用户可以通过添加新节点、删除现有节点和编辑节点内容来与思维导图进行交互。这对于需要用户动态创建或修改思维导图的应用程序非常有用。
- **只读模式**：如果你希望展示一个不允许任何修改的思维导图，可以将 `editable` 设置为 `false`。这对于展示静态信息且不需要用户交互的场景非常有用。

### 只读模式的示例代码

```html
<div id="jsmind_container"></div>
<script>
    var options = {
        container: 'jsmind_container',
        editable: false, // 禁用编辑功能
        theme: 'primary',
    };
    var mind = new jsMind(options);
</script>
```

## 动态启用或禁用编辑

在使用 jsMind 时，有时需要根据具体情况动态地启用或禁用思维导图的编辑功能。jsMind 提供了 `enable_edit` 和 `disable_edit` 两个 API 方法来实现这一功能。此外，还有 `begin_edit` 和 `end_edit` 方法用于控制节点的编辑状态。

### 启用编辑功能

使用 `jm.enable_edit()` 方法可以启用对当前思维导图的编辑功能。启用后，用户可以添加、删除和修改节点。

#### 示例代码

```html
<div id="jsmind_container"></div>
<script>
    var options = {
        container: 'jsmind_container',
        editable: false, // 初始状态为不可编辑
        theme: 'primary',
    };
    var mind = new jsMind(options);

    // 启用编辑功能
    mind.enable_edit();
</script>
```

### 禁用编辑功能

使用 `jm.disable_edit()` 方法可以禁用对当前思维导图的编辑功能。禁用后，用户将无法对思维导图进行任何修改。

#### 示例代码

```html
<div id="jsmind_container"></div>
<script>
    var options = {
        container: 'jsmind_container',
        editable: true, // 初始状态为可编辑
        theme: 'primary',
    };
    var mind = new jsMind(options);

    // 禁用编辑功能
    mind.disable_edit();
</script>
```

## 编辑节点

- **开始编辑节点**：使用 `jm.begin_edit(node)` 方法可以将指定节点调整为编辑状态。用户可以直接在界面上修改节点内容。
- **结束编辑节点**：使用 `jm.end_edit()` 方法可以将当前处于编辑状态的节点调整为只读状态。

### 示例代码

```html
<div id="jsmind_container"></div>
<script>
    var options = {
        container: 'jsmind_container',
        editable: true,
        theme: 'primary',
    };
    var mind = new jsMind(options);

    // 开始编辑节点
    var node = mind.get_selected_node();
    if (node) {
        mind.begin_edit(node);
    }

    // 结束编辑节点
    mind.end_edit();
</script>
```

通过使用这些 API 方法，可以灵活地控制思维导图的编辑状态，满足不同场景下的需求。详细的 API 使用方法将在相关文档中进一步介绍。
