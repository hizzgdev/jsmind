/*
 * Released under BSD License
 * Copyright (c) 2014-2015 hizzgdev@163.com
 * 
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */

(function($w){
    'use strict';
    var $d = $w.document;
    var __name__ = 'jsMind';
    var jsMind = $w[__name__];
    if(!jsMind){return;}
    if(typeof(jsMind.shell)!='undefined'){return;}

    var options = {
        play_delay : 1000
    };

    jsMind.shell = function(jm){
        this.jm = jm;
        this.step = 0;
        this.commands = []; //version
        this.delay_handle = 0;
        this.playing = false;
        this.jm_editable = this.jm.get_editable();
    };

    jsMind.shell.prototype = {
        init:function(){
            this.playing = false;
        },
        record:function(action,obj){
            if(!this.playing){
                var command = {action:action,data:obj.data,node:obj.node};
                var prev_command = this.commands[this.step-1];
                if(command.action === 'update_node' && prev_command.action === 'add_node' && prev_command.data[2]==='New Node'){
                    prev_command.data[2] = command.data[1];
                    this.commands[this.step-1] = prev_command;
                }else{
                    this.step = this.commands.push(command);
                }
            }
        },
        execute:function(command){
            var func = this.jm[command.action];
            var node = command.node;
            this.jm.enable_edit();
            func.apply(this.jm,command.data);
            this.jm.disable_edit();
            if(!!node){
                this.jm.select_node(node);
            }
        },
        add_command:function(command){
            this.commands.push(command);
            play();
        },
        replay:function(){
            this.step = 0;
            this.play();
        },
        play:function(){
            this.jm.disable_edit();
            this.playing = true;
            this._play_stepbystep();
        },
        _play_stepbystep:function(){
            if(this.delay_handle != 0){
                $w.clearTimeout(this.delay_handle);
                this.delay_handle = 0;
            }
            if(this.step<this.commands.length){
                this.execute(this.commands[this.step]);
                this.step ++;
                var js = this;
                this.delay_handle = $w.setTimeout(function(){
                    js.play.call(js); 
                },options.play_delay);
            }else{
                this._play_end();
            }
        },
        _play_end:function(){
            this.playing = false;
            if(this.jm_editable){
                this.jm.enable_edit();
            }else{
                this.jm.disable_edit();
            }
        },

        jm_event_handle:function(type, data){
            if(type === jsMind.event_type.show){
                this.record('show',data);
            }
            if(type === jsMind.event_type.edit){
                var action=data.evt;
                delete data.evt;
                this.record(action,data);
            }
        }
    };

    var shell_plugin = new jsMind.plugin('shell',function(jm){
        var js = new jsMind.shell(jm);
        jm.shell = js;
        js.init();
        jm.add_event_listener(function(type,data){
            js.jm_event_handle.call(js,type,data);
        });
    });

    jsMind.register_plugin(shell_plugin);
})(window);
