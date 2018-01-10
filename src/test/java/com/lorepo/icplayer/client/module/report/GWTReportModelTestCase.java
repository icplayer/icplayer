package com.lorepo.icplayer.client.module.report;

import com.google.gwt.xml.client.Element;

import static org.junit.Assert.assertEquals;

import java.io.IOException;
import java.io.InputStream;

import org.apache.tools.ant.filters.StringInputStream;
import org.junit.Test;
import org.powermock.reflect.Whitebox;
import org.xml.sax.SAXException;

import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;
import com.lorepo.icplayer.client.module.mockup.ModuleFactoryMockup;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTReportModelTestCase extends GwtTest{
	
	private final String PAGE_VERSION = "2";
	
	@Test
	public void validateXML() throws SAXException, IOException {
		ReportModule module = new ReportModule();
		InputStream inputStream = getClass().getResourceAsStream("testdata/report3.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		
		Element element = xmlParser.parser(inputStream);
		
		module.load(element, "", this.PAGE_VERSION);
		
		String xml = module.toXML();
		
		xmlParser = new XMLParserMockup();
		element = xmlParser.parser(new StringInputStream(xml));
		
		module = new ReportModule();
		module.load(element, "", this.PAGE_VERSION);
		
		
		String errorsLabel = Whitebox.getInternalState(module, "errorsLabel");
		String checksLabel = Whitebox.getInternalState(module, "checksLabel");
		String resultsLabel = Whitebox.getInternalState(module, "resultsLabel");
		String totalLabel = Whitebox.getInternalState(module,  "totalLabel");
		
		assertEquals("1<>", errorsLabel);
		assertEquals("2<>", checksLabel);
		assertEquals("3<>", resultsLabel);
		assertEquals("4<>", totalLabel);
	}
}
