(function($w){
    "use strict"
    var $d = $w.document;
    var $g = function(id){return $d.getElementById(id)};
	var $header = $d.getElementsByTagName('header')[0];
	var $footer = $d.getElementsByTagName('footer')[0];
	var $container = $g('jsmind_container');
	var _h_header = $header.clientHeight;
	var _h_footer = $footer.clientHeight;

    var jsMind = $w.jsMind;
    var _jm = null;

    function page_load(){
        init_jsMind();
		set_container_size();
        load_mind();
        register_event();
    }

    function init_jsMind(){
        var options = {
            editable:true,
            container:'jsmind_container',
            theme:'greensea'
        };
        _jm = new jsMind(options);
        _jm.init();
    }

    function register_event(){
		jsMind.util.dom.add_event($w,'resize',reset_container_size);
        jsMind.util.dom.add_event($g('jsmind_tools'),'click',tools_handler);
        jsMind.util.dom.add_event($d,'click',hide_setting_visible);
    }

    function load_mind(){
        var mind_url = 'example/data_example.json';
        jsMind.util.ajax.get(mind_url,function(mind){
            _jm.show(mind);
        });
    }

	var _resize_timeout_id = -1;
	function reset_container_size(){
		if(_resize_timeout_id != -1){
			clearTimeout(_resize_timeout_id);
		}
		_resize_timeout_id = setTimeout(function(){
			_resize_timeout_id = -1;
			set_container_size();
			_jm.resize();
		},300);
	}

    var _setting_visible = false;
    function toggle_setting_visible(e){
        var tools = $g('jsmind_tools');
        if(_setting_visible){
            _setting_visible = false;
            tools.className = tools.className.replace(/\s*jsmind-tools-active/ig,'');
        }else{
            _setting_visible = true;
            tools.className += ' jsmind-tools-active'
        }
    }
    function hide_setting_visible(e){
        if(!_setting_visible){ return; }
        var e_src = e.target || event.srcElement;
        if(e_src != null && e_src.getAttribute('action') === 'toggle'){ return; }

        var tools = $g('jsmind_tools');
        _setting_visible = false;
        tools.className = tools.className.replace(/\s*jsmind-tools-active/ig,'');
    }

    function open_open_dialog(e){}
    function open_save_dialog(e){}
    function open_share_dialog(e){}
    function open_help_dialog(e){}
    function take_screenshot(e){
        _jm.shoot();
    }
    function jsmind_rebuild(e){
        _jm.show();
    }

    var tools_handlers={
        toggle  : toggle_setting_visible,
        open    : open_open_dialog,
        save    : open_save_dialog,
        screenshot : take_screenshot,
        share   : open_share_dialog,
        rebuild : jsmind_rebuild,
        help    : open_help_dialog
    };

    function tools_handler(e){
        var ele = e.target || event.srcElement;
        var action = ele.getAttribute('action');
        if(action in tools_handlers){
            tools_handlers[action](e);
        }
    }

	function set_container_size(){
		var ch = $w.innerHeight-_h_header-_h_footer-2;
		var cw = $w.innerWidth;
		$container.style.height = ch+'px';
		$container.style.width = cw+'px';
	}

    page_load();
})(window);
