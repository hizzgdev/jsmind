(function($w,jm){
	var $d = $w.document;
	var $g = function(id){return $d.getElementById(id);};
	var $gtn = function(tag){return $d.getElementsByTagName(tag);};
	var $c = function(tag){return $d.createElement(tag);};
	var $t = function(n,t){if(n.hasChildNodes()){n.firstChild.nodeValue = t;}else{n.appendChild($d.createTextNode(t));}};

	var $header = $d.getElementsByTagName('header')[0];
	var $footer = $d.getElementsByTagName('footer')[0];
	var _h_header = $header.clientHeight;
	var _h_footer = $footer.clientHeight;

	var $container = $g('jsmind_container');
	var $float_toolbar = $g('float_toolbar');
	var $jsmind_edit_panel = $g('jsmind_edit_panel');
	var $bt_ok = $g('bt_ok');
	var $bt_cancel = $g('bt_cancel');
	var MINDID = 'abcd';
	var _view_engine = null;
	var _editor = null;

	function Page_Load(){
		SetContainerSize();
		jm.Util.AddEvent($w,'resize',ReSetContainerSize);
		jm.Util.AddEvent($w,'keydown',handleKeyPressEvent);
		_view_engine = new jm.View.Engine('jsMind',$container,jm.View.Mode.Both);
		LoadMind();
		enableEdit();
	}

	function LoadMind(){
		var data = [
			 {nodeindex: 0, nodeid: "a00001", parentid: MINDID, summary: "", topic: "极速灵感"},
			 {nodeindex: 0, nodeid: "b00001", parentid: "a00001", summary: "", topic: "介绍"},
			 {nodeindex: 1, nodeid: "b00002", parentid: "a00001", summary: "", topic: "用处"},
			 {nodeindex: 2, nodeid: "b00003", parentid: "a00001", summary: "", topic: "项目"},
			 {nodeindex: 3, nodeid: "b00004", parentid: "a00001", summary: "", topic: "作者"},
			 {nodeindex: 0, nodeid: "c00011", parentid: "b00001", summary: "", topic: "浏览器上的思维导图"},
			 {nodeindex: 1, nodeid: "c00012", parentid: "b00001", summary: "", topic: "Javascript版本的思维导图"},
			 {nodeindex: 2, nodeid: "c00013", parentid: "b00001", summary: "", topic: "可以在线编辑的思维导图"},
			 {nodeindex: 0, nodeid: "c00021", parentid: "b00002", summary: "", topic: "通过网页发布你的思维导图"},
			 {nodeindex: 1, nodeid: "c00022", parentid: "b00002", summary: "", topic: "基于API进行二次开发"},
			 {nodeindex: 0, nodeid: "c00031", parentid: "b00003", summary: "", topic: "以BSD协议开源"},
			 {nodeindex: 1, nodeid: "c00032", parentid: "b00003", summary: "", topic: "源码托管于github"},
			 {nodeindex: 0, nodeid: "c00041", parentid: "b00004", summary: "", topic: "hizzgdev@163.com"},
			 {nodeindex: 1, nodeid: "c00042", parentid: "b00004", summary: "", topic: "ASP/C#/Js较熟悉"},
			 {nodeindex: 2, nodeid: "c00043", parentid: "b00004", summary: "", topic: "Python/Java略知一二"}
		];
		var rootNode = parseNodeTree(MINDID,data);
		_view_engine.Layout(rootNode);
	}

	function enableEdit(){
		_editor = new jm.Editor(_view_engine);
		_editor.Begin(MINDID);
		_editor.EditMind(MINDID);
	}

	function parseNodeTree(sMindId,oDataList){
		var arr = oDataList.slice(0).reverse();
		var rootNode = parseRootNode(sMindId,arr);
		if(rootNode){
			rootNode.Children = parseSubNode(rootNode,arr);
		}
		return rootNode;
	}

	function parseRootNode(sMindid,oDataList){
		var len = oDataList.length;
		var tmp = null;
		var node = null;
		while(len--){
			tmp = oDataList[len];
			if(tmp.parentid == sMindid){
				node = parseNode(tmp);
				oDataList.splice(len,1);
				break;
			}
		}
		return node;
	}

	function parseSubNode(oParent,oDataList){
		var sub = [];
		var len = oDataList.length;
		var data = null;
		var tmp = null;
		var sParentId = oParent.Id;
		while(len--){
			data = oDataList[len];
			if(data.parentid == sParentId){
				tmp = parseNode(data,oParent);
				sub.push(tmp);
				oDataList.splice(len,1);
				tmp.Children = parseSubNode(tmp,oDataList);
				if(tmp.Children.length>0){
					var newlen = oDataList.length;
					if(len >= newlen){
						len = newlen;
					}
				}
			}
		}
		return sub;
	}

	function parseNode(oData,oParent){
		var o = oData;
		var parent = oParent || null;
		var node = new jm.Node(o.nodeid,parseInt(o.nodeindex),o.topic,o.summary,parent);
		return node;
	}

	var _resize_timeout_id = -1;
	function ReSetContainerSize(){
		if(_resize_timeout_id != -1){
			clearTimeout(_resize_timeout_id);
		}
		_resize_timeout_id = setTimeout(function(){
			_resize_timeout_id = -1;
			SetContainerSize();
			_view_engine.ResizeMindPanel();
		},300);
	}
	
	function SetContainerSize(){
		var ch = $w.innerHeight-_h_header-_h_footer-2;
		var cw = $w.innerWidth;
		$container.style.height = ch+'px';
		$container.style.width = cw+'px';
	}
	
	function handleKeyPressEvent(e){
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
	
	function returnKeyEvent(){
		var selectedNodeId = getSelectedNodeObject();
		if($jsmind_edit_panel.style.visibility == 'visible'){
			$bt_ok.click();
			$float_toolbar.style.visibility = 'hidden';
		}else if(selectedNodeId){
			$float_toolbar.style.visibility = 'hidden';
			_view_engine.AddNode({Id:new Date(),Topic:"NewNode",Summary:""},selectedNodeId.Parent.Id);
		}
	}
	
	function getSelectedNodeObject(){
		var nodes = $d.getElementsByTagName('jmnode');
		for(var i = 0;i<nodes.length;i++){
			var nodeClass = nodes[i].getAttribute('class');
			if(nodeClass && nodeClass.indexOf("selected") != -1){
				var selectedNodeId = nodes[i].getAttribute('nodeid');
				var node = _view_engine.FindNode(selectedNodeId);
				return node;
			}
		}
	}

	Page_Load();

})(window,jsMind);


