jsMind
======

jsMind is a pure javascript library for mindmap. It is easy to use, to understand, and to expand itself.<br />
jsMind is very powerful. It base on javascript and HTML5(Canvas).<br />
jsMind is under BSD license. So you embed it in any project, if only you retain the license.<br />

1.usage
------
### 1.1 required
2 files (jsmind.css and jsmind.js) are required

    <link type="text/css" rel="stylesheet" href="style/jsmind.css" />
    <script type="text/javascript" src="js/jsmind.js"></script>

a div element should be in your HTML as container

    <div id="jsmind_container"></div>
### 1.2 an empty mindmap
It is very easy to show a mindmap:

    <script type="text/javascript">
        var options = {
            data:{readonly:false},
            view:{container:'jsmind_container'}
        };
        var jm = jsMind.show(options);
    </script>

The example above show how to display an empty mindmap. actually, it is not empty, it includes a root node as default.<br />
jsMind show a map in read-only mode, you can enable editable mode with setting the value of readonly property to false.<br />
The container option is the only required, the value should be the id of the container.<br />

### 1.3 a simple mindmap
You can display an existing mindmap:

    <script type="text/javascript">
        var mind = [
            {'nodeid':'root', 'isroot':true, 'topic':'jsMind'},

            {'nodeid':'easy', 'parentid':'root', 'topic':'Easy'},
            {'nodeid':'easy1', 'parentid':'easy', 'topic':'Easy to show'},
            {'nodeid':'easy2', 'parentid':'easy', 'topic':'Easy to edit'},
            {'nodeid':'easy3', 'parentid':'easy', 'topic':'Easy to store'},
            {'nodeid':'easy4', 'parentid':'easy', 'topic':'Easy to embed'},

            {'nodeid':'open', 'parentid':'root', 'topic':'Open Source'},
            {'nodeid':'open1', 'parentid':'open', 'topic':'on GitHub'},
            {'nodeid':'open2', 'parentid':'open', 'topic':'BSD License'},

            {'nodeid':'powerful', 'parentid':'root', 'topic':'Powerful'},
            {'nodeid':'powerful1', 'parentid':'powerful', 'topic':'Base on Javascript'},
            {'nodeid':'powerful2', 'parentid':'powerful', 'topic':'Base on HTML5'},
            {'nodeid':'powerful3', 'parentid':'powerful', 'topic':'Depends on you'},
        ]
        var options = {
            data:{readonly:false},
            view:{container:'jsmind_container'}
        };
        var jm = jsMind.show(options,mind);
    </script>

The difference is only the arguments of jsMind.show() .<br />
It is very easy, is not it?

### Data format


### Options


2.apis
------

3.features
------

4.custom
------
