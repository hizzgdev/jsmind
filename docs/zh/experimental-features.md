
[目录](index.md)

* [1. 基本用法](1.usage.md)
* [2. 选项](2.options.md)
* [3. 界面操控](3.operation.md)
* [实验性功能 *](experimental-features.md)
* [参与贡献](4.contribution.md)
* [贡献代码指南](5.development.md)

> 特别注意：这些实验性功能并不保证在后续的版本中会一直存在，也不保证其 API 的兼容性，若在项目中使用了实验性功能，后续请谨慎升级。

导出图片/截图
===
此功能可将思维导图导出为 png 格式的图片。

```html

<!-- style -->
<link type="text/css" rel="stylesheet" href="https://unpkg.com/jsmind@0.7.1/style/jsmind.css" />

<!-- jsMind -->
<script type="text/javascript" src="https://unpkg.com/jsmind@0.7.1/es6/jsmind.js"></script>

<!-- dependency of screenshot -->
<script type="text/javascript" src="https://unpkg.com/dom-to-image@2.6.0/dist/dom-to-image.min.js" ></script>

<!-- screenshot plugin -->
<script type="text/javascript" src="https://unpkg.com/jsmind@0.7.1/es6/jsmind.screenshot.js"></script>


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
