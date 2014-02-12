(function($w,jm){
	var $d = $w.document;
	var $g = function(id){return $d.getElementById(id);};
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
		_view_engine = new jm.View.Engine('jsMind',$container,jm.View.Mode.Both);
		LoadMind();
		enableEdit();
		var shortCutEvent = new jm.EventHandler();
		jm.Util.AddEvent($w,'keydown',function(e){shortCutEvent.HandleKeyPressEvent(e,_view_engine);});
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

	Page_Load();

})(window,jsMind);


