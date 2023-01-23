package com.lorepo.icplayer.client.xml.page.parsers;

import com.google.gwt.xml.client.Element;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.xml.page.IPageBuilder;

public class PageParser_v7 extends PageParser_v6 {

	public PageParser_v7() {
		this.version = "8";
	}
	
	@Override
	protected IPageBuilder loadIsSplitInPrintBlocked(IPageBuilder page, Element xml) {
		boolean isSplitInPrintBlocked = XMLUtils.getAttributeAsBoolean(xml, "isSplitInPrintBlocked");
		page.setSplitInPrintBlocked(isSplitInPrintBlocked);
		return page;
	}
}
