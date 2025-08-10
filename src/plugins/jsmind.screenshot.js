/**
 * @license BSD
 * @copyright 2014-2025 hizzgdev@163.com
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

/**
 * Default options for screenshot plugin.
 * @typedef {Object} ScreenshotOptions
 * @property {string|null} [filename]
 * @property {{left?:string|Location,right?:string}} [watermark]
 * @property {string} [background]
 */
const DEFAULT_OPTIONS = {
    filename: null,
    watermark: {
        left: $.w.location,
        right: 'https://github.com/hizzgdev/jsmind',
    },
    background: 'transparent',
};

/**
 * Screenshot plugin for jsMind.
 */
export class JmScreenshot {
    /**
     * Create screenshot plugin instance.
     * @param {import('../jsmind.js').default} jm - jsMind instance
     * @param {Partial<ScreenshotOptions>} options - Plugin options
     */
    constructor(jm, options) {
        var opts = {};
        jsMind.util.json.merge(opts, DEFAULT_OPTIONS);
        jsMind.util.json.merge(opts, options);

        this.version = '0.2.0';
        /** @type {import('../jsmind.js').default} */
        this.jm = jm;
        /** @type {ScreenshotOptions} */
        this.options = opts;
        /** @type {number} */
        this.dpr = jm.view.device_pixel_ratio;
    }

    /** Take a screenshot of the mind map. */
    shoot() {
        let c = this.create_canvas();
        let ctx = c.getContext('2d');
        ctx.scale(this.dpr, this.dpr);
        Promise.resolve(ctx)
            .then(() => this.draw_background(ctx))
            .then(() => this.draw_lines(ctx))
            .then(() => this.draw_nodes(ctx))
            .then(() => this.draw_watermark(c, ctx))
            .then(() => this.download(c))
            .then(() => this.clear(c));
    }

    /**
     * Create canvas for screenshot.
     * @returns {HTMLCanvasElement} Canvas element
     */
    create_canvas() {
        let c = $.c('canvas');
        const w = this.jm.view.size.w;
        const h = this.jm.view.size.h;
        c.width = w * this.dpr;
        c.height = h * this.dpr;
        c.style.width = w + 'px';
        c.style.height = h + 'px';

        c.style.visibility = 'hidden';
        this.jm.view.e_panel.appendChild(c);
        return c;
    }

    /**
     * Clean up canvas element.
     * @param {HTMLCanvasElement} c - Canvas to remove
     */
    clear(c) {
        c.parentNode.removeChild(c);
    }

    /**
     * Draw background on canvas.
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @returns {Promise<CanvasRenderingContext2D>} Promise resolving to context
     */
    draw_background(ctx) {
        return new Promise(
            function (resolve, _) {
                const bg = this.options.background;
                if (!!bg && bg !== 'transparent') {
                    ctx.fillStyle = this.options.background;
                    ctx.fillRect(0, 0, this.jm.view.size.w, this.jm.view.size.h);
                }
                resolve(ctx);
            }.bind(this)
        );
    }

    /**
     * Draw connection lines on canvas by copying from view graph.
     * @param {CanvasRenderingContext2D} ctx
     * @returns {Promise<CanvasRenderingContext2D>}
     */
    draw_lines(ctx) {
        return new Promise(
            function (resolve, _) {
                this.jm.view.graph.copy_to(ctx, function () {
                    resolve(ctx);
                });
            }.bind(this)
        );
    }

    /**
     * Draw node DOM into canvas via SVG snapshot.
     * @param {CanvasRenderingContext2D} ctx
     * @returns {Promise<CanvasRenderingContext2D>}
     */
    draw_nodes(ctx) {
        return domtoimage
            .toSvg(this.jm.view.e_nodes, { style: { zoom: 1 } })
            .then(this.load_image)
            .then(function (img) {
                ctx.drawImage(img, 0, 0);
                return ctx;
            });
    }

    /**
     * Draw watermark text on canvas.
     * @param {HTMLCanvasElement} c
     * @param {CanvasRenderingContext2D} ctx
     * @returns {CanvasRenderingContext2D}
     */
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

    /**
     * Load image from URL and resolve img element.
     * @param {string} url
     * @returns {Promise<HTMLImageElement>}
     */
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

    /**
     * Trigger download of canvas content as PNG.
     * @param {HTMLCanvasElement} c
     */
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

/**
 * Screenshot plugin registration.
 * @type {import('../jsmind.plugin.js').Plugin<Partial<ScreenshotOptions>>}
 */
export const screenshot_plugin = new jsMind.plugin('screenshot', function (jm, options) {
    var jmss = new JmScreenshot(jm, options);
    jm.screenshot = jmss;
    jm.shoot = function () {
        jmss.shoot();
    };
});

jsMind.register_plugin(screenshot_plugin);

export default JmScreenshot;
