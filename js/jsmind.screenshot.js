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
    /*
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x+r, y);
  this.arcTo(x+w, y,   x+w, y+h, r);
  this.arcTo(x+w, y+h, x,   y+h, r);
  this.arcTo(x,   y+h, x,   y,   r);
  this.arcTo(x,   y,   x+w, y,   r);
  this.closePath();
  return this;
}
*/

    var jcanvas = jsMind.util.canvas;

    jsMind.screenshot = function(jm){
        this.jm = jm;
    };

    jsMind.screenshot.prototype = {
        shoot:function(){
            var e_canvas = this._create_canvas();
            this._draw(e_canvas);
            this._drop_canvas(_canvas);
        },

        _create_canvas:function(){
            var c = $d.createElement('canvas');
            var jm_size = this.jm.view.size;
            c.width=jm_size.w;
            c.height=jm_size.h;
            //this.jm.view.e_panel.appendChild(c);
            return c;
        },

        _draw:function(c){
            var ctx = c.getContext('2d');
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
