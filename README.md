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
                "version":"0.2"
            },
            "format":"node_array",
            "data":[
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
            theme:'greensea',
            editable:true
        };
        var jm = jsMind.show(options,mind);
    </script>

The difference is only the arguments of jsMind.show().

It is very easy, is not it?

### 1.4. Data format
3 data formats are supported:

**node tree**(default)

        {
            "meta":{
                "name":"jsMind remote",
                "author":"hizzgdev@163.com",
                "version":"0.2"
            },
            "format":"node_tree",
            "data":{"id":"root","topic":"jsMind","children":[
                {"id":"easy","topic":"Easy","direction":"left","children":[
                    {"id":"easy1","topic":"Easy to show"},
                    {"id":"easy2","topic":"Easy to edit"},
                    {"id":"easy3","topic":"Easy to store"},
                    {"id":"easy4","topic":"Easy to embed"}
                ]},
                {"id":"open","topic":"Open Source","direction":"right","children":[
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
        }

**node array**(easy for deal with data from database)

        {
            "meta":{
                "name":"example",
                "author":"hizzgdev@163.com",
                "version":"0.2"
            },
            "format":"node_array",
            "data":[
                {"id":"root", "isroot":true, "topic":"jsMind"},

                {"id":"easy", "parentid":"root", "topic":"Easy", "direction":"left"},
                {"id":"easy1", "parentid":"easy", "topic":"Easy to show"},
                {"id":"easy2", "parentid":"easy", "topic":"Easy to edit"},
                {"id":"easy3", "parentid":"easy", "topic":"Easy to store"},
                {"id":"easy4", "parentid":"easy", "topic":"Easy to embed"},

                {"id":"open", "parentid":"root", "topic":"Open Source", "direction":"right"},
                {"id":"open1", "parentid":"open", "topic":"on GitHub"},
                {"id":"open2", "parentid":"open", "topic":"BSD License"},

                {"id":"powerful", "parentid":"root", "topic":"Powerful", "direction":"right"},
                {"id":"powerful1", "parentid":"powerful", "topic":"Base on Javascript"},
                {"id":"powerful2", "parentid":"powerful", "topic":"Base on HTML5"},
                {"id":"powerful3", "parentid":"powerful", "topic":"Depends on you"},
            ]
        }

**freemind** (for freemind)

        {
            "meta":{
                "name":"example",
                "author":"hizzgdev@163.com",
                "version":"0.2"
            },
            "format":"freemind",
            "data":"<map version=\"1.0.1\"> <node ID=\"root\" TEXT=\"jsMind\" > <node ID=\"easy\" POSITION=\"left\" TEXT=\"Easy\" > <node ID=\"easy1\" TEXT=\"Easy to show\" /> <node ID=\"easy2\" TEXT=\"Easy to edit\" /> <node ID=\"easy3\" TEXT=\"Easy to store\" /> <node ID=\"easy4\" TEXT=\"Easy to embed\" /> </node> <node ID=\"open\" POSITION=\"right\" TEXT=\"Open Source\" > <node ID=\"open1\" TEXT=\"on GitHub\" /> <node ID=\"open2\" TEXT=\"BSD License\" /> </node> <node ID=\"powerful\" POSITION=\"right\" TEXT=\"Powerful\" > <node ID=\"powerful1\" TEXT=\"Base on Javascript\" /> <node ID=\"powerful2\" TEXT=\"Base on HTML5\" /> <node ID=\"powerful3\" TEXT=\"Depends on you\" /> </node> <node ID=\"other\" POSITION=\"left\" TEXT=\"test node\" > <node ID=\"other1\" TEXT=\"I'm from local variable\" /> <node ID=\"other2\" TEXT=\"I can do everything\" /> </node> </node> </map>"
        }

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

