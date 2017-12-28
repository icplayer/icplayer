package com.lorepo.icplayer.client.module.mockup;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

import org.xml.sax.SAXException;

import com.google.gwt.xml.client.Element;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.xml.module.ModuleXMLParsersFactory;
import com.lorepo.icplayer.client.xml.module.parsers.IModuleModelBuilder;

public class ModuleFactoryMockup {
	
	private IModuleModel module;

	public ModuleFactoryMockup(IModuleModel module) {
		this.module = module;
	}
	
	public void produceFromString(String xmlString, String version) throws SAXException, IOException {
		InputStream stream = new ByteArrayInputStream(xmlString.getBytes(StandardCharsets.UTF_8.name()));
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element xml = xmlParser.parser(stream);
		
		ModuleXMLParsersFactory factory = new ModuleXMLParsersFactory((IModuleModelBuilder) this.module);
		factory.produce(xml, version);
		module.load(xml, "", version);
	}

	public void produce(String path, String version) throws SAXException, IOException {
		Element xml = this.getNodeFromFile(path);
		ModuleXMLParsersFactory factory = new ModuleXMLParsersFactory((IModuleModelBuilder) this.module);
		factory.produce(xml, version);
		module.load(xml, "", version);
	}
	
	private Element getNodeFromFile(String path) throws SAXException, IOException{
		InputStream xmlStream = getClass().getResourceAsStream(path);
		Scanner s = new Scanner(xmlStream).useDelimiter("\\A");
		String xmlString = s.hasNext() ? s.next() : "";
		
		InputStream stream = new ByteArrayInputStream(xmlString.getBytes(StandardCharsets.UTF_8.name()));
		XMLParserMockup xmlParser = new XMLParserMockup();
		return xmlParser.parser(stream);
	}
}
