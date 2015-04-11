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

    var js = null;

    jsMind.shell = function(jm_){
        this.jm = jm_;
        this.commands = [];
    };

    jsMind.shell.prototype = {
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
        }
    };
    var jm_event_handle = function(jm_, type, data){
        if(type === 'init'){
            js = new jsMind.shell(jm_);
        }
        if(type === 'edit'){
            if(!!js){
                console.log(data);
            }
        }
    }
    jsMind.add_event_handle(jm_event_handle);
})(window);
