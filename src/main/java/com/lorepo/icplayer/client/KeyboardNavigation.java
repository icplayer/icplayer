package com.lorepo.icplayer.client;

import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.event.dom.client.KeyDownHandler;
import com.google.gwt.user.client.ui.RootPanel;
import com.lorepo.icplayer.client.module.api.IModuleView;

public class KeyboardNavigation {
	public void KeyboardNavigation(IModuleView modukeView) {
		RootPanel.get().addDomHandler(new KeyDownHandler() {
			
	        @Override
	        public void onKeyDown(KeyDownEvent event) {

	            if (event.getNativeKeyCode() == KeyCodes.KEY_ENTER) {
	            	event.preventDefault();
	            	modukeView.onEnterKey();
	            }
	            
	            if (event.getNativeKeyCode() == KeyCodes.KEY_ESCAPE) {
	            	event.preventDefault();
	            	modukeView.onEscapeKey();
	            }
	        }
	    }, KeyDownEvent.getType());
	}
}
