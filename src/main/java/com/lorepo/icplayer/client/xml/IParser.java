package com.lorepo.icplayer.client.xml;

import com.google.gwt.xml.client.Element;

public interface IParser {
	public String getVersion();

	public Object parse(Element xml);
}
