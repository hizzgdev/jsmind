# jsMind

[![npm version](https://badge.fury.io/js/jsmind.svg)](https://www.npmjs.com/package/jsmind)
![build-test](https://github.com/hizzgdev/jsmind/actions/workflows/node.js.yml/badge.svg)

jsMind 是一个显示/编辑思维导图的纯 javascript 类库，其基于 html5 canvas 和 svg 进行设计。jsMind 以 [BSD 协议开源](LICENSE)，在此基础上你可以在你的项目上任意使用。

jsMind is mind map library built by javascript, it base on html5 canvas and svg. jsMind is released under [the BSD license](LICENSE), you can embed it in any project as long as you abide by the license.

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
            href="//cdn.jsdelivr.net/npm/jsmind@0.8.7/style/jsmind.css"
        />
        <script
            type="text/javascript"
            src="//cdn.jsdelivr.net/npm/jsmind@0.8.7/es6/jsmind.js"
        ></script>
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
    -   [文档 - Documents](https://hizzgdev.github.io/jsmind/docs)
    -   [NPM - jsmind](https://www.npmjs.com/package/jsmind)
    -   CDN - [用法](docs/zh/1.usage.md) [Usage](docs/en/1.usage.md)
        -   [UNPKG](https://unpkg.com/browse/jsmind/)
        -   [jsDelivr](https://www.jsdelivr.com/package/npm/jsmind/)
        -   [jsDelivr 国内镜像](https://jsd.onmicrosoft.cn/npm/jsmind/)
-   Apps :
    -   <https://jsmind.online>
-   Demo :
    -   [显示一个脑图 Render a mindmap](https://hizzgdev.github.io/jsmind/example/1_basic.html) [[国内版](https://hizzgdev.github.io/jsmind/example/1_basic_cn.html)]
    -   [试用所有功能 Try all features](https://hizzgdev.github.io/jsmind/example/2_features.html) [[国内版](https://hizzgdev.github.io/jsmind/example/2_features_cn.html)]
    -   [requirejs + jsMind](https://hizzgdev.github.io/jsmind/example/3_requirejs.html)
    -   [更多示例 - More samples](https://github.com/hizzgdev/jsmind-samples) [[国内版](https://gitee.com/hizzgdev/jsmind-samples)]

## Funding

-   [致谢 - Acknowledgement](https://hizzgdev.github.io/acknowledgement.html)
-   [资助 - Sponsor](https://hizzgdev.github.io/sponsor.html)

## Maintainer

-   [张志刚 - Zhigang Zhang](https://hizzgdev.github.io)
