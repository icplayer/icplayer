package com.lorepo.icplayer.client.xml;

import com.google.gwt.xml.client.Element;
import com.lorepo.icplayer.client.model.Content;

public class ContentParserZero implements IContentParser{
	
	@Override
	public Content parse(Element rootNode) {
		Content content = new Content();
		
		return content;
	}
}
