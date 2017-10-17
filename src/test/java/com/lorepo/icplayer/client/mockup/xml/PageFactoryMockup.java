package com.lorepo.icplayer.client.mockup.xml;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

import org.xml.sax.SAXException;

import com.google.gwt.xml.client.Element;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.xml.page.PageFactory;

public class PageFactoryMockup extends PageFactory {

	public PageFactoryMockup(Page page) {
		super(page);
	}
	
	@Override
	public Object produce(String xmlString, String fetchUrl) {
		InputStream stream;
		try {
			stream = new ByteArrayInputStream(xmlString.getBytes(StandardCharsets.UTF_8.name()));
			XMLParserMockup xmlParser = new XMLParserMockup();
			Element xml = xmlParser.parser(stream);
			
			String version = XMLUtils.getAttributeAsString(xml, "version", "1");
			if (version.equals("")) {
				version = "1";
			}
			
			Object producedContent = this.parsersMap.get(version).parse(xml);
			
			return producedContent;
		} catch (SAXException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public String getFromFile(String path) throws IOException {
		InputStream xmlStream = getClass().getResourceAsStream(path);
		Scanner s = new Scanner(xmlStream).useDelimiter("\\A");
		String result = s.hasNext() ? s.next() : "";
		return result;
	}
	
	public Page loadFromFile(String path) throws SAXException, IOException {
		return (Page) this.produce(getFromFile(path), "");
	}
	
	public Page loadFromString(String xml) {
		return (Page) this.produce(xml, "");
	}

}
