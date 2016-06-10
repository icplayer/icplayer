package com.lorepo.icplayer.client.xml.content.parsers;

import java.util.HashMap;

import com.google.gwt.xml.client.Element;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.model.layout.PageLayout;
import com.lorepo.icplayer.client.xml.content.IContentBuilder;

public class ContentParser_v0 extends ContentParserBase{
	
	public ContentParser_v0() {
		this.version = "1";
	}
	
	@Override
	public Object parse(Element xml) {
		Object parsedContent = super.parse(xml);

		IContentBuilder content = (IContentBuilder) parsedContent;
		
		return this.parseLayouts(content, null);
	}
	
	protected HashMap<String,String> parseStyles(Element rootElement) {
		HashMap<String, String> styles = new HashMap<String, String>();
		
		String style = XMLUtils.getText(rootElement);
		if(style.length() > 0){
			style = StringUtils.unescapeXML(style);
			styles.put("default", style);
		}
	
		return styles;
	}
	
	@Override
	protected Content parseLayouts(IContentBuilder content, Element child) {
		if (child == null) {
			PageLayout defaultLayout = new PageLayout();
			defaultLayout.setName("default");
			defaultLayout.setTreshold(0, PageLayout.MAX_RIGHT_TRESHOLD);
			defaultLayout.setType("default");
			
			content.addLayout(defaultLayout);
		}
		
		return (Content) content;
	}
}
