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
		boolean isContentDefaultLayoutPresent = false;
		String pageDefaultLayout = null;
		String firstLayout = null;
		boolean firstChild = true;
		
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
				
				if (firstChild) {
					firstLayout = layoutID;
					firstChild = false;
				}
				if (layoutID.equals(this.contentDefaultLayoutID)) {
					isContentDefaultLayoutPresent = true;
				}
				if (isDefault) {
					pageDefaultLayout = layoutID;
				}
			}
		}
		
		if (isContentDefaultLayoutPresent) {
			this.defaultLayoutID = this.contentDefaultLayoutID;
			page.setDefaultLayoutID(contentDefaultLayoutID);
		} else if (pageDefaultLayout != null) {
			this.defaultLayoutID = pageDefaultLayout;
			page.setDefaultLayoutID(pageDefaultLayout);
		} else {
			this.defaultLayoutID = firstLayout;
			page.setDefaultLayoutID(firstLayout);
		}
		
		return page;
	}
}
