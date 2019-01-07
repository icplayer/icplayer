package com.lorepo.icplayer.client.xml.content.parsers;

import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.xml.content.IContentBuilder;
import com.google.gwt.xml.client.Element;

public class ContentParser_v2 extends ContentParser_v1 {
	
	public ContentParser_v2() {
		this.version = "3";
	}
	
	@Override
	protected String parseAdaptiveStructure(Element child) {
		String structure = XMLUtils.getCDATA(child);

		return structure;
	}
}
