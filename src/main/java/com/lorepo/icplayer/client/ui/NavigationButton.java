package com.lorepo.icplayer.client.ui;

import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Event;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.PopupPanel;

public class NavigationButton extends PopupPanel{

	private ClickHandler clickHandler = null;
	
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

		if (Event.ONCLICK == eventType && clickHandler != null) {
			clickHandler.onClick(null);
		}
	}
	
	public void addClickHandler(ClickHandler handler){ 
		this.clickHandler = handler;
	}
}
