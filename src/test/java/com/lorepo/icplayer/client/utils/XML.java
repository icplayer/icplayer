package com.lorepo.icplayer.client.utils;

import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.xml.page.PageFactory;

public class XML {
	
	public static Page loadPageFromString(Page page, String pageXML) {
		PageFactory pageFactory = new PageFactory(page);

		Page resultPage = (Page) pageFactory.produce(pageXML, "");
		
		return resultPage;
	}

}
