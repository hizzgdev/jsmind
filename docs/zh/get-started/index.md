# 快速上手

## 第一步：在页面上添加一个容器

jsMind 将会把思维导图画在这个容器内。请记得给这个容器设置合适的尺寸，因为jsMind不会修改容器的任何的样式。


```html
<html>
  <body>
    <div id="jsmind_container" style="width: 800px; height: 500px;"></div>
  </body>
</html>
```

## 第二步：引入 jsMind 的 CSS 和 JavaScript 文件

在 HTML 页面中引入 jsMind 的 CSS 和 JavaScript 文件。这里提供三种不同的方式：

### 方式一：通过 CDN 引入

这是最简单的方式，直接在 HTML 文件中添加以下代码：

```html
<html>
  <head>
    <link type="text/css" rel="stylesheet" href="//cdn.jsdelivr.net/npm/jsmind@0.8.5/style/jsmind.css" />
    <script type="text/javascript" src="//cdn.jsdelivr.net/npm/jsmind@0.8.5/es6/jsmind.js"></script>
  </head>
  <body>
    <div id="jsmind_container" style="width: 800px; height: 500px;"></div>
  </body>
</html>
```

更多关于通过 CDN 引入的详细信息，请参考 [CDN 介绍](cdn.md)。

### 方式二：下载并本地引入

你可以从 [jsMind 的 NPM 主页上](https://www.npmjs.com/package/jsmind) 下载 jsMind 的 CSS 和 JavaScript 文件，并将其放置在你的项目目录中。然后在 HTML 文件中引用这些本地文件：

```html
<html>
  <head>
    <link type="text/css" rel="stylesheet" href="path/to/jsmind.css" />
    <script type="text/javascript" src="path/to/jsmind.js"></script>
  </head>
  <body>
    <div id="jsmind_container" style="width: 800px; height: 500px;"></div>
  </body>
</html>
```

### 方式三：通过 npm 安装并引入

如果你使用 npm 来管理项目依赖，可以通过以下命令安装 jsMind：

```bash
npm install jsmind
```

然后在你的 JavaScript 文件中引入 jsMind：

```javascript
import 'jsmind/style/jsmind.css';
import jsMind from 'jsmind';
```


## 第三步：构建思维导图的数据

在 JavaScript 中定义思维导图的数据。jsMind 支持多种数据格式。以下是一个简单的数据示例：

```javascript
var mind = {
  "meta": {
    "name": "example",
    "author": "hizzgdev",
    "version": "0.2"
  },
  "format": "node_tree",
  "data": {
    "id": "root",
    "topic": "jsMind",
    "children": [
      {"id": "sub1", "topic": "sub1"},
      {"id": "sub2", "topic": "sub2"}
    ]
  }
};
```

更多关于数据格式的详细信息，请参考 [数据格式](data-format.md)。

## 第四步：展示思维导图

使用 jsMind 的构造函数初始化思维导图，并调用 `show` 方法展示思维导图。以下是代码示例：

```javascript
var options = {
  container: 'jsmind_container',
  theme: 'primary',
  editable: true,
};
var jm = new jsMind(options);
jm.show(mind);
```

更详细的配置选项，请参考[配置选项](../options/)。


## 完整代码（CDN方式）

```html
<html>
  <head>
    <link type="text/css" rel="stylesheet" href="//cdn.jsdelivr.net/npm/jsmind@0.8.5/style/jsmind.css" />
    <script type="text/javascript" src="//cdn.jsdelivr.net/npm/jsmind@0.8.5/es6/jsmind.js"></script>
  </head>
  <body>
    <div id="jsmind_container" style="width: 800px; height: 500px;"></div>
    <script type="text/javascript">
      var mind = {
        "meta": {
          "name": "example",
          "author": "hizzgdev",
          "version": "0.2"
        },
        "format": "node_tree",
        "data": {
          "id": "root",
          "topic": "jsMind",
          "children": [
            {"id": "sub1", "topic": "sub1"},
            {"id": "sub2", "topic": "sub2"}
          ]
        }
      };
      var options = {
        container: 'jsmind_container',
        theme: 'primary',
        editable: true,
      };
      var jm = new jsMind(options);
      jm.show(mind);
    </script>
  </body>
</html>
```
