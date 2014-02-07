(function($w,jm){

if(!!jm){alert("pas de viewEng");}

var $d = $w.document;
var $g = function(id){return $d.getElementById(id);};
var $gtn = function(tag){return $d.getElementsByTagName(tag);};

var $container = $g('jsmind_container');
var $float_toolbar = $g('float_toolbar');
var $jsmind_edit_panel = $g('jsmind_edit_panel');
var $bt_ok = $g('bt_ok');
var $bt_cancel = $g('bt_cancel');
var _view_engine = null;

// Class
var _Event = function(){
	this.Id = null;
};

_Event.prototype = {
	handleKeyPressEvent : function(e){
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
		var selectedNodeId = getSelectedNodeObject();
		//alert(selectedNodeId.Id);
		/*if($jsmind_edit_panel.style.visibility == 'visible'){
			$bt_ok.click();
			$float_toolbar.style.visibility = 'hidden';
		}else if(selectedNodeId){
			$float_toolbar.style.visibility = 'hidden';
			_view_engine.AddNode({Id:new Date(),Topic:"NewNode",Summary:""},selectedNodeId.Parent.Id);
		}*/
	};

	var getSelectedNodeObject = function(){
		_view_engine = new jm.View.Engine('jsMind',$container,jm.View.Mode.Both);
		var nodes = $d.getElementsByTagName('jmnode');
		for(var i = 0;i<nodes.length;i++){
			var nodeClass = nodes[i].getAttribute('class');
			if(nodeClass && nodeClass.indexOf("selected") != -1){
				var selectedNodeId = nodes[i].getAttribute('nodeid');
				var node = _view_engine.FindNode(selectedNodeId);
				alert(node);
				return node;
			}
		}
	};
	
	return {
		Event:_Event
	};
})(window,jsMind);