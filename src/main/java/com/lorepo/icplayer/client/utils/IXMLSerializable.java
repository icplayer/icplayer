package com.lorepo.icplayer.client.utils;

import com.google.gwt.xml.client.Element;

public interface IXMLSerializable {

	public void load(Element rootElement, String url);
	public String toXML();
}
