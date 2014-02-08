
/*
 * example:
 *     var myConfig = {
 *         data:{
 *             type :'url',
 *             data :'http://localhost:8080/example.json'
 *             sync : false,
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
 *     var jm = new jsMind(myConfig);
 *     jm.show()
 *     === OR =======================
 *     var jm = jsMind.show(myConfig);
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
        _console.log('jsMind is already exist.');
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
            //type : 'remote',
            //data : 'http://localhost:8080/example/default_data.json'
            type : 'local',
            data : [
                    {nodeid:'a001', isroot:true, topic:'root node', nodeindex:0},
                    {nodeid:'b001', parentid:'a001', topic:'sub node #1', summary:'summary of node #1', nodeindex:1 },
                    {nodeid:'b002', parentid:'a001', topic:'sub node #2', summary:'summary of node #2', nodeindex:2 }
                   ]
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

    // ============== static object ==============================================

    jsMind.Node = function(sId,iIndex,sTopic,sSummary,bIsRoot,oParent){
        this.Id = sId;
        this.Index = iIndex;
        this.Topic = sTopic;
        this.Summary = sSummary;
        this.IsRoot = bIsRoot;
        this.Parent = oParent;
        this.Children = [];
        this.Data = {};
    };

    // data provider
    jsMind.data_provider = function(jm, options){
        this.jsMind = jm;
        this.opts = options;
        this.root = null;
        this.nodes = [];
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
            _console.debug(this);
        },
        fetch:function(url){
            // do ajax ....
            var node_array = [];
            this.parse(node_array);
        },
        parse:function(node_array){
            // reverse array for improving looping performance
            node_array.reverse();
            var root_node = this._parse_extract_root(node_array);
            _console.debug(root_node);
            if(!!root_node){
                this.root = root_node;
                this._parse_extract_subnode(node_array, root_node);
            }else{
                _console.error('the root node can not be found');
            }
            if(!!this.load_success_callback){
                this.load_success_callback();
            }
        },
        _parse_node:function(node_json, parent_node, isroot){
            var o = node_json;
            var p = parent_node || null;
            var r = isroot || false;
            var node = new jsMind.Node(o.nodeid,o.nodeindex,o.topic,o.summary,r,p);
            return node;
        },
        _parse_extract_root:function(node_array){
            var i = node_array.length;
            while(i--){
                if('isroot' in node_array[i] && node_array[i].isroot){
                    var root_json = node_array[i];
                    node_array.splice(i,1);
                    var root_node = this._parse_node(root_json,null,true);
                    this.nodes.push(root_node);
                    return root_node;
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
                if(node_json.parentid == pid){
                    node = this._parse_node(node_json,parent_node);
                    parent_node.Children.push(node);
                    this.nodes.push(node);
                    node_array.splice(i,1);
                    extract_count ++;
                    var sub_extract_count = this._parse_extract_subnode(node_array,node);
                    if(sub_extract_count > 0){
                        // reset loop index after extract subordinate node
                        i = node_array.length;
                        extract_count += sub_extract_count;
                    }
                }
            }
            return extract_count;
        },
        getRootNode:function(){},
        getSubNodes:function(nodeId){},
        getNode:function(nodeId){},
        addNode:function(node, parentid){},
        removeNodes:function(nodeIdArray){},
        getJsonArray:function(){
        }
    };

    // layout provider
    jsMind.layout_provider = function(jm, options){this.jsMind = jm; this.opts = options;};
    jsMind.layout_provider.prototype={
        layout:function(fnCallback){
            _console.debug('layout.layout');
            if(typeof(fnCallback) === 'function'){
                fnCallback();
            }
        }
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
