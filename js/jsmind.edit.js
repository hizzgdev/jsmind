
(function(jm,$w,T){
	if(!!jm.Editor){return;}

	if(!T){
		T={
			Editor:{
				Topic				:	'Topic',
				CreateSubTopic		:	'Create Subtopic',
   				EditTopic			:	'Edit Topic',
				DeleteNodeConfirm	:	'Are you sure to remove this node?',
				DeleteNotAllowed	:	'Can not remove root node'
			}
		};
	}

	// Global Variables
	var _curr_mind_id = null;
	var $d = $w.document;
	var $g = function(id){return $d.getElementById(id);};
	var $c = function(tag){return $d.createElement(tag);};
	var $t = function(n,t){if(n.hasChildNodes()){n.firstChild.nodeValue = t;}else{n.appendChild($d.createTextNode(t));}};

	var $add_event = jm.Util.AddEvent;
	var $remove_event = jm.Util.RemoveEvent;
	
	var $toolbar = null;
	var _toolbar_p = 0;
	var _toolbar_h = 0;
	
	var _active_node_id = null;
	var _view_engine = null;
	
	var $edit_panel = null;
	var _edit_node_id = null;
	var _edit_panel_isopen = false;
	var _edit_panel_action = '';
	
	var $confirm_p = null;
	var $edit_form = null;
	
	var $label_topic = null;
	var $input_topic = null;
	var $input_summary = null;

	var _persistence = {
		add : function(mindId,parentNodeId,sTopic,sSummary,fnCallback){
			var nodeId =  jm.Util.GetUniqueId();
			if(fnCallback){
				fnCallback(mindId,parentNodeId,nodeId,sTopic,sSummary);
			}
		},
		update : function(mindId,nodeId,sTopic,sSummary,fnCallback){
			if(fnCallback){
				fnCallback(mindId,nodeId,sTopic,sSummary);
			}
		},
		remove : function(mindId,nodeId,fnCallback){
			if(fnCallback){
				fnCallback(mindId,nodeId);
			}
		}
	};
	
	// class
	
	jm.Editor = function(oViewEngine,oPersistence){
		this.ViewEngine = oViewEngine;
		this._IsReady = false;
		this._IsEditMode = false;

		if(oPersistence){
			if(oPersistence.add){_persistence.add=oPersistence.add;}
			if(oPersistence.edit){_persistence.edit=oPersistence.edit;}
			if(oPersistence.remove){_persistence.remove=oPersistence.remove;}
		}
	};
	
	jm.Editor.prototype = {

		Init : function(){
			if(!this._IsReady){
				this._IsReady = true;
				
				this.ViewEngine.Init();

				_view_engine = this.ViewEngine;
				
				$toolbar = $g('float_toolbar');
				_toolbar_h = $toolbar.offsetHeight;
				$edit_panel = $g('jsmind_edit_panel');
				this.ViewEngine.AddAttachElement($toolbar);
				this.ViewEngine.AddAttachElement($edit_panel);
				
				$edit_form = $g('edit_form');
				$confirm_p = $g('confirm_p');
				$label_topic = $g('label_topic');
				$input_topic = $g('input_topic');
				$input_summary = $g('input_summary');
				
				$add_event($toolbar,'mouseover',OnToolBarEnter);
				$add_event($toolbar,'mouseout',OnToolBarLeave);
				$add_event($toolbar,'click',OnToolBarClick);
				$add_event($g('bt_ok'),'click',OnOkBtClick);
				$add_event($g('bt_cancel'),'click',OnCancelBtClick);
			}
		},
		
		Begin : function(){
			this.Init();
			if(!this._IsEditMode){
				this._IsEditMode = true;
				this.ViewEngine.RegisterNodeEvent({
					NodeEnter : OnNodeEnter,
					NodeLeave : OnNodeLeave,
					NodeClick : OnNodeClick
				});
			}
		},
		
		End : function(){
			if(this._IsEditMode){
				this._IsEditMode = false;
				this.ViewEngine.ClearNodeEvent();
			}
		},

		EditMind : function(sMindId){
			_curr_mind_id = sMindId;
		}
	};
	
	function CalculateToolbarTop(element){
		var elementTop = parseInt(element.style.top);
		var elementHeight = element.clientHeight;
		var toolbarTop = elementTop - _toolbar_h - 4;
		var scrollTop = _view_engine.GetScrollHeight();
		var containerHeight = _view_engine.GetContainerHeight();
		if(elementTop <= scrollTop){
			_view_engine.ScrollTo(elementTop);
		}else if(elementTop + elementHeight > scrollTop + containerHeight){
			_view_engine.ScrollTo(elementTop + elementHeight - containerHeight);
		}

		if(toolbarTop < scrollTop){
			toolbarTop = elementTop + elementHeight + 4;
		}
		return toolbarTop;
	}

	// event
	
	function OnNodeEnter(element){
		if(_toolbar_p == 3){
			return;
		}
		_toolbar_p = 1;
		setTimeout(function(){
			if(_toolbar_p == 1){
				_active_node_id = element.getAttribute('nodeid');
				//_view_engine.ScrollTo(toolbarTop);
				var toolbarTop = CalculateToolbarTop(element);
				$toolbar.style.top = toolbarTop+'px';
				$toolbar.style.left = element.style.left;
				$toolbar.style.visibility = 'visible';
			}
		},400);
	}
	
	function OnNodeLeave(element){
		if(_toolbar_p == 3){
			return;
		}
		_toolbar_p = 0;
		setTimeout(function(){
			if(_toolbar_p == 0){
				$toolbar.style.visibility = 'hidden';
			}
		},150);
	}
	
	function OnNodeClick(element){
		var tagName = element.tagName.toLowerCase();
		if(tagName == 'jmnode'){
			n_nodeid = element.getAttribute('nodeid');
			if(n_nodeid != _edit_node_id){
				CloseEditPanel();
			}
			_toolbar_p = 3;
			_active_node_id = n_nodeid;
			_edit_node_id = n_nodeid;
			var toolbarTop = CalculateToolbarTop(element);
			$toolbar.style.top = toolbarTop+'px';
			$toolbar.style.left = element.style.left;
			$toolbar.style.visibility = 'visible';
			$toolbar.className='float-toolbar float-toolbar-hover';
		}else{
			_toolbar_p = 0;
			_active_node_id = null;
			$toolbar.style.visibility = 'hidden';
			$toolbar.className='float-toolbar';
		}
	}
	
	function OnToolBarEnter(e){
		if(_toolbar_p == 3){
			return;
		}
		_toolbar_p = 2;
	}
	
	function OnToolBarLeave(e){
		if(_toolbar_p == 3){
			return;
		}
		_toolbar_p = 0;
		setTimeout(function(){
			if(_toolbar_p == 0){
				$toolbar.style.visibility = 'hidden';
			}
		},50);
	}
	
	function OnToolBarClick(e){
		var element = e.target || event.srcElement;
		if(element.tagName.toLowerCase() == 'img'){
			var action = element.getAttribute('action');
			_edit_node_id = _active_node_id
			if(action == 'add'){
				DoActionAdd();
			}else if(action == 'delete'){
				DoActionDelete();
			}else if(action == 'edit'){
				DoActionEdit();
			}else if(action == 'detail'){
				DoActionDetail();
			}
		}
	}
	
	function OnOkBtClick(e){
		EditConfirm(_edit_node_id);
	}
	
	function OnCancelBtClick(e){
		CloseEditPanel();
	}
	
	// method
	
	function ShowEditPanel(oViewNode){
		var direct = oViewNode.Direct;
		var p = _view_engine.GetViewNodePosition(oViewNode);
		var t = p.Top + oViewNode.Size.Height + 5;
		var l = p.Left;
		
		$edit_panel.style.left = l + 'px';
		$edit_panel.style.top = t + 'px';
		$edit_panel.style.visibility = 'visible';
		$input_topic.focus();
		_edit_panel_isopen = true;

		var panelHeight = $edit_panel.clientHeight;
		var scrollTop = _view_engine.GetScrollHeight();
		var containerHeight = _view_engine.GetContainerHeight();
		if(t+panelHeight > scrollTop + containerHeight){
			_view_engine.ScrollTo(t+panelHeight+ 5 - containerHeight);
		}

		//$w.location.href='#edit_panel';
	}
	
	function CloseEditPanel(){
		if(!_edit_panel_isopen){
			return;
		}
		$edit_panel.style.visibility = 'hidden';
		$edit_panel.style.top = '0';
		$edit_panel.style.left = '0';
		
		if(_edit_panel_action == 'detail'){
			$input_topic.readOnly = false;
			$input_topic.className = '';
			$input_summary.readOnly = false;
			$input_summary.className = '';
		}else if(_edit_panel_action == 'delete'){
			$edit_form.style.display = '';
			$confirm_p.style.display = 'none';
		}
	}
	
	function EditConfirm(nodeid){
		if(_edit_panel_action == 'detail'){
			$input_topic.readOnly = false;
			$input_topic.className = '';
			$input_summary.readOnly = false;
			$input_summary.className = '';
		}else if(_edit_panel_action == 'edit'){
			var topic = $input_topic.value;
			var summary = $input_summary.value;
			_persistence.update(_curr_mind_id,nodeid,topic,summary,function(mindid,nodeid,topic,summary){
				_view_engine.UpdateNode({
					Id:nodeid,
					Topic:topic,
					Summary:summary});
			});
		}else if(_edit_panel_action == 'add'){
			var topic = $input_topic.value;
			var summary = $input_summary.value;
			_persistence.add(_curr_mind_id,nodeid,topic,summary,function(mindid,parentid,nodeid,topic,summary){
				_view_engine.AddNode({
					Id:nodeid,
					Topic:topic,
					Summary:summary},parentid);
			});
		}else if(_edit_panel_action == 'delete'){
			_persistence.remove(_curr_mind_id,nodeid,function(mindid,nodeid){
				_view_engine.RemoveNode(nodeid);
				$toolbar.style.visibility = 'hidden';
			});
			$edit_form.style.display = '';
			$confirm_p.style.display = 'none';
		}
		CloseEditPanel();
	}
	
	function DoActionAdd(){
		var node = _view_engine.FindNode(_active_node_id);
		if(node){
			_edit_panel_action = 'add';
			var viewNode = node.View;
			$t($label_topic,T.Editor.CreateSubTopic);
			$input_topic.value = '';
			$input_summary.value = '';
			ShowEditPanel(viewNode);
		}
	}

	function DoActionDelete(){
		if(_view_engine.IsRootNode(_active_node_id)){
			alert(T.Editor.DeleteNotAllowed);
			return;
		}
		var node = _view_engine.FindNode(_active_node_id);
		if(node){
			_edit_panel_action = 'delete';
			
			$t($confirm_p,T.Editor.DeleteNodeConfirm);
			
			$edit_form.style.display = 'none';
			$confirm_p.style.display = 'block';
			
			ShowEditPanel(node.View);
		}
	}
	
	function DoActionEdit(){
		var node = _view_engine.FindNode(_active_node_id);
		if(node){
			_edit_panel_action = 'edit';
			var viewNode = node.View;
			$t($label_topic,T.Editor.EditTopic);
			$input_topic.value = node.Topic;
			$input_summary.value = node.Summary;
			ShowEditPanel(viewNode);
		}
	}
	function DoActionDetail(){
		var node = _view_engine.FindNode(_active_node_id);
		if(node){
			_edit_panel_action = 'detail';
			var viewNode = node.View;
			$t($label_topic,T.Editor.Topic);
			$input_topic.value = node.Topic;
			$input_topic.readOnly = true;
			$input_topic.className = 'readonly';
			$input_summary.value = node.Summary;
			$input_summary.readOnly = true;
			$input_summary.className = 'readonly';
			ShowEditPanel(viewNode);
		}
	}

	
})(jsMind,window,null);
