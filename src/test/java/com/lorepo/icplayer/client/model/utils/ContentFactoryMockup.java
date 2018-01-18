package com.lorepo.icplayer.client.model.utils;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Scanner;

import org.xml.sax.SAXException;

import com.google.gwt.xml.client.Element;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.xml.content.ContentFactory;

public class ContentFactoryMockup extends ContentFactory {
	
	public ContentFactoryMockup(ArrayList<Integer> pagesSubset) {
		super(pagesSubset);
	}
	
	public static ContentFactoryMockup getInstanceWithAllPages() {
		return new ContentFactoryMockup(new ArrayList<Integer>());
	}
	
	public static ContentFactoryMockup getInstanceWithSubset(ArrayList<Integer> pageSubset) {
		return new ContentFactoryMockup(pageSubset);
	}
	
	@Override
	public Content produce(String xmlString, String fetchUrl) {
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
			
			return (Content) producedContent;
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
	
	public Content loadFromFile(String path) throws SAXException, IOException {
		return this.produce(getFromFile(path), "");
	}
	
	public Content loadFromString(String xml) {
		return this.produce(xml, "");
	}
}
