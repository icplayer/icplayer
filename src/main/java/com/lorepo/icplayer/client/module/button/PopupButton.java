package com.lorepo.icplayer.client.module.button;

import com.google.gwt.event.dom.client.MouseOverEvent;
import com.google.gwt.event.dom.client.MouseOverHandler;
import com.lorepo.icplayer.client.module.api.event.ValueChangedEvent;
import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.button.ButtonPresenter.IDisplay;

class PopupButton extends ExecutableButton {
	IPlayerCommands pageService = null;
	String popupName = null, top = null, left = null, additionalClasses = null;
	ButtonModule module = null;
	IDisplay view = null;
	
	public PopupButton(final String popupName, final IDisplay view, final IPlayerCommands pageService, final String top, final String left, final String additionalClasses, IPlayerServices services, final ButtonModule module){
		super(services);
		
		this.pageService = pageService;
		this.view = view;
		this.module = module;
		this.top = top;
		this.left = left;
		this.additionalClasses = additionalClasses;
		this.popupName = popupName;
		
		setStyleName("ic_button_popup");
		
		addMouseOverHandler(new MouseOverHandler() {
			
			@Override
			public void onMouseOver(MouseOverEvent event) {
				String classNames = getElement().getClassName();
				if(!classNames.contains("hovering")) {
					classNames = classNames.replaceAll("-up", "-up-hovering");
					getElement().setClassName(classNames);
				}
			}
		});
		
	}
	
	@Override
	public void execute() {
		if (!view.isErrorCheckingMode()) {
			pageService.showPopup(popupName, top, left, additionalClasses);
			ValueChangedEvent valueEvent = new ValueChangedEvent(module.getId(), "", "clicked", "");
			playerServices.getEventBus().fireEvent(valueEvent);
		}
		
	}
}
