## 更改内容

[jsmind.graph.js](src\jsmind.graph.js)

```js
    set_size(w, h) {
        let dpr = this.getPixelRatio();

        // 设置实际的canvas尺寸
        this.e_canvas.width = w * dpr;
        this.e_canvas.height = h * dpr;

        // 设置canvas的样式尺寸为逻辑像素
        this.e_canvas.style.width = w + 'px';
        this.e_canvas.style.height = h + 'px';

        // 更新内部尺寸记录
        this.size.w = w;
        this.size.h = h;

        // 由于设置canvas尺寸会重置上下文，因此需要重新调用scale
        this.canvas_ctx.scale(dpr, dpr); // 设置缩放比例
    }
```

> 修复高分辨率的设备下，canvas 线条模糊的问题
