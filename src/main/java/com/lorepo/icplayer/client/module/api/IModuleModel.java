package com.lorepo.icplayer.client.module.api;


import com.google.gwt.xml.client.Element;
import com.lorepo.icf.properties.IPropertyProvider;
import com.lorepo.icplayer.client.framework.module.IStyledModule;
import com.lorepo.icplayer.client.metadata.IMetadata;
import com.lorepo.icplayer.client.semi.responsive.SemiResponsiveStyles;

public interface IModuleModel extends IStyledModule, IRectangleItem, IPropertyProvider, SemiResponsiveLayouts {
	public String getModuleTypeName(); // get module type
	public String getModuleName(); // get translated module name
	public String getId();
	public String getButtonType();
	public IMetadata getMetadata();
	public void setId(String id);
	public void release();
	public String toXML();
	public void addNameValidator(INameValidator validator);
	public boolean isLocked();
	public void lock(boolean state);
	public boolean isModuleInEditorVisible();
	public void setModuleInEditorVisibility(boolean moduleInEditorVisibility);
	public void load(Element node, String baseURL, String version);
    public boolean isTabindexEnabled();
	public void setIsTabindexEnabled(boolean value);
	public boolean shouldOmitInKeyboardNavigation();
	public void setOmitInKeyboardNavigation(boolean value);
	public boolean shouldOmitInTTS();
	public void setOmitInTTS(boolean value);
	public void setContentDefaultLayoutID(String layoutID);
	public void setIsVisible(Boolean isVisible);
	public SemiResponsiveStyles getSemiResponsiveStyles();
	public boolean isVisible();
	public String getTTSTitle();
	public void setTTSTitle(String title);
	public void setContentBaseURL(String baseURL);
}
