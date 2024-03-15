package com.lorepo.icplayer.client.xml.module.parsers;

import java.util.HashMap;

import com.google.gwt.xml.client.Element;
import com.lorepo.icplayer.client.dimensions.ModuleDimensions;
import com.lorepo.icplayer.client.metadata.IMetadata;
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
	public void setIsLocked(String name, boolean isLocked);
	public void setIsVisibleInEditor(String name, boolean isVisibleInEditor);
	public void setModuleInEditorVisibility(boolean moduleInEditorVisibility);
	public void setRelativeLayout(String id, LayoutDefinition relativeLayout);
	public void setInlineStyles(HashMap<String, String> inlineStyles);
	public void setStylesClasses(HashMap<String, String> styleClasses);
	public void setDefaultStyleClass(String styleClass);
	public void setDefaultInlineStyle(String inlineStyle);
	public void setIsTabindexEnabled(boolean value);
	public void setOmitInKeyboardNavigation(boolean value);
	public boolean shouldOmitInTTS();
	public void setOmitInTTS(boolean value);
	public void setMetadata(IMetadata metadata);
	public void setTTSTitle(String title);
}
