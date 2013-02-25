package com.lorepo.icplayer.client.mockup.xml;

import java.io.IOException;
import java.io.InputStream;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import org.xml.sax.SAXException;

import com.google.gwt.xml.client.Element;

public class XMLParserMockup {

	public Element parser(InputStream inputStream) throws SAXException, IOException{
		
		Element element = null;
		DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder dBuilder;
		
		try {
			dBuilder = dbFactory.newDocumentBuilder();
			Document doc = dBuilder.parse(inputStream);
			element = new ElementImpl(doc.getDocumentElement());
		} catch (ParserConfigurationException e) {
			e.printStackTrace();
		}
		
		return element;
	}
}
