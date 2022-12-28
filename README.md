# jsMind

[![npm version](https://badge.fury.io/js/jsmind.svg)](https://www.npmjs.com/package/jsmind)
![build-test](https://github.com/hizzgdev/jsmind/actions/workflows/node.js.yml/badge.svg)

jsMind 是一个显示/编辑思维导图的纯 javascript 类库，其基于 html5 canvas (和 svg) 进行设计。jsMind 以 [BSD 协议开源](LICENSE)，在此基础上你可以在你的项目上任意使用。

jsMind is mind map library built by javascript, it base on html5 canvas and svg. jsMind is released under [the BSD license](LICENSE), you can embed it in any project as long as you abide by the license..

## Project Home

-   [jsMind on Github](https://github.com/hizzgdev/jsmind)
-   [国内镜像 - Gitee](https://gitee.com/hizzgdev/jsmind)

## Get Started

```html
<html>
    <head>
        <link
            type="text/css"
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/jsmind@0.5/style/jsmind.css"
        />
        <script
            type="text/javascript"
            src="https://cdn.jsdelivr.net/npm/jsmind@0.5/es6/jsmind.js"
        ></script>
        <!--
            enable draggable node feature
            <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/jsmind@0.5/es6/jsmind.draggable-node.js"></script>
        -->
    </head>
    <body>
        <div id="jsmind_container"></div>

        <script type="text/javascript">
            var mind = {
                // 3 data formats were supported ...
                // see documents for more information
            };
            var options = {
                container: 'jsmind_container',
                theme: 'orange',
                editable: true,
            };
            var jm = new jsMind(options);
            jm.show(mind);
        </script>
    </body>
</html>
```

## Links
-   Resources:
    -   [NPM - jsmind](https://www.npmjs.com/package/jsmind)
    -   [CDN - jsDeliver](https://www.jsdelivr.com/package/npm/jsmind)
-   Apps :
    -   <https://jsmind.online>
    -   <https://jsmind.sinaapp.com>
-   Demo :
    -   [显示一个脑图 Render a mindmap](https://hizzgdev.github.io/jsmind/example/1_basic.html)
    -   [试用所有功能 Features simple](https://hizzgdev.github.io/jsmind/example/2_features.html)
    -   [ES6 Version](https://hizzgdev.github.io/jsmind/example/2_features_es6.html)
-   Document :
    -   [简体中文](docs/zh/)
    -   [English](docs/en/)
-   Donate :
    -   [Become a sponsor](https://github.com/sponsors/hizzgdev)
    -   [资助本项目的开发](https://hizzgdev.github.io/sponsor.html)

## ES6 Pilot Version

-   Launch Plan
    -   将于 2023 年上半年正式启用
    -   Will be launched in 2023 H1
-   NPM Pilot Version: `0.5.1`
-   Code Location
    -   源码位于 `/src`, 可运行于浏览器的 js 文件将生成于 `/es6`
    -   The source code is located in `/src`, and the js files that can run in browsers will be generated into `/es6`
-   Demo: <https://hizzgdev.github.io/jsmind/example/2_features_es6.html>

## Maintainer

-   [张志刚 - Zhigang Zhang](https://hizzgdev.github.io)
-   <hizzgdev@163.com>
