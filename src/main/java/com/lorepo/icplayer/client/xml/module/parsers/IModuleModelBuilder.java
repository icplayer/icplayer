package com.lorepo.icplayer.client.xml.module.parsers;

import java.util.HashMap;

import com.google.gwt.xml.client.Element;

public interface IModuleModelBuilder {
	public void setBaseUrl(String baseUrl);
	public void setID(String id);
	public void setIsVisible(Boolean isVisible);
	public void setIsLocked(Boolean isLocked);
	public void setIsModuleVisibleInEditor(Boolean isVisibleInEditor);
	public void setInlineStyle(String css);
	public void setStyleClass(String classString);
	public void setPosition(String name, HashMap<String, Integer> position);
	public void setButtonType(String buttonType);
	public void loadLayout(Element xml);
	public void setIsVisible(String name, boolean isVisible);
	public void setIsLocked(String name, boolean isLocked);
	public void setIsVisibleInEditor(String name, boolean isVisibleInEditor);
}
