# Basic Usage

## Step 1: Add a container on the page

jsMind will render the mindmap in this container. Don't forget to give it certain size, jsMind don't change any styles of it.


```html
<html>
  <body>
    <div id="jsmind_container" style="width: 800px; height: 500px;"></div>
  </body>
</html>
```

## Step 2: Include jsMind CSS and JavaScript Files

Include the jsMind CSS and JavaScript files in the page. Here are 3 options:

### Option 1: Include via CDN

This is the simplest method. Add the following code to your HTML file:

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

For more details on including via CDN, please refer to [CDN Introduction](cdn.md).

### Option 2: Download and Include Locally

You can download the jsMind CSS and JavaScript files from the [jsMind NPM homepage](https://www.npmjs.com/package/jsmind) and place them in your project directory. Then, reference these local files in your HTML file:

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

### Option 3: Install via npm and Include

If you use npm to manage project dependencies, you can install jsMind with the following command:

```bash
npm install jsmind
```

Then, include jsMind in your JavaScript file:

```javascript
import 'jsmind/style/jsmind.css';
import jsMind from 'jsmind';
```


## Step 3: Build Mind Map Data

Build the mind map data in JavaScript. jsMind supports various data formats. Here is a simple data example:

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

For more details on data format, please refer to [Data Format](data-format.md).

## Step 4: Render the Mind Map

Use the jsMind constructor to initialize the mind map and call the `show` method to render it. Here is the code example:

```javascript
var options = {
  container: 'jsmind_container',
  theme: 'primary',
  editable: true,
};
var jm = new jsMind(options);
jm.show(mind);
```

For more details on options, please refer to [Options](../options/).


## The Complete Code (via CDN)

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