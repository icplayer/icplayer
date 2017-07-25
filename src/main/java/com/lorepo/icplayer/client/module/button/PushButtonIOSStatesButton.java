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
				//if (isiOS()) {
					onClickIOSClass(button, getElement());
				//}
			}
		});
	}
	
	public static native boolean isiOS() /*-{
	  return /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
	}-*/;
	
	private native void onClickIOSClass (PushButtonIOSStatesButton x, JavaScriptObject domElement) /*-{
		var CLASS_LIST = ["ic_button_reset-up", "ic_button_reset-up-hovering", "ic_button_reset-down-hovering", "ic_button_reset-down"];
		var element = $wnd.$(domElement);
		
		var timer = x.@com.lorepo.icplayer.client.module.button.PushButtonIOSStatesButton::timerID;
		if (timer !== 0) {
			clearTimeout(timer);
		}
		
		x.@com.lorepo.icplayer.client.module.button.PushButtonIOSStatesButton::classStage = 0;
		
		function changeElementStyleToStage(stage) {
			element.removeClass(CLASS_LIST.join(" "));
			element.addClass(CLASS_LIST[stage]);
		}
		
		function timerCallback () {
			var stage = parseInt(x.@com.lorepo.icplayer.client.module.button.PushButtonIOSStatesButton::classStage, 10);
			changeElementStyleToStage(stage + 1);
			console.log("Stage", stage + 1);
			x.@com.lorepo.icplayer.client.module.button.PushButtonIOSStatesButton::classStage = stage + 1;
			if (stage < 2) {
				x.@com.lorepo.icplayer.client.module.button.PushButtonIOSStatesButton::timerID = setTimeout(timerCallback, 200);
			}
		}
		
		changeElementStyleToStage(0);
		x.@com.lorepo.icplayer.client.module.button.PushButtonIOSStatesButton::timerID = setTimeout(timerCallback, 200);
	}-*/;

}
