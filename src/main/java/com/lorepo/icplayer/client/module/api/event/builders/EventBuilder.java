package com.lorepo.icplayer.client.module.api.event.builders;

public abstract class EventBuilder<T> {
	protected String pageID;
	protected String moduleType;
	protected String moduleID;
	protected String itemID;
	protected String value;
	protected String score;
	protected String definition;
	protected String pageName;
	protected String pageAdaptiveStep;
	protected abstract T getThis();
	
	public EventBuilder() { 
		this.pageID = "";
		this.moduleType = "";
		this.moduleID = "";
		this.itemID = "";
		this.value = "";
		this.score = "";
		this.definition = "";
		this.pageName = "";
		this.pageAdaptiveStep = "";
	}
	
	public T setPageId(String pageId) {
		this.pageID = pageId;
		return getThis();
	}
	
	public T setModuleType(String moduleType) {
		this.moduleType = moduleType;
		return getThis();
	}
	
	public T setModuleId(String moduleId) {
		this.moduleID = moduleId;
		return getThis();
	}
	
	public T setItemId(String itemId) {
		this.itemID = itemId;
		return getThis();
	}
	
	public T setValue(String value) {
		this.value = value;
		return getThis();
	}
	
	public T setScore(String score) {
		this.score = score;
		return getThis();
	}
	
	public T setDefinition(String definition) {
		this.definition = definition;
		return getThis();
	}
	
	public T setPageName(String pageName) {
		this.pageName = pageName;
		return getThis();
	}
	
	public T setPageAdaptiveStep(String pageAdaptiveStep) {
		this.pageAdaptiveStep = pageAdaptiveStep;
		return getThis();
	}

}
