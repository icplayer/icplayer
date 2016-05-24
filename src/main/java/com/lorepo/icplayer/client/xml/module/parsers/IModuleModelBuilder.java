package com.lorepo.icplayer.client.xml.module.parsers;

public interface IModuleModelBuilder {
	public void setBaseUrl(String baseUrl);
	public void setID(String id);
	public void setIsVisible(Boolean isVisible);
	public void setIsLocked(Boolean isLocked);
	public void setIsModuleVisibleInEditor(Boolean isVisibleInEditor);
	public void setInlineStyle(String css);
	public void setStyleClass(String classString);
	
}
