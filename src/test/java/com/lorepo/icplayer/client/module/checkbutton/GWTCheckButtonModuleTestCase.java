package com.lorepo.icplayer.client.module.checkbutton;

import static org.junit.Assert.assertEquals;

import java.io.IOException;
import java.io.InputStream;

import org.apache.tools.ant.filters.StringInputStream;
import org.junit.Test;
import org.xml.sax.SAXException;

import com.google.gwt.xml.client.Element;
import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTCheckButtonModuleTestCase extends GwtTest {
	
	private static final String PAGE_VERSION = "2";
	
	@Test
	public void saveLoad() throws SAXException, IOException {

		InputStream inputStream = getClass().getResourceAsStream("testdata/check1.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		CheckButtonModule module = new CheckButtonModule();
		module.load(element, "", PAGE_VERSION);
		String xml = module.toXML();
		element = xmlParser.parser(new StringInputStream(xml));
		module = new CheckButtonModule();
		module.load(element, "", PAGE_VERSION);
		
		assertEquals("check<>", module.getCheckTitle());
		assertEquals("unCheck<>", module.getUnCheckTitle());
	}
}
