package com.lorepo.icplayer.client.module.button;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.ui.PushButton;

public class PushButtonIOSStatesButton extends PushButton{
	
	private int timerID = 0;
	private int classStage = 0;
	
	public PushButtonIOSStatesButton () {
		if (isiOS()) {
			this.setListenerForChangingStyles(this, this.getElement());
		}
	}
	
	public static native boolean isiOS() /*-{
	  return /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
	}-*/;
	
	private native void setListenerForChangingStyles (PushButtonIOSStatesButton x, JavaScriptObject buttonElement) /*-{
		var $element = $wnd.$(buttonElement);
		var buttonClassName = x.@com.lorepo.icplayer.client.module.button.PushButtonIOSStatesButton::getStyleName()().split(" ")[0];
		var POST_FIX_CLASS_LIST = ["-up-hovering", "-down-hovering"];
		var mutationObserver = new MutationObserver(function (mutations) {
			for (var i = 0; i < POST_FIX_CLASS_LIST.length; i++) {
				var elementClassList = buttonElement.classList;
				var className = buttonClassName + POST_FIX_CLASS_LIST[i];
				
				for (var j = 0; j < elementClassList.length; j++) {
					if (elementClassList[j].indexOf(POST_FIX_CLASS_LIST[i]) >= 0) {
						console.log("Removing class: ", elementClassList[j]);
						$element.removeClass(elementClassList[j]);
					}
				}
			}
		});
		
		mutationObserver.observe(buttonElement, {
			attributes: true
		});
	}-*/;

}
