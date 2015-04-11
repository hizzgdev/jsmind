/*
 * Released under BSD License
 * Copyright (c) 2014-2015 hizzgdev@163.com
 * 
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */

(function($w){
    "use strict";
    var $d = $w.document;
    var __name__ = 'jsMind';
    var jsMind = $w[__name__];
    if(!jsMind){return;}

    jsMind.shell = function(jm){
        this.jm = jm;
        this.commands = [];
    };

    jsMind.shell.prototype = {
        init:function(){
        },
        execute:function(command){
        },
        execute_batch:function(commands,interval){
        },
        add_command:function(command){
        },
        get_command_list:function(){
        },
        get_next_command:function(){
        },
        reset:function(){
        },
        record:function(action,data){
            console.log(action);
            console.log(data);
        }
    };
    var jm_event_handle = function(jm, type, data){
        if(type === 'init'){
            var js = new jsMind.shell(jm);
            jm.shell = js;
        }
        if(type === 'show'){
            var js = jm.shell;
            js.init();
            if(!!js){
                js.record('show',data);
            }
        }
        if(type === 'edit'){
            var js = jm.shell;
            if(!!js){
                var action=data.evt;
                delete data.evt;
                js.record(action,data);
            }
        }
    }
    jsMind.add_event_handle(jm_event_handle);
})(window);
