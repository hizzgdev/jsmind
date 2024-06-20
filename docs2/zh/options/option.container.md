# container 选项

**container** : (string) [必选] 容器的ID

## 用法

在实例化一个 jsMind 时，`container` 参数是必填项。jsMind 通过此参数查找页面元素，并将思维导图输出到该元素中。

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
</script>
```

### 注意事项

- **容器元素**：jsMind 不会对容器进行任何的操作，包括样式以及行为。你可以对该元素进行修饰，但一般仅限于设置其大小、位置、边框等。如果想改变思维导图的字体、字号、背景颜色、前景颜色等，建议通过添加自定义主题的方式进行处理。

## 容器尺寸

建议用户给容器设计合适的尺寸，以确保思维导图能够正确显示。建议使用块元素（如 `<div>`）作为容器，以便更好地控制思维导图的大小和位置。如果需要动态调整容器的尺寸，需要在调整尺寸后调用 API `resize` 来调整思维导图的尺寸。

### 示例代码

```html
<div id="jsmind_container" style="width: 800px; height: 500px;"></div>
<script>
    var options = {
        container: 'jsmind_container',
        editable: true,
        theme: 'primary',
    };
    var mind = new jsMind(options);

    // 动态调整尺寸
    function resizeMindMap() {
        var container = document.getElementById('jsmind_container');
        container.style.width = '1000px';
        container.style.height = '600px';
        mind.resize();
    }
</script>
```

## 异步 DOM 对 jsMind 的影响

jsMind 使用的是同步模型，因此需要在 `container` 添加到 DOM 之后才能正常使用 jsMind。如果在 jsMind 实例化时，`container` 元素尚未添加到 DOM 中，jsMind 将无法找到该元素并进行渲染。

使用 React、Angular 以及 Vue 等框架时，需要特别注意这一点，确保在 jsMind 实例化之前，`container` 元素已经被正确添加到 DOM 中。