package com.lorepo.icplayer.client.module.api.event.builders;

import com.lorepo.icplayer.client.module.api.event.ValueChangedEvent;

public class ValueChangedBuilder extends EventBuilder<ValueChangedBuilder> {
	public ValueChangedBuilder(String moduleID, String itemID, String value, String score) {
		this.moduleID = moduleID;
		this.itemID = itemID;
		this.value = value;
		this.score = score;
	}
	
	@Override
	protected ValueChangedBuilder getThis() {
		return this;
	}
	
	public ValueChangedEvent build() {
		ValueChangedEvent event = new ValueChangedEvent(this.moduleID, this.itemID, this.value, this.score);
		event.setModuleType(moduleType);
		event.setPageAdaptiveStep(pageAdaptiveStep);
		event.setPageID(pageID);
		
		return event;
	}
}
