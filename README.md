jsMind
======

jsMind is a pure javascript library for mindmap. It is easy to use, to understand, and to expand itself.

jsMind is very powerful. It base on javascript and HTML5(Canvas).

jsMind is under BSD license. You can embed it in any project, if only you observe the license.

1. Usage
------
### 1.1. Required
2 files (jsmind.css and jsmind.js) are required

    <link type="text/css" rel="stylesheet" href="style/jsmind.css" />
    <script type="text/javascript" src="js/jsmind.js"></script>

a div element should be in your HTML as container

    <div id="jsmind_container"></div>

### 1.2. An empty mindmap
It is very easy to show a mindmap:

    <script type="text/javascript">
        var options = {
            container:'jsmind_container',
            readonly:false,
            theme:'orange'
        };
        var jm = jsMind.show(options);
    </script>

The example above show how to display an empty mindmap. actually, it is not empty, it includes a root node as default.

jsMind show a map in read-only mode, you can enable editable mode with setting the value of readonly property to false.

The container option is the only required, the value should be the id of the container.

### 1.3. A simple mindmap
You can display an existing mindmap:

    <script type="text/javascript">
        var mind = {
            "meta":{
                "name":"example",
                "author":"hizzgdev@163.com",
                "version":"0.2",
                "format":"node_array"
            },
            "nodes":[
                {"id":"root", "isroot":true, "topic":"jsMind"},

                {"id":"easy", "parentid":"root", "topic":"Easy"},
                {"id":"easy1", "parentid":"easy", "topic":"Easy to show"},
                {"id":"easy2", "parentid":"easy", "topic":"Easy to edit"},
                {"id":"easy3", "parentid":"easy", "topic":"Easy to store"},
                {"id":"easy4", "parentid":"easy", "topic":"Easy to embed"},

                {"id":"open", "parentid":"root", "topic":"Open Source"},
                {"id":"open1", "parentid":"open", "topic":"on GitHub"},
                {"id":"open2", "parentid":"open", "topic":"BSD License"},

                {"id":"powerful", "parentid":"root", "topic":"Powerful"},
                {"id":"powerful1", "parentid":"powerful", "topic":"Base on Javascript"},
                {"id":"powerful2", "parentid":"powerful", "topic":"Base on HTML5"},
                {"id":"powerful3", "parentid":"powerful", "topic":"Depends on you"},
            ]
        };
        var options = {
            container:'jsmind_container',
            readonly:false,
            theme:'greensea'
        };
        var jm = jsMind.show(options,mind);
    </script>

The difference is only the arguments of jsMind.show().

It is very easy, is not it?

### 1.4. Data format
To be continued

### 1.5. Options
To be continued

### 1.6. Themes
To be continued

2. Apis
------
To be continued

3. Features
------
To be continued

4. Storage
------
To be continued

