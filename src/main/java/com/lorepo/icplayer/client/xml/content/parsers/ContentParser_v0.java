package com.lorepo.icplayer.client.xml.content.parsers;

import com.google.gwt.xml.client.Element;
import com.lorepo.icplayer.client.xml.content.IContentBuilder;

public class ContentParser_v0 extends ContentParserBase {
	
	public ContentParser_v0() {
		this.version = "1";
	}
	
	@Override
	public Object parse(Element xml) {
		Object parsedContent = super.parse(xml);

		IContentBuilder content = (IContentBuilder) parsedContent;
		
		return this.parseLayouts(content, null);
	}
}
