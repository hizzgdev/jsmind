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
 *             container:containerid or dom object,
 *             resize:'auto'
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
    // __jsMindName__ should be a const value, Never try to change it easily.
    var __jsMindName__ = 'jsMind';
    // library version
    var __version__    = '0.2';
    // debug mode
    var __debug__      = true;

    // check global variables
    if(typeof($w[__jsMindName__])!='undefined'){
        _console.log('jsMind has been already exist.');
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
            //        {nodeid:'b001', parentid:'a001', topic:'sub node #1', summary:'summary of node #1', nodeindex:10 },
            //        {nodeid:'b002', parentid:'a001', topic:'sub node #2', summary:'summary of node #2'}
            //       ]
        },
        view:{
            resize:'auto'
        },
        layout:{
            mode :'side',
            width:80,
            height:30
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

    // jsMind core object
    var jsMind = function(options){
        this.version = __version__;
        /*
         * merge DEFAULT_OPTIONS and options
         * only merge in 2 level, lower will be rewrite
         */
        var opts = {};
        for (var o in DEFAULT_OPTIONS) {opts[o] = DEFAULT_OPTIONS[o];}
        for (var o in options) {if(o in opts){for (var k in options[o]){opts[o][k] = options[o][k];}}else{opts[o]=options[o];}}
        this.options = opts;

        // function provider
        this.data = null;
        this.layout = null;
        this.view = null;
        this.theme = null;

        // init
        this.init();
    };

    jsMind.prototype={
        init : function(){
            var opts = this.options;
            var provider = opts.provider;

            var _data_provider = (!!provider.data)? provider.data : jsMind.data_provider;
            var _layout_provider = (!!provider.layout)? provider.layout : jsMind.layout_provider;
            var _view_provider = (!!provider.view)? provider.view : jsMind.view_provider;
            var _theme_provider = (!!provider.theme)? provider.theme : jsMind.theme_provider;

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
                jm.layout.layout(function(){
                    _console.debug('layout.layout ok');
                    jm.view.show(function(){
                        _console.debug('view.show ok');
                    });
                });
            });
        },
        show : function(){
            this._show();
        }
    };

    jsMind.show = function(options){
        var jm = new jsMind(options);
        jm.show();
        return jm;
    };

    // ============= static object =============================================

    jsMind.Node = function(sId,iIndex,sTopic,sSummary,bIsRoot,oParent){
        if(!sId){_console.error('invalid nodeid');return;}
        if(typeof(iIndex) != 'number'){_console.error('invalid node index');return;}
        this.Id = sId;
        this.Index = iIndex;
        this.Topic = sTopic;
        this.Summary = sSummary;
        this.IsRoot = bIsRoot;
        this.Parent = oParent;
        this.Children = [];
        this.Data = {};
    };
    jsMind.Node.Compare=function(node1,node2){
        // '-1' is alwary the last
        var r = 0;
        var i1 = node1.Index;
        var i2 = node2.Index;
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

    jsMind.Util = {
        Ajax:{
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
                var a = jsMind.Util.Ajax;
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
                return jsMind.Util.Ajax.request(url,{},'GET',callback);
            },
            post:function(url,param,callback){
                return jsMind.Util.Ajax.request(url,param,'POST',callback);
            }
        }
    };

    // ============= data provider =============================================

    jsMind.data_provider = function(jm, options){
        this.jsMind = jm;
        this.opts = options;
        this.root = null;
        this.nodes = {};
        this.load_success_callback = null;
    };
    jsMind.data_provider.prototype={
        load:function(fnCallback){
            _console.debug('data.load');
            if(typeof(fnCallback) === 'function'){
                this.load_success_callback = fnCallback;
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
            var jmData = this;
            jsMind.Util.Ajax.get(url,function(data){
                jmData.parse(data);
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
            var node = new jsMind.Node(o.nodeid,idx,o.topic,o.summary,r,p);
            return node;
        },
        _parse_extract_root:function(node_array){
            var i = node_array.length;
            while(i--){
                if('isroot' in node_array[i] && node_array[i].isroot){
                    var root_json = node_array[i];
                    node_array.splice(i,1);
                    var root_node = this._parse_node(root_json,null,true);
                    if(this.putNode(root_node)){
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
            var pid = parent_node.Id;
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
                    if(this.putNode(node)){
                        parent_node.Children.push(node);
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
        putNode:function(node){
            if(node.Id in this.nodes){
                _console.warn('the nodeid \''+nodeid+'\' has been already exist.');
                return false;
            }else{
                this.nodes[node.Id] = node;
                return true;
            }
        },
        getNode:function(nodeId){
            if(nodeId in this.nodes){
                return this.nodes[nodeId];
            }else{
                _console.error('the node[id='+nodeId+'] can not be found');
                return null;
            }
        },
        getRootNode:function(){
            return this.node;
        },
        getSubNodes:function(nodeId){
            var node = this.getNode(nodeId);
            return node.Children;
        },
        // watch out the nodeindex item, the position of node is determined by it.
        addNode:function(node_json){
            var result = false;
            var parent_node = this.getNode(node_json.parentid);
            if(!!parent_node){
                if(!('nodeindex' in node_json)){
                    node_json.nodeindex = -1;
                }
                var node = this._parse_node(node_json, parent_node);
                if(this.putNode(node)){
                    parent_node.Children.push(node);
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
        addNodeAt:function(node_json, node_index){
            node_json.nodeindex = node_index-0.5;
            return this.addNode(node_json);
        },
        // this method while rewrite the nodeindex in node_json
        addNodeBefore:function(node_json, before_id){
            var node_before = (!!before_id)?this.getNode(before_id):null;
            if(!!node_before){
                if(node_before.Parent!=null && node_before.Parent.Id == node_json.parentid){
                    node_json.nodeindex = node_before.Index-0.5;
                }else{
                    node_json.nodeindex = -1;
                }
            }else{
                node_json.nodeindex = -1;
            }
            return this.addNode(node_json);
        },
        // this method while rewrite the nodeindex in node_json
        addNodeAfter:function(node_json, after_id){
            var node_after = (!!after_id)?this.getNode(after_id):null;
            if(!!node_after){
                if(node_after.Parent!=null && node_after.Parent.Id==node_json.parentid){
                    node_json.nodeindex = node_after.Index + 0.5;
                }else{
                    node_json.nodeindex = -1;
                }
            }else{
                node_json.nodeindex = -1;
            }
            return this.addNode(node_json);
        },
        removeNode:function(node){
            if(!(node instanceof jsMind.Node)){
                node = this.getNode(node);
            }
            if(!node){return;}
            if(node.IsRoot){
                _console.error('fail, can not remove the root node');
                return;
            }
            // clean all subordinate nodes
            var children = node.Children;
            var ci = children.length;
            while(ci--){
                this.removeNode(children[ci]);
            }
            // remove from parent's children
            var sibling = node.Parent.Children;
            var si = sibling.length;
            while(si--){
                if(sibling[si].Id == node.Id){
                    sibling.splice(si,1);
                    break;
                }
            }
            // remove from global nodes
            delete this.nodes[node.Id];
            // clean all properties
            for(var k in node){
                delete node[k];
            }
            // remove it's self
            delete node;
        },

        reindex:function(node){
            if(node instanceof jsMind.Node){
                node.Children.sort(jsMind.Node.Compare);
                for(var i=0;i<node.Children.length;i++){
                    node.Children[i].Index = i+1;
                }
            }
        },

        _getJsonArray:function(node,json_array){
            if(!(node instanceof jsMind.Node)){return;}
            if(!json_array){
                json_array = [];
            }
            var o = {
                _nodeindex_ : node.Index,
                nodeid : node.Id,
                isroot : node.IsRoot,
                parentid : (!!node.Parent)?node.Parent.Id:null,
                topic : node.Topic,
                summary : node.Sumary
            };
            json_array.push(o);
            var ci = node.Children.length;
            for(var i=0;i<ci;i++){
                this._getJsonArray(node.Children[i],json_array);
            }
            return json_array;
        },

        getJson:function(){
            var json = this._getJsonArray(this.root,[]);
            return json;
        },

        getJsonString:function(){
            var json = getJson();
            var json_str = JSON.stringify(json);
            return json_str;
    };

    // ============= layout provider ===========================================

    jsMind.layout_provider = function(jm, options){this.jsMind = jm; this.opts = options;};
    jsMind.layout_provider.prototype={
        layout:function(fnCallback){
            _console.debug('layout.layout');
            if(typeof(fnCallback) === 'function'){
                fnCallback();
            }
        }
        // calculate the relative coordinate of every Node
        // every node has 4 properties: basepoint(left,right,center), rel x, rel y, state(open,close,hidden)
        // 
    };

    // view provider
    jsMind.view_provider= function(jm, options){this.jsMind = jm; this.opts = options;};
    jsMind.view_provider.prototype={
        show:function(fnCallback){
            _console.debug('view.show');
            if(typeof(fnCallback) === 'function'){
                fnCallback();
            }
        }
    };

    // theme provider
    jsMind.theme_provider= function(jm, options){this.jsMind = jm; this.opts = options;};
    jsMind.theme_provider.prototype={

    };

    // register global variables
    $w[__jsMindName__] = jsMind;
})(window);
