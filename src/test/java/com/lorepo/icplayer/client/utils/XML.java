package com.lorepo.icplayer.client.utils;

import java.io.IOException;
import java.io.InputStream;

import org.apache.commons.io.IOUtils;
import org.xml.sax.SAXException;

import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.xml.page.PageFactory;

public class XML {
	
	public Page loadPageFromString(Page page, String pageXML) {
		PageFactory pageFactory = new PageFactory(page);

		return (Page) pageFactory.produce(pageXML, "");
	}
	
	public Page loadPageFromFile(Page page, String path) throws SAXException, IOException {
		InputStream inputStream = getClass().getResourceAsStream(path);
		
		PageFactory pf = new PageFactory(page);
		return (Page) pf.produce(IOUtils.toString(inputStream), "");
	}
}
