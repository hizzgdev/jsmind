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

    var clear_selection = "getSelection" in $w ? function(){
         $w.getSelection().removeAllRanges();
    } : function(){
         $d.selection.empty();
    };

    jsMind.draggable = function(jm_){
        this.jm = jm_;
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
            this._create_shadow();
            this._event_bind();
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

        //shadow_follow:function(

        _lookup_close_node:function(){
            var nodes = this.jm.mind.nodes;
            var node = null;
            var nel = null;
            var min_distance = Number.MAX_VALUE;
            var distance = 0;
            var closest_node = null;
            var shadow_y = this.shadow.offsetTop;
            var node_direction = 0;
            for(var nodeid in nodes){
                node = nodes[nodeid];
                nel = node._data.view.element;
                console.log('math.abs('+shadow_y+','+nel.offsetTop);
                distance = Math.abs(shadow_y - nel.offsetTop);
                console.log(node.topic+':'+distance+'; =>'+min_distance);
                if(distance < min_distance){
                    console.log(min_distance);
                    min_distance = distance;
                    closest_node = node;
                }
            }
            console.log(closest_node);
            if(node.direction == jsMind.direction.center){
                node_direction = distance>0?jsMind.direction.left:jsMind.direction.right;
            }else{
                node_direction = node.direction;
            }
            return node;
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
                        jd._lookup_close_node.call(jd);},1000);
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
                this.active_node = null;
                this.hide_shadow();
                this.capture = false;
                if(this.hlookup != 0){
                    $w.clearInterval(this.hlookup);
                    this.hlookup = 0;
                }
            }
        },

        auto_line:function(x,y){
            //console.log(x+','+y);
        },

        move_node:function(){
        }
    };

    var jm_event_handle = function(jm_, type, data){
        if(type === 'init'){
            var jd = new jsMind.draggable(jm_);
            jd.init();
        }
    };

    jsMind.add_event_handle(jm_event_handle);
})(window);
