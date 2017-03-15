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
				String layoutID = child.getAttribute("id");
				int width = XMLUtils.getAttributeAsInt(child, "width");
				int height = XMLUtils.getAttributeAsInt(child, "height");
				boolean isDefault = XMLUtils.getAttributeAsBoolean(child, "isDefault", false);
				
				Size size = new Size(layoutID, width, height);
				size.setIsDefault(isDefault);
				page.addSize(layoutID, size);
			}
		}
		
		return page;
	}
	
	@Override
	protected IPageBuilder loadPageAttributes(IPageBuilder page, Element xml) {
		return this.page;
	}
}
