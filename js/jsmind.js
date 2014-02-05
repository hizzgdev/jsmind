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
    // custom console object for ie6/7/8
    var _console = (typeof(console) == 'undefined')?{
            log:_noop, debug:_noop, error:_noop, warn:_noop, info:_noop
        }:console;

    // dom method's shortcut
    var $d = $w.document;
    var $g = function(id){return $d.getElementById(id);};

    /*
     * jsMind core object
     * example:
     *     var myConfig = {
     *         data:{
     *             type :'url',
     *             data :'http://localhost:8080/example.json'
     *             sync : false,
     *         },
     *         layout:{
     *             mode :'side',
     *             width:80,
     *             height:30
     *         },
     *         viewer:{
     *             container:containerid or dom object,
     *             resize:'auto'
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
    var jsMind = function(config){
        this.data = null;
        this.layout = null;
        this.viewer = null;
        this.theme = null;
        this.init(config);
    }

    jsMind.prototype={
        init    : function(config){
            
        },
        _show   : function(){

        },
        show    : function(){
            this._show();
        }
    };
    jsMind.show = function(config){
        _console.debug('show');
        var jm = new jsMind(config);
        jm.show();
        return jm;
    };

    // register global variables
    $w[__jsMindName__] = jsMind;
})(window);
