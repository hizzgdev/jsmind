/*
 * Released under BSD License
 * Copyright (c) 2014-2015 hizzgdev@163.com
 * 
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */

(function ($w) {
    'use strict';
    var $d = $w.document;
    var __name__ = 'jsMind';
    var jsMind = $w[__name__];
    if (!jsMind) { return; }
    if (typeof jsMind.draggable != 'undefined') { return; }

    var jdom = jsMind.util.dom;
    var clear_selection = 'getSelection' in $w ? function () {
        $w.getSelection().removeAllRanges();
    } : function () {
        $d.selection.empty();
    };


    var options = {
        line_width: 5,
        lookup_delay: 500,
        lookup_interval: 80,
        zoomIcon : '<svg t="1579579493062" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11062" width="32" height="32"><path d="M100.58 286.879v639.329h635.462v-639.33H100.58z m557.03 560.759H179.15v-482.19h478.46v482.19z" fill="#515151" p-id="11063"></path><path d="M302.32 89.418V363.93c3.452 0 7.042 0 10.495 0.139h68.075v-196.08h478.461v482.19H661.34v12.013c1.243 9.666 1.243 19.47 1.104 28.722-0.276 12.565-1.242 25.269-2.07 37.835H937.92V89.418h-635.6z" fill="#515151" p-id="11064"></path></svg>',
        resetIcon : '<svg t="1579579613231" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14368" width="32" height="32"><path d="M939.739429 711.0656a37.449143 37.449143 0 0 0-51.375543 13.019429c-76.273371 128-216.151771 207.520914-364.982857 207.520914-198.597486 0-365.7728-137.0112-411.940572-321.477486l54.418286 54.418286a37.449143 37.449143 0 1 0 52.955428-52.984686L87.771429 480.548571a37.390629 37.390629 0 1 0-63.8976 26.477715c0 275.426743 224.080457 499.5072 499.5072 499.5072 175.104 0 339.616914-93.535086 429.377828-244.092343a37.536914 37.536914 0 0 0-12.990171-51.375543zM523.410286 7.548343c-192.570514 0-364.690286 107.549257-449.1264 280.693028a37.449143 37.449143 0 0 0 67.291428 32.855772c71.855543-147.163429 218.112-238.621257 381.805715-238.621257 198.626743 0 365.714286 137.0112 411.940571 321.448228l-66.501486-66.472228a37.449143 37.449143 0 0 0-52.926171 52.984685l143.096686 143.096686a37.332114 37.332114 0 0 0 40.784457 8.104229c14.043429-5.792914 23.113143-19.456 23.113143-34.581943C1022.858971 231.6288 798.778514 7.548343 523.410286 7.548343z" p-id="14369" fill="#515151"></path></svg>',
        tipIcon: '<svg t="1579594414215" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3366" width="32" height="32"><path d="M510.1 411.1c-18.8 0-34.2 15.4-34.2 34.4v295.7c0 18.8 15.4 34.2 34.2 34.2 19 0 34.4-15.4 34.4-34.2V445.5c-0.1-19-15.5-34.4-34.4-34.4zM512 64.7C265 64.7 64.7 265 64.7 512 64.7 759.1 265 959.3 512 959.3S959.3 759.1 959.3 512C959.3 265 759 64.7 512 64.7z m0.1 825c-208.5 0-377.7-169.1-377.7-377.6S303.5 134.5 512 134.5s377.6 169.1 377.6 377.6-168.9 377.6-377.5 377.6z m-1.4-639.3c-26.8 0-48.4 21.7-48.4 48.4s21.7 48.4 48.4 48.4c26.8 0 48.5-21.7 48.5-48.4-0.2-26.7-21.8-48.4-48.5-48.4z m0 0" fill="#515151" p-id="3367"></path></svg>'
    };

    // 传入一个 boolean 值，显示或隐藏遮罩
    jsMind.setZhezaoVisiable = function(b){
        if(b){
            //show
            var $zs = document.createElement('div');
            $zs.setAttribute('class' , 'jm-zhezao');
            document.body.appendChild($zs);
        }else{
            var zs = document.getElementsByClassName('jm-zhezao');
            for(var i = 0 ; i < zs.length ; i ++){
                zs[i].remove();
            }
        }
    };

    jsMind.draggable = function (jm) {
        this.jm = jm;
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
        this.hlookup_delay = 0;
        this.hlookup_timer = 0;
        this.capture = false;
        this.moved = false;
    };

    jsMind.draggable.prototype = {
        init: function () {
            var $this = this;
            // 获取 canvas 对象
            jsMind.prototype.getCanvas = function(){
                var canvas = $this.jm.view.container.getElementsByTagName('canvas');
                if(canvas.length >= 1){
                    return canvas[0];
                }else{
                    return null;
                }
            }
            
            // 获取 jmnodes 对象
            jsMind.prototype.getJmNodes = function(){
                var jmnodes = $this.jm.view.container.getElementsByTagName('jmnodes');
                if(jmnodes.length == 1){
                    return jmnodes[0];
                }else{
                    return null;
                }
            }

            jsMind.prototype.reset = function(){

                var canvas = $this.jm.getCanvas();
                var jmnodes = $this.jm.getJmNodes();
                jmnodes.style.marginLeft = '0';
                jmnodes.style.marginTop = '0';
                canvas.style.marginLeft = '0';
                canvas.style.marginTop = '0';

                $this.jm.view.center_root();
                return this
            }


            this._create_canvas();
            this._create_shadow();
            this._event_bind();
        },

        resize: function () {
            this.jm.view.e_nodes.appendChild(this.shadow);
            this.e_canvas.width = this.jm.view.size.w;
            this.e_canvas.height = this.jm.view.size.h;
        },

        _create_canvas: function () {
            var c = $d.createElement('canvas');
            this.jm.view.e_panel.appendChild(c);
            var ctx = c.getContext('2d');
            this.e_canvas = c;
            this.canvas_ctx = ctx;
        },

        _create_shadow: function () {
            var s = $d.createElement('jmnode');
            s.style.visibility = 'hidden';
            s.style.zIndex = '3';
            s.style.cursor = 'move';
            s.style.opacity = '0.7';
            this.shadow = s;
        },

        reset_shadow: function (el) {
            var s = this.shadow.style;
            this.shadow.innerHTML = el.innerHTML;
            s.left = el.style.left;
            s.top = el.style.top;
            s.width = el.style.width;
            s.height = el.style.height;
            s.backgroundImage = el.style.backgroundImage;
            s.backgroundSize = el.style.backgroundSize;
            s.transform = el.style.transform;
            this.shadow_w = this.shadow.clientWidth;
            this.shadow_h = this.shadow.clientHeight;

        },

        show_shadow: function () {
            if (!this.moved) {
                this.shadow.style.visibility = 'visible';
            }
        },

        hide_shadow: function () {
            this.shadow.style.visibility = 'hidden';
        },

        _magnet_shadow: function (node) {
            if (!!node) {
                this.canvas_ctx.lineWidth = options.line_width;
                this.canvas_ctx.strokeStyle = 'rgba(0,0,0,0.3)';
                this.canvas_ctx.lineCap = 'round';
                this._clear_lines();
                this._canvas_lineto(node.sp.x, node.sp.y, node.np.x, node.np.y);
            }
        },

        _clear_lines: function () {
            this.canvas_ctx.clearRect(0, 0, this.jm.view.size.w, this.jm.view.size.h);
        },

        _canvas_lineto: function (x1, y1, x2, y2) {
            this.canvas_ctx.beginPath();
            this.canvas_ctx.moveTo(x1, y1);
            this.canvas_ctx.lineTo(x2, y2);
            this.canvas_ctx.stroke();
        },

        _lookup_close_node: function () {
            var root = this.jm.get_root();
            var root_location = root.get_location();
            var root_size = root.get_size();
            var root_x = root_location.x + root_size.w / 2;

            var sw = this.shadow_w;
            var sh = this.shadow_h;
            var sx = this.shadow.offsetLeft;
            var sy = this.shadow.offsetTop;

            var ns, nl;

            var direct = (sx + sw / 2) >= root_x ?
                jsMind.direction.right : jsMind.direction.left;
            var nodes = this.jm.mind.nodes;
            var node = null;
            var min_distance = Number.MAX_VALUE;
            var distance = 0;
            var closest_node = null;
            var closest_p = null;
            var shadow_p = null;
            for (var nodeid in nodes) {
                var np, sp;
                node = nodes[nodeid];
                if (node.isroot || node.direction == direct) {
                    if (node.id == this.active_node.id) {
                        continue;
                    }
                    ns = node.get_size();
                    nl = node.get_location();
                    if (direct == jsMind.direction.right) {
                        if (sx - nl.x - ns.w <= 0) { continue; }
                        distance = Math.abs(sx - nl.x - ns.w) + Math.abs(sy + sh / 2 - nl.y - ns.h / 2);
                        np = { x: nl.x + ns.w - options.line_width, y: nl.y + ns.h / 2 };
                        sp = { x: sx + options.line_width, y: sy + sh / 2 };
                    } else {
                        if (nl.x - sx - sw <= 0) { continue; }
                        distance = Math.abs(sx + sw - nl.x) + Math.abs(sy + sh / 2 - nl.y - ns.h / 2);
                        np = { x: nl.x + options.line_width, y: nl.y + ns.h / 2 };
                        sp = { x: sx + sw - options.line_width, y: sy + sh / 2 };
                    }
                    if (distance < min_distance) {
                        closest_node = node;
                        closest_p = np;
                        shadow_p = sp;
                        min_distance = distance;
                    }
                }
            }
            var result_node = null;
            if (!!closest_node) {
                result_node = {
                    node: closest_node,
                    direction: direct,
                    sp: shadow_p,
                    np: closest_p
                };
            }
            return result_node;
        },

        lookup_close_node: function () {
            var node_data = this._lookup_close_node();
            if (!!node_data) {
                this._magnet_shadow(node_data);
                this.target_node = node_data.node;
                this.target_direct = node_data.direction;
            }
        },

        _event_bind: function () {
            var jd = this;
            var container = this.jm.view.container;
            jdom.add_event(container, 'mousedown', function (e) {
                var evt = e || event;
                jd.dragstart.call(jd, evt);
            });
            jdom.add_event(container, 'mousemove', function (e) {
                var evt = e || event;
                jd.drag.call(jd, evt);
            });
            jdom.add_event(container, 'mouseup', function (e) {
                var evt = e || event;
                jd.dragend.call(jd, evt);
            });
            jdom.add_event(container, 'touchstart', function (e) {
                var evt = e || event;
                jd.dragstart.call(jd, evt);
            });
            jdom.add_event(container, 'touchmove', function (e) {
                var evt = e || event;
                jd.drag.call(jd, evt);
            });
            jdom.add_event(container, 'touchend', function (e) {
                var evt = e || event;
                jd.dragend.call(jd, evt);
            });

            // 功能按钮组
            this.jm.view.container.style.position = 'relative'

            this.$btn_group = document.createElement("div");
            this.$btn_group.className = 'jm-group-btn';
            this.jm.view.container.appendChild(this.$btn_group);

            // 增加提示按钮
            this.bindTipEvent();
            
            //绑定拖拽功能
            this.bindDragMindMapEvent();

            // 绑定鼠标滚缩放事件
            this.bindMouseWheelEvent();

            // 增加全屏按钮
            this.bindFullScreenEvent();




        },

        // 绑定提示事件
        bindTipEvent : function(){
            if(!this.jm.options.showTip){
                return;
            }

            // 关闭提示的方法
            var closeTipsFn = function(e){
                jsMind.setZhezaoVisiable(false);

                this.parentNode.remove();
            }

            var $this = this;
            this.registerBtnGroup(options.tipIcon , function(e){

                jsMind.setZhezaoVisiable(true);

                console.log($this)
                var mapping = $this.jm.options.shortcut.mapping;

                var tips = document.createElement('div');
                tips.setAttribute('class' , 'jm-tips');

                tips.insertAdjacentHTML('beforeend' , '<div class="jm-tips-header">提示</div>');

                var closeBtn = document.createElement('div');
                closeBtn.setAttribute('class' , 'jm-tips-close-btn');
                closeBtn.onclick = closeTipsFn;
                closeBtn.textContent = '确定';
                
                tips.appendChild(closeBtn);

                for(var itemKey in mapping){
                    var item = mapping[itemKey];
                    var $html = '<div class="jm-tip">'+
                                    '<span class="jm-tip-y"></span>'+
                                    '<span class="jm-tip-key">'+ item.key +'</span>'+
                                    '<span class="jm-tip-value">'+ item.desc +'</span>'+
                                '</div>';

                    tips.insertAdjacentHTML('beforeend' , $html);
                }

                document.body.appendChild(tips);

            })
        },

        // 绑定全屏事件
        bindFullScreenEvent : function(){
            if(!this.jm.options.fullScreen){
                return;
            }

            var $this = this
            

            this.registerBtnGroup(options.zoomIcon , function(e){
                var fullClass = 'jm-full'
                var className = $this.jm.view.container.className;
                if(className.indexOf(fullClass) == -1){
                    // 全屏
                    $this.jm.view.container.className = className + ' ' + fullClass;
                }else{
                    // 取消全屏
                    className = className.replace(fullClass , '');
                    $this.jm.view.container.className = className;
                    setTimeout(function(){
                        $this.jm.reset();
                    } , 150);
                }
            })

        },

        // 绑定拖拽事件
        bindDragMindMapEvent : function(){
            var $this = this

            if(this.jm.options.dragMove){

                this.jm.view.container.style.cursor = 'move'
                var jmnodes = this.jm.getJmNodes();
                if(jmnodes != null){
                    
                    jmnodes.addEventListener('mousedown' , function(e){
                        var clickNode = e.target;
                        if(clickNode){
                            // 点击的是思维导图的节点，则不触发事件
                            if(clickNode.tagName.toUpperCase() == 'JMNODE'){
                                return;
                            }

                            $this.dragMindMap(e)
                        }
                    } , false);
                }

                // 增加重置按钮
                this.registerBtnGroup(options.resetIcon , function(e){

                    setTimeout(function(){
                        $this.jm.reset();
                    } , 150);
                    

                })
            }

        },

        /**
         * 注册一个按钮功能
         * @text 按钮文本
         * @fun 点击的函数
         * 
         *  */ 
        registerBtnGroup : function(text , fun){
            var resetBtn = document.createElement("div");
            resetBtn.className = 'jm-zoom-btn';
            if(this.$btn_group.children.length > 0){
                resetBtn.className += ' jm-zoom-btn-first';
            }
            // resetBtn.textContent = text;
            resetBtn.insertAdjacentHTML('beforeend' , text);
            resetBtn.addEventListener('click' , fun);

            this.$btn_group.appendChild(resetBtn);
        },

        //绑定鼠标滚轮的缩放事件
        bindMouseWheelEvent : function(){
            var $this = this
            this.jm.view.container.addEventListener('mousewheel' , function(e){
                // 禁止事件冒泡导致的滚动条上下拉动
                e.preventDefault()
                if(e.deltaY > 0){
                    $this.jm.view.zoomOut()
                }else{
                    $this.jm.view.zoomIn()

                }
            })
        },

        // 拖拽事件处理 , jmnodes
        dragMindMap : function(e){
            var $this = this
            var cer = this.jm.view.container;
            var $jmnodes = cer.getElementsByTagName('jmnodes')[0]
            var $canvas = cer.getElementsByTagName('canvas')[0]
            var originTop = this.convertIntPx($jmnodes.style.marginTop)
            var originLeft = this.convertIntPx($jmnodes.style.marginLeft)

            var $moveDoms = [$jmnodes , $canvas]

            document.onmousemove = function(mv){
                // 超出边界时，取消拖动事件
                if(mv.clientX > cer.offsetLeft + cer.offsetWidth || mv.clientX < cer.offsetLeft
                || mv.clientY > cer.offsetTop + cer.offsetHeight || mv.clientY < cer.offsetTop){
                    document.onmousemove = null;
                    document.onmouseup = null;
                    return
                }

                var left = originLeft + mv.clientX - e.clientX
                var top = originTop + mv.clientY - e.clientY

                for(var i = 0 ; i < $moveDoms.length ; i ++){
                    var $dom = $moveDoms[i]
                    $dom.style.marginLeft = left + 'px'
                    $dom.style.marginTop = top + 'px'
                }
            }
            document.onmouseup = function(){
                document.onmousemove = null;
                document.onmouseup = null;
            }

        },

        // 把像素转换为数字单位
        convertIntPx : function(i){
            if(typeof(i) == 'undefined' || i == null || i == ""){
                return 0
            }

            return parseInt(i.substring(0 , i.length - 2))
        },

        dragstart: function (e) {
            if (!this.jm.get_editable()) { return; }
            if (this.capture) { return; }
            this.active_node = null;

            var jview = this.jm.view;
            var el = e.target || event.srcElement;
            if (el.tagName.toLowerCase() != 'jmnode') { return; }
            var nodeid = jview.get_binded_nodeid(el);
            if (!!nodeid) {
                var node = this.jm.get_node(nodeid);
                if (!node.isroot) {
                    this.reset_shadow(el);
                    this.active_node = node;
                    this.offset_x = (e.clientX || e.touches[0].clientX) - el.offsetLeft;
                    this.offset_y = (e.clientY || e.touches[0].clientY) - el.offsetTop;
                    this.client_hw = Math.floor(el.clientWidth / 2);
                    this.client_hh = Math.floor(el.clientHeight / 2);
                    if (this.hlookup_delay != 0) {
                        $w.clearTimeout(this.hlookup_delay);
                    }
                    if (this.hlookup_timer != 0) {
                        $w.clearInterval(this.hlookup_timer);
                    }
                    var jd = this;
                    this.hlookup_delay = $w.setTimeout(function () {
                        jd.hlookup_delay = 0;
                        jd.hlookup_timer = $w.setInterval(function () {
                            jd.lookup_close_node.call(jd);
                        }, options.lookup_interval);
                    }, options.lookup_delay);
                    this.capture = true;
                }
            }
        },

        drag: function (e) {
            if (!this.jm.get_editable()) { return; }
            if (this.capture) {
                e.preventDefault();
                this.show_shadow();
                this.moved = true;
                clear_selection();
                var px = (e.clientX || e.touches[0].clientX) - this.offset_x;
                var py = (e.clientY || e.touches[0].clientY) - this.offset_y;
                var cx = px + this.client_hw;
                var cy = py + this.client_hh;
                this.shadow.style.left = px + 'px';
                this.shadow.style.top = py + 'px';
                clear_selection();
            }
        },

        dragend: function (e) {
            if (!this.jm.get_editable()) { return; }
            if (this.capture) {
                if (this.hlookup_delay != 0) {
                    $w.clearTimeout(this.hlookup_delay);
                    this.hlookup_delay = 0;
                    this._clear_lines();
                }
                if (this.hlookup_timer != 0) {
                    $w.clearInterval(this.hlookup_timer);
                    this.hlookup_timer = 0;
                    this._clear_lines();
                }
                if (this.moved) {
                    var src_node = this.active_node;
                    var target_node = this.target_node;
                    var target_direct = this.target_direct;
                    this.move_node(src_node, target_node, target_direct);
                }
                this.hide_shadow();
            }
            this.moved = false;
            this.capture = false;
        },

        move_node: function (src_node, target_node, target_direct) {
            var shadow_h = this.shadow.offsetTop;
            if (!!target_node && !!src_node && !jsMind.node.inherited(src_node, target_node)) {
                // lookup before_node
                var sibling_nodes = target_node.children;
                var sc = sibling_nodes.length;
                var node = null;
                var delta_y = Number.MAX_VALUE;
                var node_before = null;
                var beforeid = '_last_';
                while (sc--) {
                    node = sibling_nodes[sc];
                    if (node.direction == target_direct && node.id != src_node.id) {
                        var dy = node.get_location().y - shadow_h;
                        if (dy > 0 && dy < delta_y) {
                            delta_y = dy;
                            node_before = node;
                            beforeid = '_first_';
                        }
                    }
                }
                if (!!node_before) { beforeid = node_before.id; }
                this.jm.move_node(src_node.id, beforeid, target_node.id, target_direct);
            }
            this.active_node = null;
            this.target_node = null;
            this.target_direct = null;
        },

        jm_event_handle: function (type, data) {
            if (type === jsMind.event_type.resize) {
                this.resize();
            }
        }
    };

    var draggable_plugin = new jsMind.plugin('draggable', function (jm) {
        var jd = new jsMind.draggable(jm);
        jd.init();
        jm.add_event_listener(function (type, data) {
            jd.jm_event_handle.call(jd, type, data);
        });
    });

    jsMind.register_plugin(draggable_plugin);

})(window);
