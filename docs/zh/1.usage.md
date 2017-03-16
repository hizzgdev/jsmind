[目录](index.md)

1. **基本用法**
2. [选项](2.options.md)
3. [界面操控](3.operation.md)


1.1. 基本框架
===

首先，需要在页面上引用 jsmind.js 和 jsmind.css 两个文件。

```html
<link type="text/css" rel="stylesheet" href="style/jsmind.css" />
<script type="text/javascript" src="js/jsmind.js"></script>
```

如果希望能够通过鼠标拖拽的方式移动节点，需要额外引用 jsmind.draggable.js 文件

```html
<script type="text/javascript" src="js/jsmind.draggable.js"></script>
```

其次，要为 jsMind 准备一个容器，jsMind 将在这个容器里显示思维导图。可自行定义容器的id、大小及样式。

```html
<div id="jsmind_container"></div>
```

最后，添加下面一段代码即可显示一个空白的思维导图：

```javascript
<script type="text/javascript">
    var options = {                   // options 将在下一章中详细介绍
        container:'jsmind_container', // [必选] 容器的ID，或者为容器的对象
        editable:true,                // [可选] 是否启用编辑
        theme:'orange'                // [可选] 主题
    };
    var jm = new jsMind(options);
    jm.show();
</script>
```

或者，使用下面的代码显示一个包含既定内容的思维导图：

```javascript
<script type="text/javascript">
    var mind = { /* jsMind 数据，详见下一节的说明 */ };
    var options = {
        container:'jsmind_container',
        editable:true,
        theme:'orange'
    };

    var jm = new jsMind(options);
    // 让 jm 显示这个 mind 即可
    jm.show(mind); 
</script>
```

1.2. 数据格式
===

jsMind 支持三种数据格式，分别是树对象格式、表对象格式、freemind格式。jsMind 可以加载其中任一种格式，也能将数据导出为任一种格式。

* **树对象格式** 默认格式，节点之间是包含关系，便于程序进行处理，适合与 MongoDB 及其它文档型数据库进行数据交互；
* **表对象格式** 节点之间是并列关系，使用 parentid 标识上下级关系，适合与关系型数据库进行数据交互；
* **freemind格式** 使用 freemind 的 xml 格式，适合与 freemind 进行数据交互。

下面是三种数据格式的简单示例：

A. 树对象格式示例
---

```javascript
var mind = {
    /* 元数据，定义思维导图的名称、作者、版本等信息 */
    "meta":{
        "name":"jsMind-demo-tree",
        "author":"hizzgdev@163.com",
        "version":"0.2"
    },
    /* 数据格式声明 */
    "format":"node_tree",
    /* 数据内容 */
    "data":{"id":"root","topic":"jsMind","children":[
        {"id":"easy","topic":"Easy","direction":"left","expanded":false,"children":[
            {"id":"easy1","topic":"Easy to show"},
            {"id":"easy2","topic":"Easy to edit"},
            {"id":"easy3","topic":"Easy to store"},
            {"id":"easy4","topic":"Easy to embed"}
        ]},
        {"id":"open","topic":"Open Source","direction":"right","expanded":true,"children":[
            {"id":"open1","topic":"on GitHub"},
            {"id":"open2","topic":"BSD License"}
        ]},
        {"id":"powerful","topic":"Powerful","direction":"right","children":[
            {"id":"powerful1","topic":"Base on Javascript"},
            {"id":"powerful2","topic":"Base on HTML5"},
            {"id":"powerful3","topic":"Depends on you"}
        ]},
        {"id":"other","topic":"test node","direction":"left","children":[
            {"id":"other1","topic":"I'm from local variable"},
            {"id":"other2","topic":"I can do everything"}
        ]}
    ]}
};
```

B. 表对象格式示例
---

```javascript
var mind = {
    /* 元数据，定义思维导图的名称、作者、版本等信息 */
    "meta":{
        "name":"example",
        "author":"hizzgdev@163.com",
        "version":"0.2"
    },
    /* 数据格式声明 */
    "format":"node_array",
    /* 数据内容 */
    "data":[
        {"id":"root", "isroot":true, "topic":"jsMind"},

        {"id":"easy", "parentid":"root", "topic":"Easy", "direction":"left"},
        {"id":"easy1", "parentid":"easy", "topic":"Easy to show"},
        {"id":"easy2", "parentid":"easy", "topic":"Easy to edit"},
        {"id":"easy3", "parentid":"easy", "topic":"Easy to store"},
        {"id":"easy4", "parentid":"easy", "topic":"Easy to embed"},

        {"id":"open", "parentid":"root", "topic":"Open Source", "expanded":false, "direction":"right"},
        {"id":"open1", "parentid":"open", "topic":"on GitHub"},
        {"id":"open2", "parentid":"open", "topic":"BSD License"},

        {"id":"powerful", "parentid":"root", "topic":"Powerful", "direction":"right"},
        {"id":"powerful1", "parentid":"powerful", "topic":"Base on Javascript"},
        {"id":"powerful2", "parentid":"powerful", "topic":"Base on HTML5"},
        {"id":"powerful3", "parentid":"powerful", "topic":"Depends on you"},
    ]
};
```

C. freemind格式示例
---

```javascript
var mind = {
    /* 元数据，定义思维导图的名称、作者、版本等信息 */
    "meta":{
        "name":"example",
        "author":"hizzgdev@163.com",
        "version":"0.2"
    },
    /* 数据格式声明 */
    "format":"freemind",
    /* 数据内容 */
    "data":"<map version=\"1.0.1\"> <node ID=\"root\" TEXT=\"jsMind\" > <node ID=\"easy\" POSITION=\"left\" TEXT=\"Easy\" > <node ID=\"easy1\" TEXT=\"Easy to show\" /> <node ID=\"easy2\" TEXT=\"Easy to edit\" /> <node ID=\"easy3\" TEXT=\"Easy to store\" /> <node ID=\"easy4\" TEXT=\"Easy to embed\" /> </node> <node ID=\"open\" POSITION=\"right\" TEXT=\"Open Source\" > <node ID=\"open1\" TEXT=\"on GitHub\" /> <node ID=\"open2\" TEXT=\"BSD License\" /> </node> <node ID=\"powerful\" POSITION=\"right\" TEXT=\"Powerful\" > <node ID=\"powerful1\" TEXT=\"Base on Javascript\" /> <node ID=\"powerful2\" TEXT=\"Base on HTML5\" /> <node ID=\"powerful3\" TEXT=\"Depends on you\" /> </node> <node ID=\"other\" POSITION=\"left\" TEXT=\"test node\" > <node ID=\"other1\" TEXT=\"I'm from local variable\" /> <node ID=\"other2\" TEXT=\"I can do everything\" /> </node> </node> </map>"
};
```

注
---
除 freemind 格式外，其余两种格式的基本数据结构如下：

```javascript

    {
        "id":"open",           // [必选] ID, 所有节点的ID不应有重复，否则ID重复的结节将被忽略
        "topic":"Open Source", // [必选] 节点上显示的内容
        "direction":"right",   // [可选] 节点的方向，此数据仅在第一层节点上有效，目前仅支持 left 和 right 两种，默认为 right
        "expanded":true,       // [可选] 该节点是否是展开状态，默认为 true
    }

```

1.3. 主题
===

jsMind 默认提供了 15 种主题，你可以访问[功能示例](http://hizzgdev.github.io/jsmind/example/2_features.html)页面浏览这些主题。

+ primary
+ warning
+ danger
+ success
+ info
+ greensea
+ nephrite
+ belizehole
+ wisteria
+ asphalt
+ orange
+ pumpkin
+ pomegranate
+ clouds
+ asbestos

当然，你也可以添加自己的主题。只需在 jsmind.css 中按照以下格式添加样式定义即可：

```css
/* greensea theme */                                                      /* greensea 即是主题名 */
jmnodes.theme-greensea jmnode{background-color:#1abc9c;color:#fff;}       /* 节点样式 */
jmnodes.theme-greensea jmnode:hover{background-color:#16a085;}            /* 鼠标悬停的节点样式 */
jmnodes.theme-greensea jmnode.selected{background-color:#11f;color:#fff;} /* 选中的节点样式 */
jmnodes.theme-greensea jmnode.root{}                                      /* 根节点样式 */
jmnodes.theme-greensea jmexpander{}                                       /* 展开/关闭节点的控制点样式 */
jmnodes.theme-greensea jmexpander:hover{}                                 /* 鼠标悬停展开/关闭节点的控制点样式 */
```


版权声明
===
禁止转载、禁止演绎。

jsMind 项目仍在不断升级变化，版本更新时会同时更新对应的文档。为避免给使用者带来困惑，在没有得到书面许可前，禁止转载本文档，同时禁止对本文档进行任何形式的更改。
