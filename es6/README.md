# jsMind ES6 Version

jsMind is now written in ES6 code, the source code is in `/src`, and the dist directory is `/es6`.


### Compatible

All features in the JS version are fully compatible in the ES6 version.

### Migration

If you use `jsMind` via `NPM`, no migration is required, we just changed the `main` file to `es6/jsmind.js`

If you reference `jsMind` from CDN, the only thing you need to do is change the url from `js/*.js` to `es6/*.js`.

E.g.

```html
<!-- before -->
<script type="text/javascript" src="//cdn.jsdelivr.net/npm/jsmind/js/jsmind.js"></script>

<!-- after -->
<script type="text/javascript" src="//cdn.jsdelivr.net/npm/jsmind/es6/jsmind.js"></script>
```

### Deprecation

The legacy version `/js` will be kept in repo for serval months, and then will be removed in a version with a break change alert.

### Local build

You probably notice that there is no `js` files or `es6` files in the directory `/es6`. Yes, we publish the dist file to `NPM` but don't store them in the repo. 

If you can not refer the resource from CDN, the dist files can be built by running `npm run build` in the root dir of the project. see details for [development](../docs/en/5.development.md)

