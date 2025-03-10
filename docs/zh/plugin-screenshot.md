
[目录](index.md)

* [基本用法](1.usage.md)
* [选项](2.options.md)
* [界面操控](3.operation.md)
* [实验性功能 *](experimental-features.md)
  * [截图 (导出图片) *](plugin-screenshot.md)
* [参与贡献](4.contribution.md)
* [贡献代码指南](5.development.md)


截图 (导出图片) <sup>[实验性](experimental-features.md)</sup>
===

> 强烈建议你先阅读 [实验性功能](experimental-features.md), 充分了解风险后再使用此功能。

此功能可将思维导图导出为 png 格式的图片。

```html

<!-- style -->
<link type="text/css" rel="stylesheet" href="https://unpkg.com/jsmind@0.8.7/style/jsmind.css" />

<!-- jsMind -->
<script type="text/javascript" src="https://unpkg.com/jsmind@0.8.7/es6/jsmind.js"></script>

<!-- dependency of screenshot -->
<script type="text/javascript" src="https://unpkg.com/dom-to-image@2.6.0/dist/dom-to-image.min.js" ></script>

<!-- screenshot plugin -->
<script type="text/javascript" src="https://unpkg.com/jsmind@0.8.7/es6/jsmind.screenshot.js"></script>


<script>
    var jm = new jsMind(options);
    jm.show(mind_data);
    // export current mindmap to an image
    jm.shoot()
</script>

```

如果使用 npm，则需要安装 jsmind 和 dom-to-image

```bash
npm install jsmind
npm install dom-to-image
```

然后在页面里一样的使用

```html
<script>
    import domtoimage from 'dom-to-image';
    import jsMind from 'jsmind'
    import 'jsmind/screenshot'
    import 'jsmind/style/jsmind.css'

    // ...

    var jm = new jsMind(options);
    jm.show(mind_data);
    // export current mindmap to an image
    jm.shoot()
</script>
```

版权声明
===

禁止转载、禁止演绎。

jsMind 项目仍在不断升级变化，版本更新时会同时更新对应的文档。为避免给使用者带来困惑，在没有得到书面许可前，禁止转载本文档，同时禁止对本文档进行任何形式的更改。
