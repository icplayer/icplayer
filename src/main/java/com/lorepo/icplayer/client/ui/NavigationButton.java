package com.lorepo.icplayer.client.ui;

import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Event;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.PopupPanel;
import com.lorepo.icf.utils.JavaScriptUtils;

public class NavigationButton extends PopupPanel{

	public NavigationButton(String styleName) {
		super(true);
		setStyleName(styleName);
		setWidget(new Label(""));
		DOM.sinkEvents(this.getElement(), Event.ONCLICK);
	}

	@Override
	public void onBrowserEvent(Event event) {

		final int eventType = DOM.eventGetType(event);
		event.preventDefault();
		event.stopPropagation();

		if (Event.ONCLICK == eventType) {
			JavaScriptUtils.log("clicked");
		}
	}
}
