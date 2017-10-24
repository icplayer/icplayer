package com.lorepo.icplayer.client.module.report;

import java.io.IOException;

import org.apache.tools.ant.filters.StringInputStream;
import org.junit.Test;
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
		new ModuleFactoryMockup(module).produce("testdata/report/report.xml", PAGE_VERSION);
		
		String xml = module.toXML();
		
		XMLParserMockup xmlParser = new XMLParserMockup();
		xmlParser.parser(new StringInputStream(xml));
	}
}
