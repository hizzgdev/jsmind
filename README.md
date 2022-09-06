# jsMind

![build-test](https://github.com/hizzgdev/jsmind/actions/workflows/node.js.yml/badge.svg)

jsMind 是一个显示/编辑思维导图的纯 javascript 类库，其基于 html5 canvas (和 svg) 进行设计。jsMind 以 BSD 协议开源，在此基础上你可以在你的项目上任意使用。你可以在此浏览[适用于 jsMind 的 BSD 许可协议(中英文版本)][3]。

jsMind is a pure javascript library for mindmap, it base on html5 canvas and svg. jsMind was released under BSD license, you can embed it in any project, if only you observe the license. You can read [the BSD license agreement for jsMind in English and Chinese version][3] here.

## Get Started

```html
<html>
    <head>
        <link type="text/css" rel="stylesheet" href="style/jsmind.css" />
        <script type="text/javascript" src="js/jsmind.js"></script>
        <!--
            enable drag-and-drop feature
            <script type="text/javascript" src="js/jsmind.draggable.js"></script>
        -->
    </head>
    <body>
        <div id="jsmind_container"></div>

        <script type="text/javascript">
            var mind = {
                // 3 data formats were supported ...
                // see Documents for more information
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

-   App : <http://jsmind.sinaapp.com>
-   Home : <http://hizzgdev.github.io/jsmind/developer.html>
-   npm : <https://www.npmjs.com/package/jsmind>
-   Demo :
    -   <http://hizzgdev.github.io/jsmind/example/1_basic.html>
    -   <http://hizzgdev.github.io/jsmind/example/2_features.html>
    -   <http://hizzgdev.github.io/jsmind/example/3_mathjax.html>
-   Documents :
    -   [简体中文][1]
    -   [English][2]
-   Wiki :
    -   [邮件列表 Mailing List](../../wiki/MailingList)
    -   [热点问题 Hot Topics](../../wiki/HotTopics)
-   Donate :
    -   [Become a sponsor][4]
    -   [资助本项目的开发][5]

## ES6 Pilot Version

-   目前处于测试阶段，欢迎试用找 bug, ES6 代码位于 `/src`, 可运行于浏览器的 js 文件位于 `/es6`
-   Currently it's in the testing stage, You are welcome to serve as a guinea pig, the ES6 code is located in `/src`, and the js files that can run in browsers are located in `/es6`
-   Demo <http://hizzgdev.github.io/jsmind/example/2_features_es6.html>

## Maintainer

-   [张志刚 | Zhigang Zhang](https://hizzgdev.github.io)
-   hizzgdev@163.com

[1]: docs/zh/index.md
[2]: docs/en/index.md
[3]: LICENSE
[4]: https://github.com/sponsors/hizzgdev
[5]: http://hizzgdev.github.io/sponsor.html
