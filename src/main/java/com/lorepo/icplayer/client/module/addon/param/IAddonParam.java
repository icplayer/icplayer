package com.lorepo.icplayer.client.module.addon.param;

import com.google.gwt.xml.client.Element;
import com.lorepo.icf.properties.IProperty;

public interface IAddonParam {

	void load(Element element, String baseURL);
	IProperty getAsProperty();
	Element toXML();
	void setName(String name);
	String getName();
	void setDisplayName(String displayName);
	String getDisplayName();
	IAddonParam makeCopy();
	boolean isDefault();
	void setDefault(boolean isDefault);
}
