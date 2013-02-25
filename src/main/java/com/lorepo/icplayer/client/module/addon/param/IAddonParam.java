package com.lorepo.icplayer.client.module.addon.param;

import com.google.gwt.xml.client.Element;
import com.lorepo.icf.properties.IProperty;

public interface IAddonParam {

	void load(Element element);
	IProperty getAsProperty();
	String toXML();
	void setName(String name);
	String getName();
	IAddonParam makeCopy();
}
