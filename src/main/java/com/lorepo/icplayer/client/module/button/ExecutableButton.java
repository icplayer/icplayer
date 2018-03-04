package com.lorepo.icplayer.client.module.button;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.ui.PushButton;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.utils.DevicesUtils;

public abstract class ExecutableButton extends PushButton {
	protected IPlayerServices playerServices;
	private long hoverTimeout = -1;
	
	public ExecutableButton(IPlayerServices playerServices) {
		this.playerServices = playerServices;
		
		addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				if (checkIsClick()) {
					event.stopPropagation();
					event.preventDefault();
					
					execute();
				}
			}
		});
		
	}
	
	private boolean checkIsClick () {
		if (this.hoverTimeout > -1) {
			long currentTime = System.currentTimeMillis();
			if (currentTime - this.hoverTimeout < 200) {
				this.hoverTimeout = -1;
				return false;
			}
		}
		
		return true;
	}
	
	public abstract void execute();
	
	@Override
	public void addStyleDependentName(String styleSuffix) {
		if(!DevicesUtils.isSafariMobile()) {
			super.addStyleDependentName(styleSuffix);
		} else {
			if (styleSuffix.indexOf("up-hovering") > -1) {
				this.hoverTimeout = System.currentTimeMillis();
				this.execute();
			}
		}
	}
	
}
