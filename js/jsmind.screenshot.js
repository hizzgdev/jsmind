/*
 * Released under BSD License
 * Copyright (c) 2014-2015 hizzgdev@163.com
 * 
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */

(function($w){
    'use strict';
    var $d = $w.document;
    var __name__ = 'jsMind';
    var jsMind = $w[__name__];
    if(!jsMind){return;}
    if(typeof jsMind.screenshot != 'undefined'){return;}

    var jcanvas = jsMind.util.canvas;
    jcanvas.roundRect = function (ctx,x,y,w,h,r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        ctx.beginPath();
        ctx.moveTo(x+r, y);
        ctx.arcTo(x+w, y,   x+w, y+h, r);
        ctx.arcTo(x+w, y+h, x,   y+h, r);
        ctx.arcTo(x,   y+h, x,   y,   r);
        ctx.arcTo(x,   y,   x+w, y,   r);
        ctx.closePath();
    };

    jcanvas.fillText = function (ctx,text,x,y,w,h){
        var center_x = x+w/2;
        var center_y = y+h/2;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text,center_x,center_y);
    };


    jsMind.screenshot = function(jm){
        this.jm = jm;
    };

    jsMind.screenshot.prototype = {
        shoot:function(){
            var e_canvas = this._create_canvas();
            this._draw(e_canvas);
            this._drop_canvas(e_canvas);
        },

        _create_canvas:function(){
            var c = $d.createElement('canvas');
            c.setAttribute('a','a');
            var jm_size = this.jm.view.size;
            c.width=jm_size.w;
            c.height=jm_size.h;
            this.jm.view.e_panel.appendChild(c);
            return c;
        },

        _draw:function(c){
            var ctx = c.getContext('2d');
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            this._draw_nodes(ctx);
        },

        _draw_nodes:function(ctx){
            var nodes = this.jm.mind.nodes;
            var node;
            for(var nodeid in nodes){
                node = nodes[nodeid];
                this._draw_node(ctx,node);
            }
        },

        _draw_node:function(ctx,node){
            var node_element = node._data.view.element;
            var node_style = getComputedStyle(node_element);
            var bgcolor = node_style.getPropertyValue('background-color');
            var style_round_radius = node_style.getPropertyValue('border-radius');
            var round_radius = parseInt(style_round_radius);
            var color = node_style.getPropertyValue('color');
            var font = node_style.getPropertyValue('font');
            var view_data = node._data.view;

            console.log(font);

            ctx.font=font;
            ctx.fillStyle = bgcolor;
            jcanvas.roundRect(ctx, view_data.abs_x,view_data.abs_y,
                view_data.width+2, view_data.height+2, round_radius);
            ctx.fill();
            ctx.fillStyle = color;
            jcanvas.fillText(ctx, node.topic,
                view_data.abs_x, view_data.abs_y,
                view_data.width, view_data.height);
        },

        _drop_canvas:function(c){
        }
    };

    var screenshot_plugin = new jsMind.plugin('screenshot',function(jm){
        var jss = new jsMind.screenshot(jm);
        jm.screenshot = jss;
    });

    jsMind.register_plugin(screenshot_plugin);

})(window);
