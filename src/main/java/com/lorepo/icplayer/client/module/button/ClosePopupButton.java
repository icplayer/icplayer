package com.lorepo.icplayer.client.module.button;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.ui.PushButton;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;

class ClosePopupButton extends PushButton{

	public ClosePopupButton(final IPlayerCommands pageService){
		
		setStyleName("ic_button_cancel");
		setTitle(DictionaryWrapper.get("close_popup_button"));

		addClickHandler(new ClickHandler() {
			
			@Override
			public void onClick(ClickEvent event) {
				event.stopPropagation();
				event.preventDefault();
				pageService.closePopup();
			}
		});
		
	}
}
