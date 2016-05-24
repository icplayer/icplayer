package com.lorepo.icplayer.client.xml.page.parsers;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.model.layout.Size;
import com.lorepo.icplayer.client.xml.page.IPageBuilder;

public class PageParser_v2 extends PageParserBase {

	public PageParser_v2() {
		this.version = "3";
	}
	
	@Override
	protected IPageBuilder loadLayouts(IPageBuilder page, Element xml) {
		NodeList children = xml.getChildNodes();
		
		for(int i = 0; i < children.getLength(); i++) {
			if (children.item(i) instanceof Element) {
				Element child = (Element) children.item(i);
				int width = XMLUtils.getAttributeAsInt(child, "width");
				int height = XMLUtils.getAttributeAsInt(child, "height");
				String name = child.getAttribute("name");
				
				page.addSize(name, new Size(width, height));
			}
			
		}
		
		return page;
	}
	
	@Override
	protected IPageBuilder loadPageAttributes(IPageBuilder page, Element xml) {
		return this.page;
	}
}
