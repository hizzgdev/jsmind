(function($w){
    var $d = $w.document;
	var $header = $d.getElementsByTagName('header')[0];
	var $footer = $d.getElementsByTagName('footer')[0];
	var $container = $d.getElementById('jsmind_container');
	var _h_header = $header.clientHeight;
	var _h_footer = $footer.clientHeight;

    var jsMind = $w.jsMind;
    var _jm = null;

    function page_load(){
		set_container_size();

        var options = {
            data:{readonly:false},
            view:{container:'jsmind_container'}
        };
        _jm = jsMind.show(options);

		jsMind.util.dom.add_event($w,'resize',reset_container_size);
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
	
	function set_container_size(){
		var ch = $w.innerHeight-_h_header-_h_footer-2;
		var cw = $w.innerWidth;
		$container.style.height = ch+'px';
		$container.style.width = cw+'px';
	}

    page_load();
})(window);
