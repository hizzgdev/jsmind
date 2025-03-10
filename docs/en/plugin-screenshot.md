[Table of Contents](index.md)

* [Usage](1.usage.md)
* [Options](2.options.md)
* [Operation](3.operation.md)
* [Experimental Features](experimental-features.md)
  * [Screenshot (Export as Image) *](plugin-screenshot.md)
* [Contribution](4.contribution.md)
* [Development Guide](5.development.md)

Screenshot (Export as Image) <sup>[experimental](experimental-features.md)</sup>
===

> It's strongly recommended that you read [Experimental Features](experimental-features.md) to fully understand the risks before using this feature.

This feature can support to export mind maps as png images.

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

If you use npm, please install `jsmind` and `dom-to-image`

```bash
npm install jsmind
npm install dom-to-image
```

And then use it the same way on the page.

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

copyright notice
===

Reproduction and deduction are prohibited.

The jsMind project is still being updated and the corresponding documentation is updated at the same time as the version is updated. In order to avoid confusion to the user, it is forbidden to reprint this document without written permission and to make changes of any kind to this document.
