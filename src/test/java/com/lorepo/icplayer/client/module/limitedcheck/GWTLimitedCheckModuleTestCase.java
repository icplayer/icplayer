package com.lorepo.icplayer.client.module.limitedcheck;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
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
public class GWTLimitedCheckModuleTestCase extends GwtTest {
	
	private static final String PAGE_VERSION = "2";
	
	private String getFromFile(String path) throws IOException {
		InputStream xmlStream = getClass().getResourceAsStream(path);
		Scanner s = new Scanner(xmlStream).useDelimiter("\\A");
		String result = s.hasNext() ? s.next() : "";
		return result;
	}
	
	@Before
	public void setUp() {
		XMLUnit.setIgnoreWhitespace(true);
		XMLUnit.setIgnoreComments(true);
		XMLUnit.setIgnoreDiffBetweenTextAndCDATA(true);
		XMLUnit.setNormalizeWhitespace(true);
		XMLUnit.setIgnoreAttributeOrder(true);
	}
	
	@Test
	public void modelToXML() throws SAXException, IOException {
		String testXML = this.getFromFile("testdata/limitedcheck.xml");
		
		LimitedCheckModule module = new LimitedCheckModule();
		module.setCheckText("Some text<>");
		module.setUnCheckText("Some uncheck text<>");
		module.setRawWorksWith("Table1;Table1");
		
		String resultXML = module.modelToXML().toString();
		
		Diff diff = new Diff(testXML, resultXML);
		
		diff.overrideElementQualifier(new ElementNameAndAttributeQualifier());
		
        XMLAssert.assertXMLEqual(diff, true);
	}
	
	@Test
	public void modelFromXML () throws IOException, SAXException {
		String testXML = this.getFromFile("testdata/limitedcheck.xml");
		LimitedCheckModule module = new LimitedCheckModule();
		
		module.setCheckText("Some text<>");
		module.setUnCheckText("Some uncheck text<>");
		module.setRawWorksWith("Table1;Table1");
		
		String resultXML = module.toXML();
		
		module = new LimitedCheckModule();
		
		InputStream inputStream = new ByteArrayInputStream(resultXML.getBytes());
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		module.load(element, "", this.PAGE_VERSION);
		
		resultXML = module.modelToXML().toString();
		
		
		Diff diff = new Diff(testXML, resultXML);
		
		diff.overrideElementQualifier(new ElementNameAndAttributeQualifier());
		
        XMLAssert.assertXMLEqual(diff, true);
	}
}
