(function(jm,$w){
if(!jm.Editor || !!jm.Editor.EventHandler){return;}

var $d = $w.document;
var $g = function(id){return $d.getElementById(id);};

var $container = $g('jsmind_container');
var $float_toolbar = $g('float_toolbar');
var $jsmind_edit_panel = $g('jsmind_edit_panel');
var $bt_ok = $g('bt_ok');
var $bt_cancel = $g('bt_cancel');

// Class
jm.ShortCut = function(){
};

jm.ShortCut.prototype = {
	HandleKeyPressEvent : function(e,view_engine){
		var charCode;
		if(e && e.which){charCode = e.which;}
		else if(window.event){e = window.event;charCode = e.keyCode;}
		
		var availableShortCuts = [ 13, 27, 32, 37, 38, 39, 40];
		if(availableShortCuts.indexOf(charCode) != -1){
			switch(charCode) {
				case 13: returnKeyEvent(view_engine); 	break;
				case 27: escapeKeyEvent();				break;
				case 32: /*space key*/     				break;
				case 37: /*rigth down*/					break;
				case 38: /*up down*/					break;
				case 39: /*left down*/ 					break;
				case 40: /*down down*/ 					break;
			}   	
		}
	}
}

// submit edit panel or create a browser node	
var returnKeyEvent = function(view_engine){
	var _view_engine = view_engine;
	var nodeid = _view_engine.GetSelectedNode();
	if($jsmind_edit_panel.style.visibility == 'visible'){
		$bt_ok.click();
		$float_toolbar.style.visibility = 'hidden';
	}else if(nodeid){
		$float_toolbar.style.visibility = 'hidden';
		var newNodeId =  jm.Util.GetUniqueId();
		_view_engine.AddNode({Id:newNodeId,Topic:"NewNode",Summary:""},nodeid.Node.Parent.Id);
		var viewNode = nodeid.Node.View;
		viewNode.Element.className = viewNode.Element.className.replace(/\s*selected\s*/i,'');
		_view_engine.SetSelectedNode(newNodeId);
		var newNode = _view_engine.GetSelectedNode();
		newNode.Element.className += "selected";
	}
};

// cancel edit panel
var escapeKeyEvent = function(){
	if($jsmind_edit_panel.style.visibility == 'visible'){
		$bt_cancel.click();
	}
};
})(jsMind,window);
