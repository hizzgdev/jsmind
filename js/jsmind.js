/*
Core:

Define Direct[-1,0,1] as Left,Center,Right
Define HSpace,VSpace

/* | Node
 * |---------------------------------
 * | Direct [-1,0,1]
 * | Children
 * | IndexOfSide
 * | CountOfRight,CountOfLeft
 * | Index
 * | BaseX,BaseY
 * | Left,Right,Top,Bottom
 * | Width,Height


Level1(RootNode):
	Direct = 0
	Index = 0
	BaseX = 0
	BaseY = 0

LevelN
	Direct = 
		Parent.Direct											(Parent.Direct != 0)
		(2 * Index - Parent.Children.Count + 1) > 0 ? -1 : 1	(Parent.Direct = 0)
	
	CountOfRight = (Parent.Direct==0)?Math.ceil(Count/2) : (1+Direct)*Count/2;
	CountOfLeft = Count - CountOfRight;
	
	IndexOfSide =
		Index														(Parent.Direct != 0)
		(1-Direct) * Count / 2 + Direct * Index + (Direct -1) / 2	(Parent.Direct = 0)

	BaseX = (1 - Direct) * Parent.Left / 2 + (1+Direct) * Parent.Right / 2 + Direct * HSpace
	BaseY = (2 * IndexOfSide - (1-Direct)*CountOfLeft/2 + (1+Direct)*CountOfRight/2 + 1) * (this.Height + VSpace) / 2 + Parent.BaseY

	Infact
	Parent.BaseY = (Parent.Top + Parent.Bottom) / 2

	Left	= BaseX + (Direct - 1) * Width / 2
	Right	= BaseX + (Direct + 1) * Width / 2
	Top		= BaseY - Height / 2
	Bottom	= BaseY + Height / 2

*/

var jsMind = (function($w){
// Config
var _ViewNodeSpaceH = 30;
var _ViewNodeSpaceV = 20;
var _ViewNodeHeight = _ViewNodeSpaceV * 4;
var _ViewNodeExpanderSize = 13;

// Global Variables
var $d = $w.document;
var $g = function(id){return $d.getElementById(id);};
var $c = function(tag){return $d.createElement(tag);};
var $t = function(n,t){if(n.hasChildNodes()){n.firstChild.nodeValue = t;}else{n.appendChild($d.createTextNode(t));}};

var __not_ie = !!$d.body.addEventListener;
//target,eventType,handler
var $add_event=__not_ie?function(t,e,h){t.addEventListener(e,h,false);}:function(t,e,h){t.attachEvent('on'+e,h);};
var $remove_event=__not_ie?function(t,e,h){t.removeEventListener(e,h,false);}:function(t,e,h){t.detachEvent('on'+e,h);};

// Import Method
var SetCanvasStyle = function(c){
	c.strokeStyle = '#555';
	c.lineWidth = 2;
	c.lineCap='round';
}
var easingztf = function(t,b,c,d){var x=t*4/d;return (1-Math.pow(Math.E,-(x*x)/2))*c+b;};
var ztLineTo = function(ctx,x1,y1,x2,y2){
	ctx.moveTo(x1,y1);
	ctx.beginPath();
	var l = x2-x1;
	var c = y1-y2;
	var absl = Math.abs(l);
	var t = 0;
	for(var t=0;t<absl+1;t++){
		y2 = y1-easingztf(t,0,c,l);
		ctx.lineTo(t*(Math.abs(l)/l)+x1,y2);
	}
	ctx.stroke();
};

// Enum
var _ViewDirect = {Left:-1,Center:0,Right:1};

// Struct
var _Size = function(iWidth,iHeight){
	this.Width = iWidth || 0;
	this.Height = iHeight || 0;
};

var _Position = function(iLeft,iRight,iTop,iBottom){
	this.Left = iLeft || 0;
	this.Right = iRight || 0;
	this.Top = iTop || 0;
	this.Bottom = iBottom || 0;
};

// Class
var _Node = function(sId,iIndex,sTopic,sSummary,oParent){
	this.Id = sId;
	this.Index = iIndex;
	this.Topic = sTopic;
	this.Summary = sSummary;
	this.Parent = oParent;
	this.Children = [];
	this.View = null;
};

var _ViewNode = function(oNode,oParent){
	if(!!oNode){
		// init
		this.Node = oNode;
		this.Index = oNode.Index;
		this.Parent = oParent;
		oNode.View = this;
		// parse
		this.Children = [];
		this.Direct = _ViewDirect.Center;
		this.IndexOfSide = 0;
		this.CountOfLeft = 0;
		this.CountOfRight = 0;
		// PreDraw
		this.Element = null;
		this.Expander = null;
		this.Size = null;
		this.BaseX = 0;
		this.BaseY = 0;
		this.Position = null;
		// Lazy Calculate
		this._SpaceHeight = -1;
		this._SpaceHeightL = -1; // Root Node Only
		// Internal
		this.__Visible = true;
	}
};

_ViewNode.prototype = {

	HasChildren : function(){
		return this.Children != null && this.Children.length > 0;
	},

	IsRoot : function(){
		return !this.Parent;
	},

	IsNotRoot : function(){
		return !!this.Parent;
	},

	GetNWPosition : function(iOffsetWidth,iOffsetHeight){
		var p = {Top:this.Position.Top,Left:this.Position.Left};
		p.Top += iOffsetHeight;
		p.Left += iOffsetWidth;
		return p;
	},

	GetExpanderPosition : function(iOffsetWidth,iOffsetHeight){
		var p = {Top:this.BaseY,Left:this.BaseX};
		p.Top += iOffsetHeight-_ViewNodeExpanderSize/2;
		p.Left += iOffsetWidth+this.Direct*this.Size.Width-(1-this.Direct)*_ViewNodeExpanderSize/2;
		return p;
	},
	
	GetOutPosition : function(iOffsetWidth,iOffsetHeight){
		var p = {Top:this.BaseY,Left:this.BaseX};
		p.Top += iOffsetHeight;
		p.Left += iOffsetWidth+this.Direct*(this.Size.Width + _ViewNodeExpanderSize);
		return p;
	},
	
	GetInPosition : function(iOffsetWidth,iOffsetHeight){
		var p = {Top:this.BaseY,Left:this.BaseX};
		p.Top += iOffsetHeight;
		p.Left += iOffsetWidth;
		return p;
	},
	
	GetSpaceHeightRoot : function(eDirect,bRefresh){
		var refresh = bRefresh || false;
		var oldValue = (eDirect == _ViewDirect.Left)? this._SpaceHeightL:this._SpaceHeight;
		if(refresh || oldValue == -1){
			var children = this.Children;
			var childCount = (!!children)?children.length:0;
			var viewNode = null;
			var validCount = 0;
			var newValue = 0;
			while(childCount--){
				viewNode = children[childCount];
				if(viewNode.Direct == eDirect){
					validCount++;
					newValue += viewNode.GetSpaceHeight(refresh);
				}
			}
			newValue += (validCount-1) * _ViewNodeSpaceV;
			if(eDirect == _ViewDirect.Left){
				this._SpaceHeightL = newValue;
			}else{
				this._SpaceHeight = newValue;
			}
			return newValue;
		}else{
			return oldValue;
		}
	},
	
	ClearSpaceHeightCache : function(){
		var p=this;
		while(p){
			p._SpaceHeight = -1;
			p._SpaceHeightL = -1;
			p=p.Parent;
		}
	},
	
	GetSpaceHeight : function(bRefresh){
		var refresh = bRefresh || false;
		if(refresh || this._SpaceHeight==-1){
			this._SpaceHeight = this._CalculateSpaceHeight(refresh);
		}
		return this._SpaceHeight;
	},
	
	_CalculateSpaceHeight : function(bRefresh){
		var refresh = bRefresh || false;
		var children = this.Children;
		var childCount = (!!children)?children.length:0;
		var allChildrenHeight = (childCount-1) * _ViewNodeSpaceV;
		var child = null
		while(childCount--){
			child = children[childCount];
			if(!child.__Visible){
				allChildrenHeight -= _ViewNodeSpaceV;
				continue;
			}
			allChildrenHeight += children[childCount].GetSpaceHeight(refresh);
		}
		var spaceHeight = Math.max(this.Size.Height,allChildrenHeight);
		return spaceHeight;
	},

	CalculatePosition : function(){
		if(this.Direct == _ViewDirect.Center){
			this.Position = new _Position(
				this.BaseX - this.Size.Width / 2,
				this.BaseX + this.Size.Width / 2,
				this.BaseY - this.Size.Height / 2,
				this.BaseY + this.Size.Height / 2
			);
		}else{
			this.Position = new _Position(
				this.BaseX - (1 - this.Direct) * this.Size.Width / 2,
				this.BaseX + (1 + this.Direct) * this.Size.Width / 2,
				this.BaseY - this.Size.Height / 2,
				this.BaseY + this.Size.Height / 2
			);
		}
		return this.Position;
	}
};

var _ViewEngine = function(sName,oTarget,bHalfSide){
	this.EngineName=sName;
	this.Version = '0.1';
	this.Target = oTarget;
	this.Width = oTarget.clientWidth;
	this.Height = oTarget.clientHeight;
	this.HalfSide = !!bHalfSide;
	
	this.RootViewNode = null;
	
	this._IsReady = false;	// IsReady
	this._Container = null;	// Container
	this._Panel = null;		// Panel
	this._Canvas = null;	// Canvas
	this._CanvasCtx = null;	// Canvas 2d Context
	this._Nodes = {};		// ALL Nodes
	this._ViewNodes = {};	// ViewNodes
	this._SelectedViewNode = null;
	this._OffsetPosition = new _Position();
	this._OffsetWidth = 0;
	this._OffsetHeight = 0;
	
	this._Event = {
		NodeEnter:null,
		NodeLeave:null,
		NodeClick:null
	};
};

_ViewEngine.prototype = {

	Init : function(){
		if(!this._IsReady){
			this._IsReady = true;
			var l = $c('div');
			l.className = 'jsmind-inner';
			//l.style.width = this.Width+'px';
			//l.style.height = this.Height+'px';
			
			var can = $c('canvas');
			var panel = $c('jmnodes');
			
			l.appendChild(can);
			l.appendChild(panel);
			
			this.Target.appendChild(l);
			
			this._Container = l;
			this._Panel = panel;
			this._Canvas = can;

			var __ve = this;
			$add_event(panel,'mouseover',function(e){__ve.onNodeEnter(e);});
			$add_event(panel,'mouseout',function(e){__ve.onNodeLeave(e);});
			$add_event(panel,'click',function(e){__ve.onNodeClick(e);});
		}
	},
	
	RegisterNodeEvent : function(e){
		if(e.NodeEnter){this._Event.NodeEnter = e.NodeEnter;}
		if(e.NodeLeave){this._Event.NodeLeave = e.NodeLeave;}
		if(e.NodeClick){this._Event.NodeClick = e.NodeClick;}
	},
	
	ClearNodeEvent : function(){
		this._Event.NodeEnter = null;
		this._Event.NodeLeave = null;
		this._Event.NodeClick = null;
	},
	
	GetCanvasCtx : function(){
		if(!this._CanvasCtx){
			var ctx = this._Canvas.getContext('2d');
			this.ResetCanvasStyle(ctx);
			this._CanvasCtx = ctx;
		}
		return this._CanvasCtx;
	},
	
	ResetCanvasStyle : function(oCanvasCtx){
		var c = oCanvasCtx || this._CanvasCtx;
		if(c){
			SetCanvasStyle(c);
		}
	},

	Clear : function(){
		alert('not supported');
		this._Nodes = {};		// ALL Nodes
		this._ViewNodes = {};	// ViewNodes
		this._SelectedViewNode = null;
		this.ClearLine();
	},
	
	Layout : function(oData){
		this.Init();
		var oNodeTree = this.ParseNode(oData);
		this.RootViewNode = this.ParseViewNode(oNodeTree);
		this._SlideNodes();
		this.PreDraw();
		this.ResizeCanvas();
		//debugger;
		this.Draw();
		this.DrawLine();
		//this.LayoutRoot(oNodeTree);
	},
	
	FindNode : function(sId){
		return this._Nodes[sId];
	},

	IsRootNode : function(sId){
		return sId == this.RootViewNode.Node.Id;
	},

	ParseNode : function(oData,oParent,iIndex){
		var parent = oParent || null;
		var idx = iIndex || 0;
		if(oData){
			if(oData instanceof _Node){
				return oData;
			}
			
			var node = new _Node(oData.Id,idx,oData.Topic,oData.Summary,parent);
			var nodeChildren = node.Children;
			var children = oData.Children;
			var childCount = (!!children)?children.length:0;
			while(childCount--){
				nodeChildren.unshift(this.ParseNode(children[childCount],node,childCount));
			}
			return node;
		}
	},

	AddNode : function(oData,sParentId){
		// Node
		var oParent = this.FindNode(sParentId);
		var oNode = null;
		if((!!oParent) && (!!oData)){
			var children = oParent.Children;
			var childCount = 0;
			if(children){
				childCount = children.length;
			}else{
				oParent.Children = [];
			}
			var oNode = new _Node(oData.Id,childCount,oData.Topic,oData.Summary,oParent);
			children.push(oNode);
			this._Nodes[oData.Id] = oNode;
		}else{
			debugger;
		}
		// ViewNode
		var viewNode = null;
		if(oNode){
			oViewNodeParent = oParent.View;
			viewNode = this.ParseViewNode(oNode,oViewNodeParent);
			oViewNodeParent.Children.push(viewNode);
			
			if(oViewNodeParent.Parent){
				this._SlideNodes(viewNode);
			}else{
				this._SlideNodes();
			}
			viewNode.ClearSpaceHeightCache();
			this._PreDrawViewNode(viewNode);
			this.RefreshExpander(oViewNodeParent);
			this.RefreshExpander(viewNode);
			
			this.ReDraw(true);
		}
	},
	
	UpdateNode : function(oData){
		var node = this.FindNode(oData.Id);
		if(node){
			node.Topic = oData.Topic;
			node.Summary = oData.Summary;
			var viewNode = node.View;
			var element = viewNode.Element;
			$t(element,node.Topic);
			viewNode.Size = new _Size(element.offsetWidth,element.offsetHeight);
			this.ReDraw(true);
		}
	},
	
	RemoveNodeData : function(oNode,bReIndex){
		var reIndex = (typeof(bReIndex) == 'undefined')?true:(!!bReIndex);
		if(oNode){
			var children = oNode.Children;
			var childCount = (!!children)?children.length:0;
			while(childCount--){
				this.RemoveNodeData(children[childCount],false);
			}
			this.RemoveNodeElement(oNode.View);
			this.HideExpander(oNode.View);
			var id = oNode.Id;
			delete this._Nodes[id];
			delete this._ViewNodes[id];

			if(reIndex){
				var oParent = oNode.Parent;
				var borthers = oParent.Children;
				var viewBorthers = oParent.View.Children;
				borthers.splice(oNode.Index,1);
				viewBorthers.splice(oNode.Index,1);
				var bortherCount = borthers.length;
				while(bortherCount--){
					borthers[bortherCount].Index = bortherCount;
					viewBorthers[bortherCount].Index = bortherCount;
				}
			}
		}
	},

	RemoveNode : function(sNodeId){
		var oNode = this.FindNode(sNodeId);
		
		if(!!oNode){
			var oParent = oNode.Parent;
			if(!!oParent){
				if(this._SelectedViewNode && this._SelectedViewNode.Node.Id === sNodeId){
					this._SelectedViewNode = null;
				}
				oNode.View.ClearSpaceHeightCache();
				this.RemoveNodeData(oNode,true);
				delete oNode;
				this._OffsetPosition = new _Position();

				this._SlideNodes(oParent.View);
				this.RefreshExpander(oParent.View);

				this.ReDraw(true);
			}
		}
	},

	_Expand_Collapse : function(sNodeId,bExpand){
		var oNode = this.FindNode(sNodeId);
		var oViewNode = oNode.View;
		var children = oViewNode.Children;
		var len = children != null ? children.length : 0;
		var child = null;
		while(len--){
			child = children[len];
			child.__Visible = bExpand;
			child.ClearSpaceHeightCache();
			this._PreDrawViewNode(child);
			//this.RefreshExpander(viewNode);
		}
		this.ReDraw(true);
	},

	Collapse : function(sNodeId){
		this._Expand_Collapse(sNodeId,false);
	},

	Expand : function(sNodeId){
		this._Expand_Collapse(sNodeId,true);
	},
	
	ShineNode : function(sNodeId,iCount,iDuration){//iDuration millisecond
		iCount = iCount || 4;
		iDuration = iDuration || 3000;
		var elem = null;
		var tips = iCount * 2;
		var tip = 0;
		var intervalId = -1;
		var elemClassName,elemClassNameShine;
		
		function shine(){
			if(tip>=tips && intervalId>0){
				clearInterval(intervalId);
				intervalId = -1;
			}
			if(tip&1){
				elem.className = elemClassNameShine;
			}else{
				elem.className = elemClassName;
			}
			tip++;
		}
	
		var oNode = this.FindNode(sNodeId);
		if(oNode){
			elem = oNode.View.Element;
			elemClassName = elem.className;
			elemClassNameShine = elemClassName + ' shine';
			var interval = Math.round(iDuration/iCount/2);
			intervalId = setInterval(shine,interval);
		}
	},

	GetViewNodePosition : function(oViewNode){
		var offsetWidth = this._OffsetWidth/2;
		var offsetHeight = this._OffsetHeight/2;
		return oViewNode.GetNWPosition(offsetWidth,offsetHeight);
	},
	
	AddAttachElement : function(oElement){
		if(this._Container){
			this._Container.appendChild(oElement);
		}
	},
	
	ReDraw : function(bReLayout){
		if(bReLayout){
			this._PositionL0();
		}
		this.ClearLine();
		this.ResizeCanvas();
		this.Draw();
		this.DrawLine();
	},

	ParseViewNode : function(oNode,oParent){
		var parent = oParent || null;
		if(oNode){
			var viewNode = new _ViewNode(oNode,parent);
			var viewNodeChildren = viewNode.Children;
			var children = oNode.Children;
			var index = children.length;
			
			while(index--){
				var child = this.ParseViewNode(children[index],viewNode);
				viewNodeChildren.unshift(child);
			}
			this._Nodes[oNode.Id] = oNode;
			this._ViewNodes[oNode.Id] = viewNode;
			return viewNode;
		}
	},

	_SlideNodes : function(oViewNode){
		var viewNode = oViewNode || this.RootViewNode;
		var parent = viewNode.Parent;
		
		var children = viewNode.Children;
		var childCount = (!!children)?children.length:0;
		var changed = false;
		
		var cr = viewNode.CountOfRight;
		var cl = viewNode.CountOfLeft;
		var d = viewNode.Direct;
		var is = viewNode.IndexOfSide;
		
		var ncr = childCount;
		var ncl = childCount;
		var nd = d;
		var nis = is;

		if(!!parent){
			if(this.HalfSide){
				nd = _ViewDirect.Right;
				nis = viewNode.Index;
			}else{
				nd = (parent.Direct != _ViewDirect.Center) ? parent.Direct :
					((2 * viewNode.Index - parent.Children.length + 1) > 0 ? _ViewDirect.Left : _ViewDirect.Right);
				nis = (parent.Direct != _ViewDirect.Center) ? viewNode.Index :
					((1-nd) * parent.Children.length / 2 + nd * viewNode.Index + (nd -1) / 2);
			}
		}else{
			if(!this.HalfSide){
				ncr = Math.ceil(childCount/2);
				ncl = childCount - ncr;
			}
		}
		
		if(ncr != cr){
			viewNode.CountOfRight = ncr;
			changed = true;
		}
		if(ncl != cl){
			viewNode.CountOfLeft = ncl;
			changed = true;
		}
		if(nd != d){
			viewNode.Direct = nd;
			changed = true;
		}
		if(nis != is){
			viewNode.IndexOfSide = nis;
			changed = true;
		}
		
		if(changed){
			while(childCount--){
				this._SlideNodes(children[childCount]);
			}
		}
	},

	ResizeCanvas : function(){
		var h = Math.abs(this._OffsetPosition.Top - this._OffsetPosition.Bottom);
		var w = Math.abs(this._OffsetPosition.Left - this._OffsetPosition.Right);
		
		var neww = (w>this.Width)? w + _ViewNodeSpaceH * 4 : this.Width;
		var newh = (h>this.Height)? h + _ViewNodeSpaceV * 4 : this.Height;
		
		var resize = false;
		if(this._OffsetWidth != neww){
			this._OffsetWidth = neww;
			resize = true;
		}
		if(this._OffsetHeight != newh){
			this._OffsetHeight = newh;
			resize = true;
		}
		if(resize){
			var ww = this._OffsetWidth-22;
			var hh = this._OffsetHeight;
			this._Panel.style.width = ww+'px';
			this._Panel.style.height = hh+'px';
			this._Canvas.width = ww;
			this._Canvas.height = hh;
			this.ResetCanvasStyle();

			var moreHeight = hh - this._Container.clientHeight;
			var moreWidth = ww - this._Container.clientWidth;
			if(moreHeight > 0){
				this._Container.scrollTop = moreHeight/2;
			}
			if(moreWidth > 0){
				this._Container.scrollLeft = moreWidth/2;
			}
		}
	},

	GetContainerHeight : function(){
		return this._Container.clientHeight;
	},

	GetScrollHeight : function(){
		return this._Container.scrollTop;
	},

	ScrollTo : function(iScrollTop){
		this._Container.scrollTop = iScrollTop;
	},

	CalculateOffsetSize : function(oPosition){
		if(oPosition.Left < this._OffsetPosition.Left){
			this._OffsetPosition.Left = oPosition.Left;
		}
		if(oPosition.Right > this._OffsetPosition.Right){
			this._OffsetPosition.Right = oPosition.Right;
		}
		if(oPosition.Top < this._OffsetPosition.Top){
			this._OffsetPosition.Top = oPosition.Top;
		}
		if(oPosition.Bottom > this._OffsetPosition.Bottom){
			this._OffsetPosition.Bottom = oPosition.Bottom;
		}
	},

	PreDraw : function(){
		var viewNodes = this._ViewNodes;
		for(var p in viewNodes){
			this._PreDrawViewNode(viewNodes[p]);
			this.RefreshExpander(viewNodes[p]);
		}
		// Calculate BaseX,BaseY
		this._PositionL0();
	},

	// Root Level
	_PositionL0 : function(){
		var oViewNode = this.RootViewNode;
		oViewNode.BaseX = 0;
		oViewNode.BaseY = 0;
		var position = oViewNode.CalculatePosition();
		this.CalculateOffsetSize(position);
		
		var children = oViewNode.Children;
		var childCount = (!!children)?children.length:0;
		var viewNode = null;
		if(!this.HalfSide){
			var leftChildren = [];
			var rightChildren = [];
			var leftHeight = oViewNode.GetSpaceHeightRoot(_ViewDirect.Left);
			var rightHeight = oViewNode.GetSpaceHeightRoot(_ViewDirect.Right);
			while(childCount--){
				viewNode = children[childCount];
				if(viewNode.Direct == _ViewDirect.Left){
					leftChildren.push(viewNode);
				}else{
					rightChildren.unshift(viewNode);
				}
			}
			this._PositionLN(leftChildren,-leftHeight/2);
			this._PositionLN(rightChildren,-rightHeight/2);
		}else{
			var allHeight = oViewNode.GetSpaceHeight();
			this._PositionLN(children,-allHeight/2);
		}
	},

	// Second (Or Lower) Level
	_PositionLN : function(oViewNodes,iOffsetHeight){
		var len = oViewNodes.length;
		var p = iOffsetHeight;
		var viewNode = null;
		var viewNodeHeight = 0;
		var viewNodeHalfHeight = 0;
		
		for(var i=0;i<len;i++){
			viewNode = oViewNodes[i];
			if(!viewNode.__Visible){continue;}

			viewNodeHeight = viewNode.GetSpaceHeight();
			viewNodeHalfHeight = viewNodeHeight/2;
			viewNode.BaseY = p+viewNodeHalfHeight;
			p += viewNodeHeight + _ViewNodeSpaceV;
			viewNode.BaseX = (1 - viewNode.Direct) * viewNode.Parent.Position.Left / 2 + (1+viewNode.Direct) * viewNode.Parent.Position.Right / 2 + viewNode.Direct * ( _ViewNodeSpaceH + _ViewNodeExpanderSize);

			var position = viewNode.CalculatePosition();
			this.CalculateOffsetSize(position);
			
			var children = viewNode.Children;
			var childlen = children==null?0:children.length;
			var children_v = [];
			var child = null;
			while(childlen--){
				child = children[childlen];
				if(child.__Visible){
					children_v.unshift(child);	
				}
			}
			this._PositionLN(children_v,viewNode.BaseY-viewNodeHalfHeight);
		}
	},

	_PreDrawViewNode : function(oViewNode){
		if(oViewNode.__Visible){
			if(oViewNode.Element){
				this._SetVisible(oViewNode,true,true);
			}else{
				var element = this.CreateNodeElement(oViewNode.Node);
				var expander = this.CreateExpander(oViewNode.Node);
				oViewNode.Element = element;
				oViewNode.Expander = expander;
				oViewNode.Size = new _Size(element.offsetWidth,element.offsetHeight);
			}
		}else{
			if(oViewNode.Element){
				this._SetVisible(oViewNode,false,true);
			}
		}
	},

	_SetVisible : function(oViewNode,bVisible,bRecursion){
		//oViewNode.__Visible = bVisible;
		if(bVisible){
			var bVisible = oViewNode.__Visible;
			oViewNode.Element.style.display = bVisible?'block':'none';
			oViewNode.Expander.style.display = bVisible?'block':'none';
		}else{
			oViewNode.Element.style.display = 'none';
			oViewNode.Expander.style.display = 'none';
		}
		if(!bRecursion){return;}

		var children = oViewNode.Children;
		var len = children == null ? 0 : children.length;
		while(len--){
			this._SetVisible(children[len],bVisible,bRecursion);
		}
	},

	Draw : function(){
		//this._Panel.style.display = 'none';
		var offsetWidth = this._OffsetWidth/2;
		var offsetHeight = this._OffsetHeight/2;
		if(this.HalfSide){
			offsetWidth = this._OffsetWidth/4;
		}
		var viewNodes = this._ViewNodes;
		for(var p in viewNodes){
			this.ShowViewNode(viewNodes[p],offsetWidth,offsetHeight);
		}
		//this._Panel.style.display = 'block';
	},

	CreateNodeElement : function(oNode){
		var d = $c('jmnode');
		if(!oNode.Parent){
			d.className = 'root';
		}
		//d.className = (oNode.Parent)?'':'root';
		$t(d,oNode.Topic);
		//d.innerHTML=oNode.Topic;
		d.setAttribute('nodeid',oNode.Id);
		d.style.visibility='hidden';
		this._Panel.appendChild(d);
		return d;
	},

	CreateExpander : function(oNode){
		var d = $c('jmexpander');
		$t(d,'-');
		d.setAttribute('nodeid',oNode.Id);
		this._Panel.appendChild(d);
		return d;
	},

	RefreshExpander : function(oViewNode){
		if(oViewNode.IsNotRoot() && oViewNode.HasChildren()){
			this.ShowExpander(oViewNode);
		}else{
			this.HideExpander(oViewNode);
		}
	},

	ShowExpander : function(oViewNode){
		oViewNode.Expander.style.visibility='visible';
	},

	HideExpander : function(oViewNode){
		oViewNode.Expander.style.visibility='hidden';
	},

	RemoveNodeElement : function(oViewNode){
		var children = oViewNode.Children;
		var len = (!!children)?children.length:0;
		while(len--){
			this.RemoveNodeElement(children[len]);
		}
		var ele = oViewNode.Element;
		if(ele){
			this._Panel.removeChild(ele);
			ele = null;
			oViewNode.Element = null;
		}
	},

	ShowViewNode : function(oViewNode,iOffsetWidth,iOffsetHeight){
		if(oViewNode.__Visible){
			var o = oViewNode.GetNWPosition(iOffsetWidth,iOffsetHeight);
			oViewNode.Element.style.left = o.Left+'px';
			oViewNode.Element.style.top = o.Top+'px';
			oViewNode.Element.style.visibility='visible';
			var eo = oViewNode.GetExpanderPosition(iOffsetWidth,iOffsetHeight);
			oViewNode.Expander.style.left = eo.Left+'px';
			oViewNode.Expander.style.top = eo.Top+'px';
		}
	},

	ClearLine : function(){
		var ctx = this.GetCanvasCtx();
		ctx.clearRect(0,0,this._OffsetWidth,this._OffsetHeight);
	},

	DrawLine : function(){
		var offsetWidth = this._OffsetWidth/2;
		var offsetHeight = this._OffsetHeight/2;
		var ctx = this.GetCanvasCtx();
		var viewNodes = this._ViewNodes;
		var viewNode = null;
		var child = null;

		for(var p in viewNodes){
			viewNode = viewNodes[p];
			if(!viewNode.__Visible){
				continue;
			}
			var children = viewNode.Children;
			var childCount = (!!children)?children.length:0;
			while(childCount--){
				child = children[childCount];
				if(!child.__Visible){
					continue;
				}
				this.DrawSingleLine(ctx,
					viewNode.GetOutPosition(offsetWidth,offsetHeight),
					child.GetInPosition(offsetWidth,offsetHeight));
			}
		}
	},
	
	DrawSingleLine : function(oCanvasCtx,oPosition1,oPosition2){
		ztLineTo(oCanvasCtx,oPosition1.Left,oPosition1.Top,oPosition2.Left,oPosition2.Top);
	},
	
	ClearSelectedNode : function(){
		this._SelectedViewNode = null;
	},
	
	SetSelectedNode : function(sNodeId){
		var oNode = this.FindNode(sNodeId);
		this._SelectedViewNode = oNode.View;
	},
	
	GetSelectedNode : function(){
		return this._SelectedViewNode;
	},
	
	onNodeEnter : function(e){
		var t = e.target || event.srcElement;
		if(t.tagName.toLowerCase() != 'jmnode'){return;}
		
		if(typeof(this._Event.NodeEnter) == 'function'){
			this._Event.NodeEnter(t,this);
		}
	},
	
	onNodeLeave : function(e){
		var t = e.target || event.srcElement;
		if(t.tagName.toLowerCase() != 'jmnode'){return;}
		if(typeof(this._Event.NodeLeave) == 'function'){
			this._Event.NodeLeave(t,this);
		}
	},
	
	onNodeClick : function(e){
		var t = e.target || event.srcElement;
		var selectedNode = this.GetSelectedNode();
		var sne = selectedNode?selectedNode.Element:null;
		var tagName = t.tagName.toLowerCase();
		if(tagName == 'jmnodes'){
			if(sne){
				sne.className = sne.className.replace(/\s*selected\s*/i,'');
				this.ClearSelectedNode();
			}
		}else if(tagName == 'jmnode'){
			var c = t.className;
			var id = t.getAttribute('nodeid');
			if(selectedNode){
				if(selectedNode.Node.Id != id){
					sne.className = sne.className.replace(/\s*selected\s*/i,'');
					this.SetSelectedNode(id);
					t.className = c + ' selected';
				}
			}else{
				this.SetSelectedNode(id);
				t.className = c + ' selected';
			}
		}else if(tagName == 'jmexpander'){
			var id = t.getAttribute('nodeid');
			var isExpand = ('0' != t.getAttribute('expand'));
			if(isExpand){
				this.Collapse(id);
				t.setAttribute('expand','0');
				$t(t,'+');
			}else{
				this.Expand(id);
				t.setAttribute('expand','1');
				$t(t,'-');
			}
		}
		
		if(typeof(this._Event.NodeClick) == 'function'){
			this._Event.NodeClick(t,this);
		}
	},
	
	ResizeMindPanel : function(){
		this.Width = this.Target.clientWidth;
		this.Height = this.Target.clientHeight;
		this.ReDraw(false);
	}
};

// Return
return {
	Node:_Node,
	View:{
		Direct: _ViewDirect,
		Engine:	_ViewEngine
	},
	Util:{
		AddEvent: $add_event,
		RemoveEvent: $remove_event
	}
};
})(window);



(function($w,jm){
	if(jm.ajax){return;}
	function genXHR(){
		var xhr = null;
		if(window.XMLHttpRequest){
			xhr = new XMLHttpRequest();
		}else{
			try{
				xhr = new ActiveXObject("Microsoft.XMLHTTP");
			}catch(e){}
		}
		return xhr;
	}

	jm.ajax = {
		_encURL:function(url){
			return encodeURIComponent(url);
		},
		ajax:function(url,param,method,callback){
			var p = null;
			var tmp_param = [];
			for(k in param){
				tmp_param.push(this._encURL(k)+'='+this._encURL(param[k]));
			}
			if(tmp_param.length>0){
				p = tmp_param.join('&');
			}
			var xhr = genXHR();
			if(xhr == null){return;}
			xhr.onreadystatechange = function(){
				if(xhr.readyState == 4){
					if(xhr.status == 200 || xhr.status == 0){
						if(typeof(callback) == 'function'){
							var data = eval('('+xhr.responseText+')');
							callback(data);
						}
					}else{
						var w = window.open('');
						w.document.write(xhr.responseText);
						//alert(xhr.responseText);
					}
				}
			}
			method = method || 'GET';
			xhr.open(method,url,true);
			if(method == 'POST'){
				xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded;charset=utf-8');
			}
			xhr.setRequestHeader('If-Modified-Since','0');
			xhr.send(p);
		},
		request:function(url,param,callback){
			this.ajax(url,param,'POST',callback);
		}
	};

})(window,jsMind);

(function(jm){
	if(jm.logger){return;}
	if(typeof(console) != 'undefined'){
		jm.logger = {
			log : function(){console.log(arguments);},
			info : function(){console.info(arguments);},
			warn : function(){console.warn(arguments);},
			error : function(){console.error(arguments);}
		};
	}else{
		jm.logger = {
			log : function(){},
			info : function(){},
			warn : function(){},
			error : function(){}
		};
	}
})(jsMind);


