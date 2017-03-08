package com.lorepo.icplayer.client.xml.module.parsers;

import com.google.gwt.xml.client.Element;
import com.lorepo.icplayer.client.dimensions.ModuleDimensions;
import com.lorepo.icplayer.client.module.LayoutDefinition;

public interface IModuleModelBuilder {
	public void setBaseUrl(String baseUrl);
	public void setID(String id);
	public void setIsVisible(Boolean isVisible);
	public void setIsLocked(Boolean isLocked);
	public void setInlineStyle(String css);
	public void setStyleClass(String classString);
	public void addSemiResponsiveDimensions(String name, ModuleDimensions dimensions);
	public void setButtonType(String buttonType);
	public void loadLayout(Element xml);
	public void setIsVisible(String name, boolean isVisible);
	public void setIsLocked(String name, boolean isLocked);
	public void setIsVisibleInEditor(String name, boolean isVisibleInEditor);
	public void setModuleInEditorVisibility(boolean moduleInEditorVisibility);
	public void setRelativeLayout(String id, LayoutDefinition relativeLayout);
}
