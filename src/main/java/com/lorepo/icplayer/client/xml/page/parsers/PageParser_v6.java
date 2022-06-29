package com.lorepo.icplayer.client.xml.page.parsers;

import com.google.gwt.xml.client.Element;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.xml.page.IPageBuilder;

public class PageParser_v6 extends PageParser_v5 {

	public PageParser_v6() {
		this.version = "7";
	}
	
	@Override
	protected IPageBuilder loadNotAssignable(IPageBuilder page, Element xml) {
		boolean notAssignable = XMLUtils.getAttributeAsBoolean(xml, "notAssignable");
		page.setNotAssignable(notAssignable);

		return page;
	}
}
