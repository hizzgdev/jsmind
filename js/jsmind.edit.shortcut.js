(function(jm,$w){
var $d = $w.document;
var $g = function(id){return $d.getElementById(id);};

var $container = $g('jsmind_container');
var $float_toolbar = $g('float_toolbar');
var $jsmind_edit_panel = $g('jsmind_edit_panel');
var $bt_ok = $g('bt_ok');
var $bt_cancel = $g('bt_cancel');

// Class
jm.EventHandler = function(){
};

jm.EventHandler.prototype = {
	HandleKeyPressEvent : function(e){
		var charCode;
		if(e && e.which){charCode = e.which;}
		else if(window.event){e = window.event;charCode = e.keyCode;}
		
		var availableShortCuts = [ 13, 27, 32, 37, 38, 39, 40 ];
		if(availableShortCuts.indexOf(charCode) != -1){
			switch(charCode) {
				case 13: returnKeyEvent(); 	break;
				case 27: /*escape key*/		break;
				case 32: /*space key*/     	break;
				case 37: /*rigth down*/		break;
				case 38: /*up down*/		break;
				case 39: /*left down*/ 		break;
				case 40: /*down down*/ 		break;
			}   	
		}
	}
}
	
var returnKeyEvent = function(){
	var _view_engine = new jm.View.Engine('jsMind',$container,jm.View.Mode.Both);
	
	//var nodeid = _view_engine.GetSelectedNode();
	//alert(nodeid); --> return null ???
	
	var nodeid = _view_engine.GetSelectedNodeFromElement();
	 _view_engine.SetSelectedNode(nodeid); // TypeError: oNode is undefined
	if($jsmind_edit_panel.style.visibility == 'visible'){
		$bt_ok.click();
		$float_toolbar.style.visibility = 'hidden';
	}else if(selectedNodeId){
		$float_toolbar.style.visibility = 'hidden';
		_view_engine.AddNode({Id:new Date(),Topic:"NewNode",Summary:""},"b00001");
	}
};

})(jsMind,window);