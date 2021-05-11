/*
 * Released under BSD License
 * Copyright (c) 2014-2015 hizzgdev@163.com
 *
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */

(function($w) {
    'use strict';

    var __name__ = 'jsMind';
    var jsMind = $w[__name__];
    if (!jsMind) {
        return;
    }
    if (typeof jsMind.screenshot != 'undefined') {
        return;
    }

    var $d = $w.document;
    var $c = function(tag) {
        return $d.createElement(tag);
    };

    var css = function(cstyle, property_name) {
        return cstyle.getPropertyValue(property_name);
    };
    var is_visible = function(cstyle) {
        var visibility = css(cstyle, 'visibility');
        var display = css(cstyle, 'display');
        return (visibility !== 'hidden' && display !== 'none');
    };
    var jcanvas = jsMind.util.canvas;
    jcanvas.rect = function(ctx, x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
    };

    jcanvas.text_multiline = function(ctx, text, x, y, w, h, lineheight) {
        var line = '';
        var text_len = text.length;
        var chars = text.split('');
        var test_line = null;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        for (var i = 0; i < text_len; i++) {
            test_line = line + chars[i];
            if (ctx.measureText(test_line).width > w && i > 0) {
                ctx.fillText(line, x, y);
                line = chars[i];
                y += lineheight;
            } else {
                line = test_line;
            }
        }
        ctx.fillText(line, x, y);
    };

    jcanvas.text_ellipsis = function(ctx, text, x, y, w, h) {
        var center_y = y + h / 2;
        var text = jcanvas.fittingString(ctx, text, w);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x, center_y, w);
    };

    jcanvas.fittingString = function(ctx, text, max_width) {
        var width = ctx.measureText(text).width;
        var ellipsis = '…'
        var ellipsis_width = ctx.measureText(ellipsis).width;
        if (width <= max_width || width <= ellipsis_width) {
            return text;
        } else {
            var len = text.length;
            while (width >= max_width - ellipsis_width && len-- > 0) {
                text = text.substring(0, len);
                width = ctx.measureText(text).width;
            }
            return text + ellipsis;
        }
    };

    jcanvas.image = function(ctx, backgroundUrl, x, y, w, h, r, rotation, callback) {
        var img = new Image();
        img.onload = function() {
            ctx.save();
            ctx.translate(x, y);
            ctx.save();
            ctx.beginPath();
            jcanvas.rect(ctx, 0, 0, w, h, r);
            ctx.closePath();
            ctx.clip();
            ctx.translate(w / 2, h / 2);
            ctx.rotate(rotation * Math.PI / 180);
            ctx.drawImage(img, -w / 2, -h / 2);
            ctx.restore();
            ctx.restore();
            callback();
        }
        img.src = backgroundUrl;
    };

    jsMind.screenshot = function(jm) {
        this.jm = jm;
        this.canvas_elem = null;
        this.canvas_ctx = null;
        this._inited = false;
    };

    jsMind.screenshot.prototype = {
        init: function() {
            if (this._inited) {
                return;
            }
            console.log('init');
            var c = $c('canvas');
            var ctx = c.getContext('2d');

            this.canvas_elem = c;
            this.canvas_ctx = ctx;
            this.jm.view.e_panel.appendChild(c);
            this._inited = true;
            this.resize();
        },

        shoot: function(callback) {
            this.init();
            var jms = this;
            this._draw(function() {
                if (!!callback) {
                    callback(jms);
                }
                jms.clean();
            });
            this._watermark();
        },

        shootDownload: function(qrcode_url) {
            this.qrcode_url = qrcode_url;
            this.shoot(function(jms) {
                jms._download();
            });
            this.qrcode_url = null;
        },

        shootAsDataURL: function(callback, qrcode_url) {
            this.qrcode_url = qrcode_url
            this.shoot(function(jms) {
                callback(jms.canvas_elem.toDataURL());
            });
            this.qrcode_url = null;
        },

        shootAsDataURL_center: function(callback) {
            this.shoot(function(jms) {
                var w = 960;
                var h = 800;
                var l = (jms.canvas_elem.width - w) / 2;
                var t = (jms.canvas_elem.height - h) / 2;

                var c = document.createElement("canvas")
                var ctx = c.getContext("2d");
                var ImageData = jms.canvas_ctx.getImageData(l, t, w, h);
                c.width = w
                c.height = h
                ctx.putImageData(ImageData, 0, 0);
                callback(c.toDataURL(0.1));
            });
        },

        resize: function() {
            if (this._inited) {
                this.canvas_elem.width = this.jm.view.size.w;
                this.canvas_elem.height = this.jm.view.size.h;
            }
        },

        clean: function() {
            var c = this.canvas_elem;
            this.canvas_ctx.clearRect(0, 0, c.width, c.height);
        },

        _draw: function(callback) {
            var ctx = this.canvas_ctx;
            var c = this.canvas_elem;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillStyle = '#FFF'
            ctx.fillRect(0, 0, c.width, c.height);
            this._draw_lines();
            this._draw_nodes(callback);
        },

        _watermark: function() {
            var c = this.canvas_elem;
            var ctx = this.canvas_ctx;
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';
            ctx.fillStyle = '#000';
            ctx.font = '11px Verdana,Arial,Helvetica,sans-serif';
            // ctx.fillText('hizzgdev.github.io/jsmind', c.width - 5.5, c.height - 2.5);
            ctx.textAlign = 'left';
            // ctx.fillText($w.location, 5.5, c.height - 2.5);

            var img = new Image();
            img.setAttribute("crossOrigin", 'Anonymous')
            img.onload = function() {
                ctx.drawImage(img, c.width - 300, c.height - 115, 90, 90);
            };
            img.src = 'https://www.socialwiki.cn/static/template/logo.jpg';
            // img.src = 'http://127.0.0.1:9000/static/template/logo.jpg';

            if (!this.qrcode_url) {
                return;
            }

            var img2 = new Image();
            img2.setAttribute("crossOrigin", 'Anonymous')
            img2.onload = function() {
                ctx.drawImage(img2, c.width - 150, c.height - 120, 100, 100);
            };
            img2.src = this.qrcode_url;

        },

        _draw_lines: function() {
            // this.jm.view.show_lines(this.canvas_ctx);
            var nodes = this.jm.mind.nodes;
            var node = null;
            var pin = null;
            var pout = null;
            var _offset = this.jm.view.get_view_offset();
            for (var nodeid in nodes) {
                node = nodes[nodeid];
                if (!!node.isroot) {
                    continue;
                }
                if (('visible' in node._data.layout) && !node._data.layout.visible) {
                    continue;
                }
                pin = this.jm.view.layout.get_node_point_in(node);
                pout = this.jm.view.layout.get_node_point_out(node.parent);
                this.jm.view.draw_line(pout, pin, _offset, this.canvas_ctx);
            }
        },

        _draw_nodes: function(callback) {
            var nodes = this.jm.mind.nodes;
            var node;
            for (var nodeid in nodes) {
                node = nodes[nodeid];
                this._draw_node(node);
            }

            function check_nodes_ready() {
                console.log('check_node_ready' + new Date());
                var allOk = true;
                for (var nodeid in nodes) {
                    node = nodes[nodeid];
                    allOk = allOk & node.ready;
                }

                if (!allOk) {
                    $w.setTimeout(check_nodes_ready, 200);
                } else {
                    $w.setTimeout(callback, 200);
                }
            }
            check_nodes_ready();
        },

        _draw_node: function(node) {
            var ctx = this.canvas_ctx;
            var view_data = node._data.view;
            var node_element = view_data.element;
            var ncs = getComputedStyle(node_element);
            if (!is_visible(ncs)) {
                node.ready = true;
                return;
            }

            var bgcolor = css(ncs, 'background-color');
            var round_radius = parseInt(css(ncs, 'border-top-left-radius'));
            var color = css(ncs, 'color');
            var padding_left = parseInt(css(ncs, 'padding-left'));
            var padding_right = parseInt(css(ncs, 'padding-right'));
            var padding_top = parseInt(css(ncs, 'padding-top'));
            var padding_bottom = parseInt(css(ncs, 'padding-bottom'));
            var text_overflow = css(ncs, 'text-overflow');
            var font = css(ncs, 'font-style') + ' ' +
                css(ncs, 'font-variant') + ' ' +
                css(ncs, 'font-weight') + ' ' +
                css(ncs, 'font-size') + '/' + css(ncs, 'line-height') + ' ' +
                css(ncs, 'font-family');

            var rb = {
                x: view_data.abs_x,
                y: view_data.abs_y,
                w: view_data.width + 1,
                h: view_data.height + 1
            };
            var tb = {
                x: rb.x + padding_left,
                y: rb.y + padding_top,
                w: rb.w - padding_left - padding_right,
                h: rb.h - padding_top - padding_bottom
            };

            ctx.font = font;
            ctx.fillStyle = bgcolor;
            ctx.beginPath();
            jcanvas.rect(ctx, rb.x, rb.y, rb.w, rb.h, round_radius);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = color;
            if ('background-image' in node.data) {
                var backgroundUrl = css(ncs, 'background-image').slice(5, -2);
                node.ready = false;
                var rotation = 0;
                if ('background-rotation' in node.data) {
                    rotation = node.data['background-rotation'];
                }
                jcanvas.image(ctx, backgroundUrl, rb.x, rb.y, rb.w, rb.h, round_radius, rotation,
                    function() {
                        node.ready = true;
                    });
            }
            if (!!node.topic) {
                if (text_overflow === 'ellipsis') {
                    jcanvas.text_ellipsis(ctx, node.topic, tb.x, tb.y, tb.w, tb.h);
                } else {
                    var line_height = parseInt(css(ncs, 'line-height'));
                    jcanvas.text_multiline(ctx, node.topic, tb.x, tb.y, tb.w, tb.h, line_height);
                }
            }
            if (!!view_data.expander) {
                this._draw_expander(view_data.expander);
            }
            if (!('background-image' in node.data)) {
                node.ready = true;
            }
        },

        _draw_expander: function(expander) {
            var ctx = this.canvas_ctx;
            var ncs = getComputedStyle(expander);
            if (!is_visible(ncs)) {
                return;
            }

            var style_left = css(ncs, 'left');
            var style_top = css(ncs, 'top');
            var font = css(ncs, 'font');
            var left = parseInt(style_left);
            var top = parseInt(style_top);
            var is_plus = expander.innerHTML === '+';

            ctx.lineWidth = 1;

            ctx.beginPath();
            ctx.arc(left + 7, top + 7, 5, 0, Math.PI * 2, true);
            ctx.moveTo(left + 10, top + 7);
            ctx.lineTo(left + 4, top + 7);
            if (is_plus) {
                ctx.moveTo(left + 7, top + 4);
                ctx.lineTo(left + 7, top + 10);
            }
            ctx.closePath();
            ctx.stroke();
        },

        _download: function() {
            var c = this.canvas_elem;
            var name = this.jm.mind.name + '.png';

            if (navigator.msSaveBlob && (!!c.msToBlob)) {
                var blob = c.msToBlob();
                navigator.msSaveBlob(blob, name);
            } else {
                var bloburl = this.canvas_elem.toDataURL();
                var anchor = $c('a');
                if ('download' in anchor) {
                    anchor.style.visibility = 'hidden';
                    anchor.href = bloburl;
                    anchor.download = name;
                    $d.body.appendChild(anchor);
                    var evt = $d.createEvent('MouseEvents');
                    evt.initEvent('click', true, true);
                    anchor.dispatchEvent(evt);
                    $d.body.removeChild(anchor);
                } else {
                    location.href = bloburl;
                }
            }
        },

        jm_event_handle: function(type, data) {
            if (type === jsMind.event_type.resize) {
                this.resize();
            }
        }
    };

    var screenshot_plugin = new jsMind.plugin('screenshot', function(jm) {
        var jss = new jsMind.screenshot(jm);
        jm.screenshot = jss;
        jm.shoot = function() {
            jss.shoot();
        };
        jm.add_event_listener(function(type, data) {
            jss.jm_event_handle.call(jss, type, data);
        });
    });

    jsMind.register_plugin(screenshot_plugin);

})(window);