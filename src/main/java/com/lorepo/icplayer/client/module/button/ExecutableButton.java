package com.lorepo.icplayer.client.module.button;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.ui.PushButton;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.utils.DevicesUtils;

public abstract class ExecutableButton extends PushButton {
	protected IPlayerServices playerServices;
	private String originalDisplay = "placeholder-value";
	
	public ExecutableButton(IPlayerServices playerServices) {
		this.playerServices = playerServices;

		addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
                event.stopPropagation();
                event.preventDefault();
                execute();
			}
		});

	}

	public abstract void execute();

	@Override
	public void setVisible(boolean visible) {
		if (originalDisplay.equals("placeholder-value")) {
			originalDisplay = getElement().getStyle().getDisplay();
		}
		if (visible) {
			super.setVisible(true);
			getElement().getStyle().setProperty("display", originalDisplay);	
		} else {
			super.setVisible(false);
		}
	}
	
}
