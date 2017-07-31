package com.lorepo.icplayer.client.utils;

import java.io.IOException;
import java.io.InputStream;

import org.xml.sax.SAXException;

import com.google.gwt.xml.client.Element;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.xml.page.PageFactory;
import com.lorepo.icplayer.client.xml.page.parsers.IPageParser;
import com.lorepo.icplayer.client.xml.page.parsers.PageParser_v1;

public class XML {
	
	public Page loadPageFromString(Page page, String pageXML) {
		PageFactory pageFactory = new PageFactory(page);

		return (Page) pageFactory.produce(pageXML, "");
	}
	
	public Page loadPageFromFile_v2(Page page, String path) throws SAXException, IOException {
		InputStream inputStream = getClass().getResourceAsStream(path);

		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);

		IPageParser pp = new PageParser_v1();
		pp.setPage(page);
		return (Page) pp.parse(element);
//		String xml = IOUtils.toString(inputStream);
//		return (Page) pf.produce(element.toString(), "");
	}
}

/*	private void loadPage(String xmlFile, Page page) {
	InputStream inputStream = getClass().getResourceAsStream(xmlFile);
	try {

		PageParser_v1 parser = new PageParser_v1();
		parser.setPage(page);
		page = (Page) parser.parse(element);
	} catch (SAXException e) {
		e.printStackTrace();
	} catch (IOException e) {
		e.printStackTrace();
	}
}*/