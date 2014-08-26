//namespace
window.ydpjs_1_0_0_0 = window.ydpjs_1_0_0_0||{};

(function(wnd){

	var Slider = function(sliderClip){
		this._initialize(sliderClip);
	}

	var p = Slider.prototype;

	p._clip = null;

	p._thumbBtn = null;

	p._track = null;

	p._height = null;

	p._value = null;

	p.onChange = null;

	p.getValue = function(){
		return this._value;
	}

	p._initialize = function(sliderClip){
		this._thumbBtn = new ydpjs_1_0_0_0.ButtonDecorator(sliderClip.thumbClip);
		this._thumbBtn.onPress = ydpjs_1_0_0_0.Delegate.create(this, this._onThumbPress);

		this._track = sliderClip.trackClip;
		this._height = this._track.y * 2;
		this._thumbBtn.setY(this._track.y - this._height/2);

		this._updateValue();
		this._clip = sliderClip;
	}

	p._onThumbPress = function(event){
		/* console.log("press: " + event.target); */
		event.onMouseMove = ydpjs_1_0_0_0.Delegate.create(this, this._onThumbMove);
	}

	p._onThumbMove = function(event){
		var mousePosition = this._clip.globalToLocal(event.stageX, event.stageY);
		var thumbPosition = Math.max(0, Math.min(mousePosition.y, this._height));

		this._thumbBtn.setY(thumbPosition);
		this._updateValue();
	}

	p._updateValue = function(){
		var newValue = this._thumbBtn.getY()/this._height;

		if(this.onChange != null && newValue != this._value){
			this._value = newValue;
			this.onChange({target:this});
		}

	}

	wnd.ydpjs_1_0_0_0.Slider = Slider;

}(window));