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
        this.shadow_w = 0;
        this.shadow_h = 0;
        this.active_node = null;
        this.target_node = null;
        this.target_direct = null;
        this.client_w = 0;
        this.client_h = 0;
        this.offset_x = 0;
        this.offset_y = 0;
        this.hlookup = 0;
        this.capture = false;
        this.moved = false;
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

        reset_shadow:function(el){
            var s = this.shadow.style;
            this.shadow.innerHTML = el.innerHTML;
            s.left = el.style.left;
            s.top = el.style.top;
            this.shadow_w = this.shadow.clientWidth;
            this.shadow_h = this.shadow.clientHeight;
        },

        show_shadow:function(){
            if(!this.moved){
                this.shadow.style.visibility = 'visible';
            }
        },

        hide_shadow:function(){
            this.shadow.style.visibility = 'hidden';
        },

        clear_lines:function(){
            jcanvas.clear(this.canvas_ctx, 0, 0, this.jm.view.size.w, this.jm.view.size.h);
        },

        _magnet_shadow:function(node){
            this.canvas_ctx.lineWidth = 6;
            this.canvas_ctx.strokeStyle = 'rgba(0,0,0,0.3)';
            this.clear_lines();
            jcanvas.lineto(this.canvas_ctx,
                node.sp.x,
                node.sp.y,
                node.np.x,
                node.np.y);
        },

        _lookup_close_node:function(){
            var root = this.jm.get_root();
            var root_el = root._data.view.element;
            var root_x = root_el.offsetLeft + root_el.clientWidth/2;

            var sw = this.shadow_w;
            var sh = this.shadow_h;
            var sx = this.shadow.offsetLeft;
            var sy = this.shadow.offsetTop;

            var nw,nh,nx,ny;

            var direct = (sx + sw/2)>=root_x ?
                            jsMind.direction.right : jsMind.direction.left;
            var nodes = this.jm.mind.nodes;
            var node = null;
            var el = null;
            var min_distance = Number.MAX_VALUE;
            var distance = 0;
            var closest_node = null;
            var closest_p = null;
            var shadow_p = null;
            for(var nodeid in nodes){
                var np,sp;
                node = nodes[nodeid];
                if(node.isroot || node.direction == direct){
                    el = node._data.view.element;
                    nw = el.clientWidth;
                    nh = el.clientHeight;
                    nx = el.offsetLeft;
                    ny = el.offsetTop;
                    if(direct == jsMind.direction.right){
                        distance = Math.abs(sx-nx-nw) + Math.abs(sy+sh/2-ny-nh/2);
                        np = {x:nx+nw,y:ny+nh/2};
                        sp = {x:sx,y:sy+sh/2};
                    }else{
                        distance = Math.abs(sx+sw-nx) + Math.abs(sy+sh/2-ny-nh/2);
                        np = {x:nx,y:ny+nh/2};
                        sp = {x:sx+sw,y:sy+sh/2};
                    }
                    if(distance < min_distance){
                        closest_node = node;
                        closest_p = np;
                        shadow_p = sp;
                        min_distance = distance;
                    }
                }
            }
            return {
                node:closest_node,
                direction:direct,
                sp:shadow_p,
                np:closest_p
            };
        },

        lookup_close_node:function(){
            var node_data = this._lookup_close_node();
            this._magnet_shadow(node_data);
            this.target_node = node_data.node;
            this.target_direct = node_data.direction;
        },

        _event_bind:function(){
            var jd = this;
            var container = this.jm.view.container;
            jdom.add_event(container,'mousedown',function(e){jd.dragstart.call(jd,e);});
            jdom.add_event(container,'mousemove',function(e){jd.drag.call(jd,e);});
            jdom.add_event(container,'mouseup',function(e){jd.dragend.call(jd,e);});
        },

        dragstart:function(e){
            if(this.capture){return;}
            this.active_node = null;

            var jd = this;
            var jview = this.jm.view;
            var el = e.target || event.srcElement;
            var isnode = jview.is_node(el);
            if(isnode){
                var nodeid = jview.get_nodeid(el);
                var node = this.jm.get_node(nodeid);
                if(!node.isroot){
                    this.reset_shadow(el);
                    this.active_node = node;
                    this.offset_x = e.clientX - el.offsetLeft;
                    this.offset_y = e.clientY - el.offsetTop;
                    this.client_hw = Math.floor(el.clientWidth/2);
                    this.client_hh = Math.floor(el.clientHeight/2);
                    if(this.hlookup != 0){
                        $w.clearInterval(this.hlookup);
                    }
                    this.hlookup = $w.setInterval(function(){
                        jd.lookup_close_node.call(jd);
                    },300);
                    this.capture = true;
                }
            }
        },

        drag:function(e){
            if(this.capture){
                this.show_shadow();
                this.moved = true;
                clear_selection();
                var px = e.clientX - this.offset_x;
                var py = e.clientY - this.offset_y;
                var cx = px + this.client_hw;
                var cy = py + this.client_hh;
                this.shadow.style.left = px + 'px';
                this.shadow.style.top = py + 'px';
                clear_selection();
            }
        },

        dragend:function(e){
            if(this.capture){
                if(this.hlookup != 0){
                    $w.clearInterval(this.hlookup);
                    this.hlookup = 0;
                    this.clear_lines();
                }
                if(this.moved){
                    var src_node = this.active_node;
                    var target_node = this.target_node;
                    var target_direct = this.target_direct;
                    this.move_node(src_node,target_node,target_direct);
                }
                this.hide_shadow();
            }
            this.moved = false;
            this.capture = false;
        },

        move_node:function(src_node,target_node,target_direct){
            if(!!target_node && !!src_node && !jsMind.node.inherited(src_node, target_node)){
                this.jm.move_node(src_node, '_last_', target_node.id, target_direct);
            }
            this.active_node = null;
            this.target_node = null;
            this.target_direct = null;
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
