/**
 * @license BSD
 * @copyright 2014-2023 hizzgdev@163.com
 *
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */

import jsMind from 'jsmind';
import domtoimage from 'dom-to-image';

if (!jsMind) {
    throw new Error('jsMind is not defined');
}

if (!domtoimage) {
    throw new Error('dom-to-image is required');
}

const $ = jsMind.$;

const DEFAULT_OPTIONS = {
    filename: null,
    watermark: {
        left: $.w.location,
        right: 'https://github.com/hizzgdev/jsmind',
    },
};

class JmScreenshot {
    constructor(jm, options) {
        var opts = {};
        jsMind.util.json.merge(opts, DEFAULT_OPTIONS);
        jsMind.util.json.merge(opts, options);

        this.version = '0.2.0';
        this.jm = jm;
        this.options = opts;
    }

    shoot() {
        let c = this.create_canvas();
        let ctx = c.getContext('2d');
        Promise.resolve(ctx)
            .then(() => this.draw_lines(ctx))
            .then(() => this.draw_nodes(ctx))
            .then(() => this.draw_watermark(c, ctx))
            .then(() => this.download(c))
            .then(() => this.clear(c));
    }

    create_canvas() {
        let c = $.c('canvas');
        c.width = this.jm.view.size.w;
        c.height = this.jm.view.size.h;
        c.style.visibility = 'hidden';
        this.jm.view.e_panel.appendChild(c);
        return c;
    }

    clear(c) {
        c.parentNode.removeChild(c);
    }

    draw_lines(ctx) {
        return new Promise(
            function (resolve, _) {
                this.jm.view.graph.copy_to(ctx, function () {
                    resolve(ctx);
                });
            }.bind(this)
        );
    }

    draw_nodes(ctx) {
        return domtoimage
            .toSvg(this.jm.view.e_nodes, { style: { zoom: 1 } })
            .then(this.load_image)
            .then(function (img) {
                ctx.drawImage(img, 0, 0);
                return ctx;
            });
    }

    draw_watermark(c, ctx) {
        ctx.textBaseline = 'bottom';
        ctx.fillStyle = '#000';
        ctx.font = '11px Verdana,Arial,Helvetica,sans-serif';
        if (!!this.options.watermark.left) {
            ctx.textAlign = 'left';
            ctx.fillText(this.options.watermark.left, 5.5, c.height - 2.5);
        }
        if (!!this.options.watermark.right) {
            ctx.textAlign = 'right';
            ctx.fillText(this.options.watermark.right, c.width - 5.5, c.height - 2.5);
        }
        return ctx;
    }

    load_image(url) {
        return new Promise(function (resolve, reject) {
            let img = new Image();
            img.onload = function () {
                resolve(img);
            };
            img.onerror = reject;
            img.src = url;
        });
    }

    download(c) {
        var name = (this.options.filename || this.jm.mind.name) + '.png';

        if (navigator.msSaveBlob && !!c.msToBlob) {
            var blob = c.msToBlob();
            navigator.msSaveBlob(blob, name);
        } else {
            var blob_url = c.toDataURL();
            var anchor = $.c('a');
            if ('download' in anchor) {
                anchor.style.visibility = 'hidden';
                anchor.href = blob_url;
                anchor.download = name;
                $.d.body.appendChild(anchor);
                var evt = $.d.createEvent('MouseEvents');
                evt.initEvent('click', true, true);
                anchor.dispatchEvent(evt);
                $.d.body.removeChild(anchor);
            } else {
                location.href = blob_url;
            }
        }
    }
}

let screenshot_plugin = new jsMind.plugin('screenshot', function (jm, options) {
    var jmss = new JmScreenshot(jm, options);
    jm.screenshot = jmss;
    jm.shoot = function () {
        jmss.shoot();
    };
});

jsMind.register_plugin(screenshot_plugin);
