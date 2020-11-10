package com.lorepo.icplayer.client.xml.page.parsers;

import com.google.gwt.xml.client.Element;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.xml.page.IPageBuilder;

public class PageParser_v5 extends PageParser_v4 {

	public PageParser_v5() {
		this.version = "6";
	}
	
	@Override
	protected IPageBuilder loadRandomizeInPrint(IPageBuilder page, Element xml) {
		boolean randomizeInPrint = XMLUtils.getAttributeAsBoolean(xml, "randomizeInPrint");
		page.setRandomizeInPrint(randomizeInPrint);
		return page;
	}
}
