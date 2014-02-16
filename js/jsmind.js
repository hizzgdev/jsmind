/*
 * example:
 *     var options = {
 *         data:{
 *             type : 'remote',
 *             data : 'http://localhost:8080/example/data_example.json'
 *             //type : 'local',
 *             //data : [
 *             //    {nodeid:'a001', isroot:true, topic:'root node'},
 *             //    {nodeid:'b001', parentid:'a001', topic:'sub node #1', summary:'summary of node #1', nodeindex:10 },
 *             //    {nodeid:'b002', parentid:'a001', topic:'sub node #2', summary:'summary of node #2'}
 *             //]
 *         },
 *         view:{
 *             container:containerid or dom object
 *         },
 *         layout:{
 *             mode :'side',
 *             width:80,
 *             height:30
 *         },
 *         theme:{
 *             name:'default'
 *         }
 *     };
 *
 *     var jm = new jsMind(options);
 *     jm.show()
 *     === OR =======================
 *     var jm = jsMind.show(options);
 *
 * editor is not a built-in compose, you should enable editor extra.
 */

(function($w){
    // set 'jsMind' as the library name.
    // __name__ should be a const value, Never try to change it easily.
    var __name__ = 'jsMind';
    // library version
    var __version__    = '0.2';
    // debug mode
    var __debug__      = true;

    // check global variables
    if(typeof($w[__name__])!='undefined'){
        _console.log(__name__+' has been already exist.');
        return;
    }

    // an noop function define
    var _noop = function(){};
    // remove console object for ie6/7/8
    var _console = (typeof(console) == 'undefined')?{
            log:_noop, debug:_noop, error:_noop, warn:_noop, info:_noop
        }:console;

    // dom method's shortcut
    var $d = $w.document;
    var $g = function(id){return $d.getElementById(id);};
    var $c = function(tag){return $d.createElement(tag);};
    var $t = function(n,t){if(n.hasChildNodes()){n.firstChild.nodeValue = t;}else{n.appendChild($d.createTextNode(t));}};


    /*
     * !! ATTENTION !!
     * DO NOT EXPAND IT TO 3 LEVEL OR MORE.
     * LOWER OPTIONS WILL NOT BE MERGE BUT REWRITE
     */
    var DEFAULT_OPTIONS = {
        data:{
            type : 'remote',
            data : 'http://localhost:8080/example/data_example.json'
            //type : 'local',
            //data : [
            //        {nodeid:'a001', isroot:true, topic:'root node'},
            //        {nodeid:'b001', parentid:'a001', topic:'sub node #1', summary:'summary of node #1'},
            //        {nodeid:'b002', parentid:'a001', topic:'sub node #2', summary:'summary of node #2'}
            //       ]
        },
        view:{
            container:'jsmind_container'
        },
        layout:{
            mode :'full', // full or side
            hspace:30,
            vspace:20,
        },
        theme:{
            name:'default'
        },
        provider:{
            data : null,
            view : null,
            layout : null,
            theme : null
        }
    };

    // core object
    var jm = function(options){
        this.version = __version__;
        /*
         * merge DEFAULT_OPTIONS and options
         * only merge in 2 level, lower will be rewrite
         */
        var opts = {};
        for (var o in DEFAULT_OPTIONS) {opts[o] = DEFAULT_OPTIONS[o];}
        for (var o in options) {if(o in opts){for (var k in options[o]){opts[o][k] = options[o][k];}}else{opts[o]=options[o];}}
        opts.layout.pspace=13;
        this.options = opts;

        // function provider
        this.data = null;
        this.layout = null;
        this.view = null;
        this.theme = null;

        // init
        this.init();
    };

    jm.prototype={
        init : function(){
            var opts = this.options;
            var provider = opts.provider;

            var _data_provider = (!!provider.data)? provider.data : jm.data_provider;
            var _layout_provider = (!!provider.layout)? provider.layout : jm.layout_provider;
            var _view_provider = (!!provider.view)? provider.view : jm.view_provider;
            var _theme_provider = (!!provider.theme)? provider.theme : jm.theme_provider;

            // create instance of function provider 
            this.data = new _data_provider(this, opts.data);
            this.layout = new _layout_provider(this, opts.layout);
            this.view = new _view_provider(this, opts.view);
            this.theme = new _theme_provider(this, opts.theme);
        },

        // show mindmap async
        _show : function(){
            var jm = this;
            jm.data.load(function(){
                _console.debug('data.load ok');
                jm.view.init(function(){
                    _console.debug('view.init ok');
                    jm.layout.layout(function(){
                        _console.debug('layout.layout ok');
                        jm.view.show(function(){
                            _console.debug('view.show ok');
                        });
                    });
                });
            });
        },
        show : function(){
            this._show();
        },

        resize:function(){
            this.view.resize();
        }
    };

    jm.show = function(options){
        var jm = new jm(options);
        jm.show();
        return jm;
    };

    // ============= static object =============================================
    jm.direction = {left:-1,center:0,right:1};

    jm.node = function(sId,iIndex,sTopic,sSummary,bIsRoot,oParent){
        if(!sId){_console.error('invalid nodeid');return;}
        if(typeof(iIndex) != 'number'){_console.error('invalid node index');return;}
        this.id = sId;
        this.index = iIndex;
        this.topic = sTopic;
        this.summary = sSummary;
        this.isroot = bIsRoot;
        this.parent = oParent;
        this.children = [];
        this.data = {};
        this._data = {};
    };
    jm.node.compare=function(node1,node2){
        // '-1' is alwary the last
        var r = 0;
        var i1 = node1.index;
        var i2 = node2.index;
        if(i1>=0 && i2>=0){
            r = i1-i2;
        }else if(i1==-1 && i2==-1){
            r = 0;
        }else if(i1==-1){
            r = 1;
        }else if(i2==-1){
            r = -1;
        }else{
            r = 0;
        }
        //_console.debug(i1+' <> '+i2+'  =  '+r);
        return r;
    };

    // ============= utility object =============================================

    jm.util = {
        ajax:{
            _xhr:function(){
                var xhr = null;
                if(window.XMLHttpRequest){
                    xhr = new XMLHttpRequest();
                }else{
                    try{
                        xhr = new ActiveXObject("Microsoft.XMLHTTP");
                    }catch(e){}
                }
                return xhr;
            },
            _eurl:function(url){
                return encodeURIComponent(url);
            },
            request:function(url,param,method,callback){
                var a = jm.util.ajax;
                var p = null;
                var tmp_param = [];
                for(k in param){
                    tmp_param.push(a._eurl(k)+'='+a._eurl(param[k]));
                }
                if(tmp_param.length>0){
                    p = tmp_param.join('&');
                }
                var xhr = a._xhr();
                if(xhr == null){return;}
                xhr.onreadystatechange = function(){
                    if(xhr.readyState == 4){
                        if(xhr.status == 200 || xhr.status == 0){
                            if(typeof(callback) == 'function'){
                                var data = eval('('+xhr.responseText+')');
                                callback(data);
                            }
                        }else{
                            var w = $w.open('');
                            w.document.write(xhr.responseText);
                            //alert(xhr.responseText);
                        }
                    }
                }
                method = method || 'GET';
                xhr.open(method,url,true);
                xhr.setRequestHeader('If-Modified-Since','0');
                if(method == 'POST'){
                    xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded;charset=utf-8');
                    xhr.send(p);
                }else{
                    xhr.send();
                }
            },
            get:function(url,callback){
                return jm.util.ajax.request(url,{},'GET',callback);
            },
            post:function(url,param,callback){
                return jm.util.ajax.request(url,param,'POST',callback);
            }
        },

        canvas:{
            easingztf : function(t,b,c,d){var x=t*4/d;return (1-Math.pow(Math.E,-(x*x)/2))*c+b;},
            lineto : function(ctx,x1,y1,x2,y2){
                var ztf = jm.util.canvas.easingztf;
                ctx.moveTo(x1,y1);
                ctx.beginPath();
                var l = x2-x1;
                var c = y1-y2;
                var absl = Math.abs(l);
                var t = 0;
                for(var t=0;t<absl+1;t++){
                    y2 = y1-ztf(t,0,c,l);
                    ctx.lineTo(t*(Math.abs(l)/l)+x1,y2);
                }
                ctx.stroke();
            },
            clear:function(ctx,x1,y1,x2,y2){
                ctx.clearRect(x1,y1,x2,y2);
            }
        }
    };

    // ============= data provider =============================================

    jm.data_provider = function(jm, options){
        this.jm = jm;
        this.opts = options;
        this.root = null;
        this.nodes = {};
        this.load_success_callback = null;
    };

    jm.data_provider.prototype={
        load:function(fn_callback){
            _console.debug('data.load');
            if(typeof(fn_callback) === 'function'){
                this.load_success_callback = fn_callback;
            }else{
                this.load_success_callback = null;
                _console.error('callback is not a function:'+data_type);
            }

            var data_type = this.opts.type;
            var data = this.opts.data;
            if(data_type == 'local'){
                this.parse(data);
            }else if(data_type == 'remote'){
                this.fetch(data);
            }else{
                _console.error('unsupported data type :'+data_type);
            }
        },

        fetch:function(url){
            var jd = this;
            jm.util.ajax.get(url,function(data){
                jd.parse(data);
            });
        },

        parse:function(node_array){
            // reverse array for improving looping performance
            node_array.reverse();
            var root_node = this._parse_extract_root(node_array);
            if(!!root_node){
                this.root = root_node;
                this._parse_extract_subnode(node_array, root_node);
                this.reindex(root_node);
            }else{
                _console.error('the root node can not be found');
            }
            if(!!this.load_success_callback){
                this.load_success_callback();
            }
        },

        _parse_node:function(node_json, parent_node, isroot){
            var o = node_json;
            var p = parent_node;
            var r = !!isroot;
            if(!r && !p){
                _console.error('node has not parent');
                return null;
            }
            var idx = ('nodeindex' in o)?o.nodeindex:-1;
            var node = new jm.node(o.nodeid,idx,o.topic,o.summary,r,p);
            return node;
        },

        _parse_extract_root:function(node_array){
            var i = node_array.length;
            while(i--){
                if('isroot' in node_array[i] && node_array[i].isroot){
                    var root_json = node_array[i];
                    node_array.splice(i,1);
                    var root_node = this._parse_node(root_json,null,true);
                    if(this.put_node(root_node)){
                        return root_node;
                    }else{
                        delete root_node;
                        _console.warn('root node has an not unique id, and this node has been skipped');
                    }
                }
            }
            return null;
        },

        _parse_extract_subnode:function(node_array,parent_node){
            var pid = parent_node.id;
            var i = node_array.length;
            var node_json = null;
            var node = null;
            var extract_count = 0;
            while(i--){
                node_json = node_array[i];
                if(!('nodeindex' in node_json)){
                    node_json.nodeindex = extract_count;
                }
                if(node_json.parentid == pid){
                    node = this._parse_node(node_json,parent_node);
                    if(this.put_node(node)){
                        parent_node.children.push(node);
                    }else{
                        delete node;
                        _console.warn('some node has skipped');
                        break;
                    }
                    node_array.splice(i,1);
                    extract_count ++;
                    var sub_extract_count = this._parse_extract_subnode(node_array,node);
                    if(sub_extract_count > 0){
                        // reset loop index after extract subordinate node
                        i = node_array.length;
                        extract_count += sub_extract_count;
                    }
                    this.reindex(node);
                }
            }
            return extract_count;
        },

        put_node:function(node){
            if(node.id in this.nodes){
                _console.warn('the nodeid \''+nodeid+'\' has been already exist.');
                return false;
            }else{
                this.nodes[node.id] = node;
                return true;
            }
        },

        get_node:function(nodeid){
            if(nodeid in this.nodes){
                return this.nodes[nodeid];
            }else{
                _console.error('the node[id='+nodeid+'] can not be found');
                return null;
            }
        },

        get_root:function(){
            return this.node;
        },

        get_subnodes:function(nodeid){
            var node = this.get_node(nodeid);
            return node.children;
        },

        // watch out the nodeindex item, the position of node is determined by it.
        add_node:function(node_json){
            var result = false;
            var parent_node = this.get_node(node_json.parentid);
            if(!!parent_node){
                if(!('nodeindex' in node_json)){
                    node_json.nodeindex = -1;
                }
                var node = this._parse_node(node_json, parent_node);
                if(this.put_node(node)){
                    parent_node.children.push(node);
                    this.reindex(parent_node);
                    result = true;
                }else{
                    _console.error('fail, the nodeid has been already exist');
                    delete node;
                }
            }
            return result;
        },

        // this method while rewrite the nodeindex in node_json
        add_node_at:function(node_json, node_index){
            node_json.nodeindex = node_index-0.5;
            return this.add_node(node_json);
        },

        // this method while rewrite the nodeindex in node_json
        add_node_before:function(node_json, before_id){
            var node_before = (!!before_id)?this.get_node(before_id):null;
            if(!!node_before){
                if(node_before.parent!=null && node_before.parent.id == node_json.parentid){
                    node_json.nodeindex = node_before.index-0.5;
                }else{
                    node_json.nodeindex = -1;
                }
            }else{
                node_json.nodeindex = -1;
            }
            return this.add_node(node_json);
        },

        // this method while rewrite the nodeindex in node_json
        add_node_after:function(node_json, after_id){
            var node_after = (!!after_id)?this.get_node(after_id):null;
            if(!!node_after){
                if(node_after.parent!=null && node_after.parent.id==node_json.parentid){
                    node_json.nodeindex = node_after.index + 0.5;
                }else{
                    node_json.nodeindex = -1;
                }
            }else{
                node_json.nodeindex = -1;
            }
            return this.add_node(node_json);
        },
        
        remove_node:function(node){
            if(!(node instanceof jm.node)){
                node = this.get_node(node);
            }
            if(!node){return;}
            if(node.isroot){
                _console.error('fail, can not remove the root node');
                return;
            }
            // clean all subordinate nodes
            var children = node.children;
            var ci = children.length;
            while(ci--){
                this.remove_node(children[ci]);
            }
            // remove from parent's children
            var sibling = node.parent.children;
            var si = sibling.length;
            while(si--){
                if(sibling[si].id == node.id){
                    sibling.splice(si,1);
                    break;
                }
            }
            // remove from global nodes
            delete this.nodes[node.id];
            // clean all properties
            for(var k in node){
                delete node[k];
            }
            // remove it's self
            delete node;
        },

        reindex:function(node){
            if(node instanceof jm.node){
                node.children.sort(jm.node.compare);
                for(var i=0;i<node.children.length;i++){
                    node.children[i].index = i+1;
                }
            }
        },

        _get_json_array:function(node,json_array){
            if(!(node instanceof jm.node)){return;}
            if(!json_array){
                json_array = [];
            }
            var o = {
                _nodeindex_ : node.index,
                nodeid : node.id,
                isroot : node.isroot,
                parentid : (!!node.parent)?node.parent.id:null,
                topic : node.topic,
                summary : node.sumary
            };
            json_array.push(o);
            var ci = node.children.length;
            for(var i=0;i<ci;i++){
                this._get_json_array(node.children[i],json_array);
            }
            return json_array;
        },

        get_json:function(){
            var json = this._get_json_array(this.root,[]);
            return json;
        },

        get_json_string:function(){
            var json = get_json();
            var json_str = JSON.stringify(json);
            return json_str;
        }
    };

    // ============= layout provider ===========================================

    jm.layout_provider = function(jm, options){
        this.opts = options;
        this.jm = jm;
        this.data= this.jm.data;
        this.isside = (this.opts.mode == 'side');
        this.bounds = {n:0,s:0,w:0,e:0};
    };
    jm.layout_provider.prototype={
        layout:function(fn_callback){
            _console.debug('layout.layout');
            this.layout_direction();
            this.layout_offset();
            if(typeof(fn_callback) === 'function'){
                fn_callback();
            }
            //_console.debug(this.data.root);
        },

        layout_direction:function(){
            this._layout_direction_root();
        },

        _layout_direction_root:function(){
            var node = this.data.root;
            var layout_data = null;
            if('layout' in node._data){
                layout_data = node._data.layout;
            }else{
                layout_data = {};
                node._data.layout = layout_data;
            }
            var children = node.children;
            var children_count = children.length;
            layout_data.direction = jm.direction.center;
            layout_data.side_index = 0;
            if(this.isside){
                layout_data.left_count = 0;
                layout_data.right_count = children_count;
                var i = children_count;
                while(i--){
                    this._layout_direction_side(children[i], jm.direction.right, i);
                }
            }else{
                var boundary = Math.ceil(children_count/2);
                layout_data.left_count = children_count - boundary;
                layout_data.right_count = boundary;
                var i = children_count;
                while(i--){
                    if(i>=boundary){
                        this._layout_direction_side(children[i],jm.direction.left, children_count-i-1);
                    }else{
                        this._layout_direction_side(children[i],jm.direction.right, i);
                    }
                }
            }
        },

        _layout_direction_side:function(node, direction, side_index){
            var layout_data = null;
            if('layout' in node._data){
                layout_data = node._data.layout;
            }else{
                layout_data = {};
                node._data.layout = layout_data;
            }
            var children = node.children;
            var children_count = children.length;

            layout_data.direction = direction;
            layout_data.side_index = side_index;
            if(direction == jm.direction.right){
                layout_data.right_count = children_count;
                layout_data.left_count = 0;
            }else{
                layout_data.left_count = children_count;
                layout_data.right_count = 0;
            }
            var i = children_count;
            while(i--){
                this._layout_direction_side(children[i], direction, i);
            }
        },

        layout_offset:function(){
            var node = this.data.root;
            var layout_data = node._data.layout;
            layout_data.offset_x = 0;
            layout_data.offset_y = 0;
            layout_data.outer_height = 0;
            var children = node.children;
            var i = children.length;
            var left_nodes = [];
            var right_nodes = [];
            var node = null;
            while(i--){
                node = children[i];
                if(node._data.layout.direction == jm.direction.right){
                    right_nodes.unshift(node);
                }else{
                    left_nodes.push(node);
                }
            }
            layout_data.outer_height_left = this._layout_offset_subnodes(left_nodes);
            layout_data.outer_height_right = this._layout_offset_subnodes(right_nodes);
            this.bounds.n=0;
            this.bounds.s = Math.max(layout_data.outer_height_left,layout_data.outer_height_right);
        },

        _layout_offset_subnodes:function(nodes){
            var total_height = 0;
            var nodes_count = nodes.length;
            var i = nodes_count;
            var node = null;
            var node_outer_height = 0;
            var layout_data = null;
            var base_y = 0;
            var pd = null; // parent._data
            while(i--){
                node = nodes[i];
                layout_data = node._data.layout;
                if(pd == null){
                    pd = node.parent._data;
                }

                node_outer_height = this._layout_offset_subnodes(node.children);
                node_outer_height = Math.max(node._data.view.height,node_outer_height);

                layout_data.outer_height = node_outer_height;
                layout_data.offset_y = base_y - node_outer_height/2;
                layout_data.offset_x = this.opts.hspace * layout_data.direction + pd.view.width * (pd.layout.direction + layout_data.direction)/2;
                if(!node.parent.isroot){
                    layout_data.offset_x += this.opts.pspace * layout_data.direction;
                }

                base_y = base_y - node_outer_height - this.opts.vspace;
                total_height += node_outer_height;
            }
            if(nodes_count>1){
                total_height += this.opts.vspace * (nodes_count-1);
            }
            i = nodes_count;
            var middle_height = total_height/2;
            while(i--){
                node = nodes[i];
                node._data.layout.offset_y += middle_height;
            }
            return total_height;
        },

        get_node_offset:function(node){
            var layout_data = node._data.layout;
            var offset_cache = null;
            if('_offset_' in layout_data){
                offset_cache = layout_data._offset_;
            }else{
                offset_cache = {x:-1, y:-1};
                layout_data._offset_ = offset_cache;
            }
            if(offset_cache.x == -1 || offset_cache.y == -1){
                var x = layout_data.offset_x;
                var y = layout_data.offset_y;
                if(!node.isroot){
                    var offset_p = this.get_node_offset(node.parent);
                    x += offset_p.x;
                    y += offset_p.y;
                }
                offset_cache.x = x;
                offset_cache.y = y;
            }
            return offset_cache;
        },

        get_node_point:function(node){
            var view_data = node._data.view;
            var offset_p = this.get_node_offset(node);
            //_console.debug(offset_p);
            var p = {};
            p.x = offset_p.x + view_data.width*(node._data.layout.direction-1)/2;
            p.y = offset_p.y-view_data.height/2;
            //_console.debug(p);
            return p;
        },

        get_node_point_in:function(node){
            var p = this.get_node_offset(node);
            return p;
        },

        get_node_point_out:function(node){
            var layout_data = node._data.layout;
            var pout_cache = null;
            if('_pout_' in layout_data){
                pout_cache = layout_data._pout_;
            }else{
                pout_cache = {x:-1, y:-1};
                layout_data._pout_ = pout_cache;
            }
            if(pout_cache.x == -1 || pout_cache.y == -1){
                if(node.isroot){
                    pout_cache.x = 0;
                    pout_cache.y = 0;
                }else{
                    var view_data = node._data.view;
                    var offset_p = this.get_node_offset(node);
                    pout_cache.x = offset_p.x + (view_data.width+this.opts.pspace)*node._data.layout.direction;
                    pout_cache.y = offset_p.y;
                    //_console.debug('pout');
                    //_console.debug(pout_cache);
                }
            }
            return pout_cache;
        },

        get_expander_point:function(node){
            var p = this.get_node_point_out(node);
            var ex_p = {};
            if(node._data.layout.direction == jm.direction.right){
                ex_p.x = p.x - this.opts.pspace;
            }
            ex_p.y = p.y - Math.ceil(this.opts.pspace/2);
            return ex_p;
        },

        get_min_size:function(){
            var nodes = this.data.nodes;
            var node = null;
            var pout = null;
            for(var nodeid in nodes){
                node = nodes[nodeid];
                pout = this.get_node_point_out(node);
                if(pout.x > this.bounds.e){this.bounds.e = pout.x;}
                if(pout.x < this.bounds.w){this.bounds.w = pout.x;}
            }
            return {
                w:this.bounds.e - this.bounds.w + this.opts.hspace*4,
                h:this.bounds.s - this.bounds.n + this.opts.vspace*4
            }
        }
    };

    // view provider
    jm.view_provider= function(jm, options){
        this.opts = options;
        this.jm = jm;
        this.data= jm.data;
        this.layout = jm.layout;

        this.container = null;
        this.e_panel = null;
        this.e_nodes= null;
        this.e_canvas = null;

        this.canvas_ctx = null;
        this.size = {w:0,h:0};
    };

    jm.view_provider.prototype={
        init:function(fn_callback){
            _console.debug('view.init');

            this.container = $g(this.opts.container);
            if(!this.container){
                _console.error('the options.view.container was not be found in dom');
                return;
            }
            this.e_panel = $c('div');
            this.e_canvas = $c('canvas');
            this.e_nodes = $c('jmnodes');

            this.e_panel.className = 'jsmind-inner';
            this.e_panel.appendChild(this.e_canvas);
            this.e_panel.appendChild(this.e_nodes);
            this.container.appendChild(this.e_panel);

            this.init_canvas();
            this.init_nodes();

            if(typeof(fn_callback) === 'function'){
                fn_callback();
            }
        },

        zoom_size:function(times){
            var min_size = this.layout.get_min_size();
            var client_w = this.e_panel.offsetWidth;
            var client_h = this.e_panel.offsetHeight;
            if(client_w < min_size.w*times){client_w = min_size.w*times;}
            if(client_h < min_size.h*times){client_h = min_size.h*times;}
            this.e_panel.offsetWidth = client_w;
            this.e_panel.offsetHeight = client_h;
            this.size.w = client_w;
            this.size.h = client_h;
        },

        init_canvas:function(){
            //this.e_canvas.width = this.size.w;
            //this.e_canvas.height = this.size.h;
            var ctx = this.e_canvas.getContext('2d');
            ctx.strokeStyle = '#555';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            this.canvas_ctx = ctx;
        },

        init_nodes:function(){
            var nodes = this.data.nodes;
            for(var nodeid in nodes){
                this.create_node_element(nodes[nodeid]);
            }
        },

        create_node_element:function(node){
            var view_data = null;
            if('view' in node._data){
                view_data = node._data.view;
            }else{
                view_data = {};
                node._data.view = view_data;
            }

            var d = $c('jmnode');
            if(node.isroot){
                d.className = 'root';
            }else{
                var d_e = $c('jmexpander');
                $t(d_e,'-');
                d_e.setAttribute('nodeid',node.id);
                d_e.style.visibility = 'hidden';
                this.e_nodes.appendChild(d_e);
                view_data.expander = d_e;
            }
            $t(d,node.topic);
            d.setAttribute('nodeid',node.id);
            d.style.visibility='hidden';
            this.e_nodes.appendChild(d);
            view_data.element = d;
            view_data.width = d.offsetWidth;
            view_data.height = d.offsetHeight;
        },

        resize:function(){
            this.e_canvas.width = 1;
            this.e_canvas.height = 1;

            this.zoom_size(1);

            this.e_canvas.width = this.size.w;
            this.e_canvas.height = this.size.h;

            this.show_nodes();
            this.show_lines();
        },

        get_view_offset:function(){
            var bounds = this.layout.bounds;
            var _x = (this.size.w - bounds.e - bounds.w)/2
            return{
                x: _x,
                y: this.size.h / 2
            };
        },

        show:function(fn_callback){
            _console.debug('view.show');
            this.resize();
        },

        show_nodes:function(){
            var nodes = this.data.nodes;
            var node = null;
            var node_element = null;
            var expander = null;
            var p = null;
            var p_expander= null;
            var _offset = this.get_view_offset();
            for(var nodeid in nodes){
                node = nodes[nodeid];
                node_element = node._data.view.element;
                p = this.layout.get_node_point(node);
                node_element.style.visibility = 'visible';
                node_element.style.left = (_offset.x+p.x) + 'px';
                node_element.style.top = (_offset.y+p.y) + 'px';
                if(!node.isroot && node.children.length>0){
                    expander = node._data.view.expander;
                    p_expander= this.layout.get_expander_point(node);
                    expander.style.visibility = 'visible';
                    expander.style.left = (_offset.x + p_expander.x) + 'px';
                    expander.style.top = (_offset.y + p_expander.y) + 'px';
                }
            }
            if(typeof(fn_callback) === 'function'){
                fn_callback();
            }
        },

        show_lines:function(){
            jm.util.canvas.clear(this.canvas_ctx,0,0,this.size.w,this.size.h);

            var nodes = this.data.nodes;
            var node = null;
            var pin = null;
            var pout = null;
            var _offset = this.get_view_offset();
            for(var nodeid in nodes){
                node = nodes[nodeid];
                if(!!node.isroot){continue;}
                pin = this.layout.get_node_point_in(node);
                pout = this.layout.get_node_point_out(node.parent);
                this.draw_line(pout,pin,_offset);
            }
        },

        draw_line:function(pin,pout,offset){
            jm.util.canvas.lineto(
                this.canvas_ctx,
                pin.x + offset.x,
                pin.y + offset.y,
                pout.x + offset.x,
                pout.y + offset.y);
        }
    };

    // theme provider
    jm.theme_provider= function(jm, options){this.jm = jm; this.opts = options;};
    jm.theme_provider.prototype={

    };

    // register global variables
    $w[__name__] = jm;
})(window);
