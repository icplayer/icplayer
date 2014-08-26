//namespace
window.ydpjs_1_0_0_0 = window.ydpjs_1_0_0_0||{};

(function(wnd){
	
	var ButtonDecorator = function(buttonClip){
		this._initialize(buttonClip);
	}
	
	var p = ButtonDecorator.prototype;
	
	p.onClick = null;
	
	p.onPress = null;
	
	p._clip = null;
	
	p.setY = function(value){
		this._clip.y = value;
	}
	
	p.getY = function(){
		return this._clip.y;
	}
	
	p._initialize = function(buttonClip){
		if(buttonClip != undefined){
			buttonClip.gotoAndStop(0);
			buttonClip.onMouseOver = ydpjs_1_0_0_0.Delegate.create(this, this._onButtonMouseOver);
			buttonClip.onMouseOut = ydpjs_1_0_0_0.Delegate.create(this, this._onButtonMouseOut);
			buttonClip.onClick = ydpjs_1_0_0_0.Delegate.create(this, this._onButtonClick);
			buttonClip.onPress = ydpjs_1_0_0_0.Delegate.create(this, this._onButtonPress);
			
			this._clip = buttonClip;
		}
	}
	
	p._onButtonMouseOver = function(event){
		event.target.gotoAndStop(1);
	}
	
	p._onButtonMouseOut = function(event){
		event.target.gotoAndStop(0);
	}
	
	p._onButtonPress = function(event){
		if(this.onPress != null){
			event.target = this;
			this.onPress(event);
		}
	}
	
	p._onButtonClick = function(event){
		if(this.onClick != null){
			event.target = this;
			this.onClick(event);
		}
	}
	
	p.toString = function(){
		return "[ButtonDecorator]";
	}
	
	wnd.ydpjs_1_0_0_0.ButtonDecorator = ButtonDecorator;
	
}(window));