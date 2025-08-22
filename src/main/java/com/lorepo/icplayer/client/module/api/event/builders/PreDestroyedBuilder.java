package com.lorepo.icplayer.client.module.api.event.builders;

import com.lorepo.icplayer.client.module.api.event.PreDestroyedEvent;

public class PreDestroyedBuilder extends EventBuilder<PreDestroyedBuilder> {
	public PreDestroyedBuilder(String moduleID, String itemID, String value) {
		this.moduleID = moduleID;
		this.itemID = itemID;
		this.value = value;
	}
	
	@Override
	protected PreDestroyedBuilder getThis() {
		return this;
	}
	
	public PreDestroyedEvent build() {
		PreDestroyedEvent event = new PreDestroyedEvent(this.moduleID, this.itemID, this.value);

		event.setModuleType(moduleType);
		event.setPageID(pageID);
		
		return event;
	}
}
