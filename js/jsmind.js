
/*
 * example:
 *     var myConfig = {
 *         data:{
 *             type :'url',
 *             data :'http://localhost:8080/example.json'
 *             sync : false,
 *         },
 *         viewer:{
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
            type : 'url',
            data : 'http://localhost:8080/example/default_data.json',
        },
        viewer:{
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
        override:{
            data : null,
            viewer : null,
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
        for (var o in options) {for (var k in options[o]) {opts[o][k] = options[o][k];}}
        this.options = opts;

        // function provider
        this.data = null;
        this.layout = null;
        this.viewer = null;
        this.theme = null;

        // init
        this.init();
    };

    jsMind.prototype={
        init : function(){
            var opts = this.options;
            var override = opts.override;

            var data_provider = (!!override.data)? override.data : jsMind._data;
            var layout_provider = (!!override.layout)? override.layout : jsMind._layout;
            var viewer_provider = (!!override.viewer)? override.viewer : jsMind._viewer;
            var theme_provider = (!!override.theme)? override.theme : jsMind._theme;

            // create instance of function provider 
            this.data = new data_provider(this, opts.data);
            this.layout = new layout_provider(this, opts.layout);
            this.viewer = new viewer_provider(this, opts.viewer);
            this.theme = new theme_provider(this, opts.theme);
        },

        // show mindmap async
        _show : function(){
            var jm = this;
            jm.data.load(function(){
                _console.debug('data.load ok');
                jm.layout.layout(function(){
                    _console.debug('layout.layout ok');
                    jm.viewer.show(function(){
                        _console.debug('viewer.show ok');
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

    jsMind._data = function(jm, options){
        this.jsMind = jm;
        this.opts = options;
        this.root = null;
        this.nodes = [];
    };
    jsMind._layout = function(jm, options){this.jsMind = jm; this.opts = options;};
    jsMind._viewer= function(jm, options){this.jsMind = jm; this.opts = options;};
    jsMind._theme= function(jm, options){this.jsMind = jm; this.opts = options;};

    jsMind._data.prototype={
        load:function(fnCallback){
            _console.debug('data.load');
            if(typeof(fnCallback) === 'function'){
                fnCallback();
            }
        },
        parse:function(json){},
        getRootNode:function(){},
        getSubNodes:function(nodeId){},
        getNode:function(nodeId){},
        addNode:function(node, parentid){},
        removeNodes:function(nodeIdArray){}
    };

    jsMind._layout.prototype={
        layout:function(fnCallback){
            _console.debug('layout.layout');
            if(typeof(fnCallback) === 'function'){
                fnCallback();
            }
        }
    };

    jsMind._viewer.prototype={
        show:function(fnCallback){
            _console.debug('viewer.show');
            if(typeof(fnCallback) === 'function'){
                fnCallback();
            }
        }
    };

    jsMind._theme.prototype={

    };

    // register global variables
    $w[__jsMindName__] = jsMind;
})(window);
