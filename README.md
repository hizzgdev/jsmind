jsMind
======

jsMind is a pure javascript library for mindmap, it base on html5 canvas. jsMind was released under BSD license, you can embed it in any project, if only you observe the license.

Links:

* Demo : <http://hizzgdev.github.io/jsmind/>
* Demo-basic : <http://hizzgdev.github.io/jsmind/example/1_basic.html>
* Demo-features : <http://hizzgdev.github.io/jsmind/example/2_features.html>
* Project-home : <http://hizzgdev.github.io/jsmind/developer.html>
* Documents : [Index of document][1]

Get Started:

    <html>
        <head>
            <link type="text/css" rel="stylesheet" href="style/jsmind.css" />
            <script type="text/javascript" src="js/jsmind.js"></script>
        </head>
        <body>
            <div id="jsmind_container"></div>

            <script type="text/javascript">
                var mind = {
                    // 3 data formats were supported ...
                    // see Documents for more information
                };
                var options = {
                    container:'jsmind_container',
                    editable:true,
                    theme:'orange'
                };
                var jm = jsMind.show(options,mind);
            </script>
        </body>
    </html>

[1]:docs/index.md
