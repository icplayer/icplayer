package com.lorepo.icplayer.client.module.button;

import com.lorepo.icplayer.client.module.api.event.ValueChangedEvent;
import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;

class ClosePopupButton extends ExecutableButton {
	private IPlayerCommands pageService = null;
	private ButtonModule module = null;
	
	public ClosePopupButton(final IPlayerCommands pageService, IPlayerServices services, final ButtonModule module){
		super(services);
		setStyleName("ic_button_cancel");
		
		this.pageService = pageService;
		this.module = module;		
	}

	@Override
	public void execute() {
		pageService.closePopup();
		ValueChangedEvent valueEvent = new ValueChangedEvent(module.getId(), "", "clicked", "");
		playerServices.getEventBus().fireEvent(valueEvent);
	}
}
