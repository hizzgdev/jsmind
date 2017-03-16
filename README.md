jsMind
======

jsMind 是一个显示/编辑思维导图的纯 javascript 类库，其基于 html5 的 canvas 进行设计。jsMind 以 BSD 协议开源，在此基础上你可以在你的项目上任意使用。你可以在此浏览[适用于 jsMind 的 BSD 许可协议(中英文版本)][3]。

jsMind is a pure javascript library for mindmap, it base on html5 canvas. jsMind was released under BSD license, you can embed it in any project, if only you observe the license. You can read [the BSD license agreement for jsMind in English and Chinese version][3] here.

**jsmind 现已发布到 npm https://www.npmjs.com/package/jsmind**

Links:

* App : <http://jsmind.sinaapp.com>
* Home : <http://hizzgdev.github.io/jsmind/developer.html>
* Demo :
  * <http://hizzgdev.github.io/jsmind/example/1_basic.html>
  * <http://hizzgdev.github.io/jsmind/example/2_features.html>
* Documents :
  * [简体中文][1]
  * [English(draft)][2]
* Wiki :
  * [邮件列表 Mailing List](../../wiki/MailingList)
  * [热点问题 Hot Topics](../../wiki/HotTopics)
* Donate :
  * [资助本项目的开发][4]

Get Started:

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
                container:'jsmind_container',
                theme:'orange',
                editable:true
            };
            var jm = new jsMind(options);
            jm.show(mind);
        </script>
    </body>
</html>
```

[1]:docs/zh/index.md
[2]:docs/en/index.md
[3]:LICENSE
[4]:http://hizzgdev.github.io/jsmind/donate.html
