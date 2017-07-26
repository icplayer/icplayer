package com.lorepo.icplayer.client.module.button;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.ui.PushButton;

public class PushButtonIOSStatesButton extends PushButton{
	
	private int timerID = 0;
	private int classStage = 0;
	
	public PushButtonIOSStatesButton () {
		final PushButtonIOSStatesButton button = this;
		
		addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				if (isiOS()) {
					onClickIOSClass(button, getElement());
				}
			}
		});
	}
	
	public static native boolean isiOS() /*-{
	  return /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
	}-*/;
	
	private native void onClickIOSClass (PushButtonIOSStatesButton x, JavaScriptObject domElement) /*-{
		var POSTFIX_CLASS_LIST = ["-up", "-up-hovering", "-down-hovering", "-up"];
		var classes = [];
		
		function actualizeClassNames () {
			var className = x.@com.lorepo.icplayer.client.module.button.PushButtonIOSStatesButton::getStyleName()().split(" ")[0];
			classes = [];
			
			for (var i = 0; i < POSTFIX_CLASS_LIST.length; i++) {
				classes.push(className + POSTFIX_CLASS_LIST[i]);
			}
			
		}
		
		actualizeClassNames();
		
		var element = $wnd.$(domElement);
		
		var timer = x.@com.lorepo.icplayer.client.module.button.PushButtonIOSStatesButton::timerID;
		if (timer !== 0) {
			clearTimeout(timer);
		}
		
		x.@com.lorepo.icplayer.client.module.button.PushButtonIOSStatesButton::classStage = 0;
		
		function changeElementStyleToStage(stage) {
			element.removeClass(classes.join(" "));
			actualizeClassNames();
			element.removeClass(classes.join(" "));
			
			element.addClass(classes[stage]);			
		}
		
		function timerCallback () {
			var stage = parseInt(x.@com.lorepo.icplayer.client.module.button.PushButtonIOSStatesButton::classStage, 10);
			changeElementStyleToStage(stage + 1);
			x.@com.lorepo.icplayer.client.module.button.PushButtonIOSStatesButton::classStage = stage + 1;
			if (stage < 2) {
				x.@com.lorepo.icplayer.client.module.button.PushButtonIOSStatesButton::timerID = setTimeout(timerCallback, 200);
			}
		}
		
		changeElementStyleToStage(0);
		x.@com.lorepo.icplayer.client.module.button.PushButtonIOSStatesButton::timerID = setTimeout(timerCallback, 200);
	}-*/;

}
