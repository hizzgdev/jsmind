# jsMind ES6 Version

[中文] | [[English](README-en.md)]

jsMind 使用 ES6 编写，源代码位于 `/src`，构建目录为 `/es6`。


### 兼容性

之前 JS 版本里的所有功能，在 ES6 的版本中都是兼容的。

### 迁移到新版

如果你是通过 `NPM` 引用的 `jsMind`，则无须手动迁移，我们只是在 `project.json` 里将 `main` 修改成了 `es6/jsmind.js` 。

如果你是通过 CDN 引用 `jsMind` 的话，你仅仅需要把 url 从 `js/*.js` 改成 `es6/*.js` 。 如：

```html
<!-- 修改前 -->
<script type="text/javascript" src="//cdn.jsdelivr.net/npm/jsmind/js/jsmind.js"></script>

<!-- 修改后 -->
<script type="text/javascript" src="//cdn.jsdelivr.net/npm/jsmind/es6/jsmind.js"></script>
```

### 老版本下线

之前的版本被移动到了 `/js-legacy` 目录里，我们将不再升级它，并会在未来的某个时间里删除此版本，建议所有人使用最新版本以获得最新的功能及bug修复。

### 本地构建

你可能注意到了，在 `es6` 这个目录里没有任何 `js` 或 `es` 文件。是的，构建的文件仅会被包含在 `NPM` 里，但并不会保留在代码库中。

你可以从 CDN 上下载这些文件，也可以在你本地构建，只需在项目根目录里运行 `npm run build` 即可。更详细的介绍可参考[贡献代码指南](../docs/zh/5.development.md)里的相关内容。
