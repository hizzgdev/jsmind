/*
 * Released under BSD License
 * Copyright (c) 2014 hizzgdev@163.com
 * 
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */

(function($w){
    "use strict";
    var $d = $w.document;
    var __name__ = 'jsMind';
    var jsMind = $w[__name__];

    var jdom = jsMind.util.dom;
    var jcanvas = jsMind.util.canvas;

    var clear_selection = "getSelection" in $w ? function(){
         $w.getSelection().removeAllRanges();
    } : function(){
         $d.selection.empty();
    };

    var jd = null;

    jsMind.draggable = function(jm_){
        this.jm = jm_;
        this.e_canvas = null;
        this.canvas_ctx = null;
        this.shadow = null;
        this.active_node = null;
        this.client_w = 0;
        this.client_h = 0;
        this.offset_x = 0;
        this.offset_y = 0;
        this.hlookup = 0;
        this.capture = false;
    };

    jsMind.draggable.prototype = {
        init:function(){
            this._create_canvas();
            this._create_shadow();
            this._event_bind();
        },

        resize:function(){
            this.e_canvas.width=this.jm.view.size.w;
            this.e_canvas.height=this.jm.view.size.h;
        },

        _create_canvas:function(){
            var c = $d.createElement('canvas');
            this.jm.view.e_panel.appendChild(c);
            var ctx = c.getContext('2d');
            ctx.lineWidth = 10;
            ctx.strokeStyle = 'rgba(0,0,0,0.5)';
            this.e_canvas = c;
            this.canvas_ctx = ctx;
        },

        _create_shadow:function(){
            var s = $d.createElement('jmnode');
            s.style.visibility = 'hidden';
            s.style.zIndex = '3';
            s.style.cursor = 'move';
            s.style.opacity= '0.7';
            this.jm.view.e_nodes.appendChild(s);
            this.shadow = s;
        },

        show_shadow:function(el){
            var s = this.shadow.style;
            this.shadow.innerHTML = el.innerHTML;
            s.left = el.style.left;
            s.top = el.style.top;
            s.visibility = 'visible';
        },

        hide_shadow:function(){
            this.shadow.style.visibility = 'hidden';
        },

        clear_lines:function(){
            jcanvas.clear(this.canvas_ctx, 0, 0, this.jm.view.size.w, this.jm.view.size.h);
        },

        magnet_shadow:function(node){
            this.canvas_ctx.lineWidth = 6;
            this.canvas_ctx.strokeStyle = 'rgba(0,0,0,0.3)';
            this.clear_lines();
            jcanvas.lineto(this.canvas_ctx,
                node.p_s.x,
                node.p_s.y,
                node.p_n.x,
                node.p_n.y);
        },

        lookup_close_node:function(){
            var p_shadow = {x:(this.shadow.offsetLeft + this.shadow.clientWidth/2),
                y:(this.shadow.offsetTop + this.shadow.clientHeight/2)};
            var nodes = this.jm.mind.nodes;
            var el = null;
            var p = null;
            var node = null;
            var min_distance = Number.MAX_VALUE;
            var distance = 0;
            var closest_node = null;
            var closest_p = null;
            for(var nodeid in nodes){
                node = nodes[nodeid];
                el = node._data.view.element;
                p = {x:(el.offsetLeft+el.clientWidth/2),y:(el.offsetTop+el.clientHeight/2)};
                distance = Math.abs(p_shadow.x-p.x)+Math.abs(p_shadow.y-p.y);
                if(distance < min_distance){
                    closest_node = node;
                    closest_p = p;
                    min_distance = distance;
                }
            }
            return {
                node:closest_node,
                p_s:p_shadow,
                p_n:closest_p
            };
        },

        _event_bind:function(){
            var jd = this;
            var container = this.jm.view.container;
            jdom.add_event(container,'mousedown',function(e){jd.dragstart.call(jd,e);});
            jdom.add_event(container,'mousemove',function(e){jd.drag.call(jd,e);});
            jdom.add_event(container,'mouseup',function(e){jd.dragend.call(jd,e);});
        },

        dragstart:function(e){
            this.active_node = null;
            this.capture = false;

            var jd = this;
            var jview = this.jm.view;
            var el = e.target || event.srcElement;
            var isnode = jview.is_node(el);
            if(isnode){
                var nodeid = jview.get_nodeid(el);
                var node = this.jm.get_node(nodeid);
                if(!node.isroot){
                    this.show_shadow(el);
                    this.active_node = node;
                    this.offset_x = e.clientX - el.offsetLeft;
                    this.offset_y = e.clientY - el.offsetTop;
                    this.client_hw = Math.floor(el.clientWidth/2);
                    this.client_hh = Math.floor(el.clientHeight/2);
                    if(this.hlookup != 0){
                        $w.clearInterval(this.hlookup);
                    }
                    this.hlookup = $w.setInterval(function(){
                        var node = jd.lookup_close_node.call(jd);
                        jd.magnet_shadow.call(jd,node);
                    },300);
                    this.capture = true;
                }
            }
        },

        drag:function(e){
            if(this.capture){
                clear_selection();
                var px = e.clientX - this.offset_x;
                var py = e.clientY - this.offset_y;
                var cx = px + this.client_hw;
                var cy = py + this.client_hh;
                this.shadow.style.left = px + 'px';
                this.shadow.style.top = py + 'px';
                this.auto_line(cx,cy);
                clear_selection();
            }
        },

        dragend:function(e){
            if(this.capture){
                var src_node = this.active_node;
                var target_node = null;
                this.active_node = null;
                this.hide_shadow();
                this.capture = false;
                if(this.hlookup != 0){
                    $w.clearInterval(this.hlookup);
                    this.hlookup = 0;
                    this.clear_lines();
                }
                this.move_node(src_node,target_node);
            }
        },

        auto_line:function(x,y){
            //console.log(x+','+y);
        },

        move_node:function(src_node,target_node){
        }
    };

    var jm_event_handle = function(jm_, type, data){
        if(type === 'init'){
            jd = new jsMind.draggable(jm_);
            jd.init();
        }
        if(type === 'show'){//resize
            if(!!jd){
                jd.resize();
            }
        }
    };

    jsMind.add_event_handle(jm_event_handle);
})(window);
