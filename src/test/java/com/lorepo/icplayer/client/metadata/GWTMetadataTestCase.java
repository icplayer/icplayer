package com.lorepo.icplayer.client.metadata;

import static org.junit.Assert.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

import org.custommonkey.xmlunit.Diff;
import org.custommonkey.xmlunit.ElementNameAndAttributeQualifier;
import org.custommonkey.xmlunit.XMLAssert;
import org.custommonkey.xmlunit.XMLUnit;
import org.junit.Before;
import org.junit.Test;
import org.xml.sax.SAXException;

import com.google.gwt.xml.client.Element;
import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTMetadataTestCase extends GwtTest {
	
	@Before
	public void setUp() {
		XMLUnit.setIgnoreWhitespace(true);
		XMLUnit.setIgnoreComments(true);
		XMLUnit.setIgnoreDiffBetweenTextAndCDATA(true);
		XMLUnit.setNormalizeWhitespace(true);
		XMLUnit.setIgnoreAttributeOrder(true);
	}
	
	private String getFromFile(String path) throws IOException {
		InputStream xmlStream = getClass().getResourceAsStream(path);
		Scanner s = new Scanner(xmlStream).useDelimiter("\\A");
		String result = s.hasNext() ? s.next() : "";
		return result;
	}
	
	private Element getXML(String path) throws IOException, SAXException {
		String xmlString = getFromFile(path);
		
		InputStream stream;
		stream = new ByteArrayInputStream(xmlString.getBytes(StandardCharsets.UTF_8.name()));
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element xml = xmlParser.parser(stream);
		
		return xml;
	}
	
	
	@Test
	public void parsingMetadataElements() throws IOException, SAXException {
		Metadata metadata = new Metadata();
		
		Element metadataXML = getXML("testdata/metadata.xml");
		
		metadata.parse(metadataXML);
		
		assertTrue(metadata.hasEntries());
		assertEquals(metadata.getValue("skills"), "grammar");
		assertEquals(metadata.getValue("difficulty"), "easy");
		assertEquals(metadata.getValue("url"), "www.trojmiasto.pl");
	}
	
	
	@Test
	public void toXML() throws IOException, SAXException {
		Metadata metadata = new Metadata();		
		metadata.put("skills", "grammar");
		metadata.put("difficulty", "easy");
		metadata.put("url", "www.trojmiasto.pl");
		
		String expected = getFromFile("testdata/metadata.xml");
		String resultXML = metadata.toXML().toString();
		
		
		Diff diff = new Diff(expected, resultXML); 
		diff.overrideElementQualifier(new ElementNameAndAttributeQualifier());

		XMLAssert.assertXMLEqual(diff, true);
	}
}
