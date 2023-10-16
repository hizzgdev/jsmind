[Table of Contents](index.md)

* [1. Usage](1.usage.md)
* [2. Options](2.options.md)
* [3. Operation](3.operation.md)
* [Experimental Features *](experimental-features.md)
* [Contribution](4.contribution.md)
* [Development Guide](5.development.md)

> Special note: These experimental features are not guaranteed to continue to exist in subsequent versions, nor are their API compatibility guaranteed. If experimental features are used in your project, please upgrade jsmind with caution in the future.

Export Image/Screenshot
===
This feature can support to export mind maps as png images.

```html

<!-- style -->
<link type="text/css" rel="stylesheet" href="https://unpkg.com/jsmind@0.7.4/style/jsmind.css" />

<!-- jsMind -->
<script type="text/javascript" src="https://unpkg.com/jsmind@0.7.4/es6/jsmind.js"></script>

<!-- dependency of screenshot -->
<script type="text/javascript" src="https://unpkg.com/dom-to-image@2.6.0/dist/dom-to-image.min.js" ></script>

<!-- screenshot plugin -->
<script type="text/javascript" src="https://unpkg.com/jsmind@0.7.4/es6/jsmind.screenshot.js"></script>


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
