package com.lorepo.icplayer.client.model.page;

import static org.junit.Assert.*;
import static org.junit.Assert.assertEquals;

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

import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icplayer.client.mockup.xml.PageFactoryMockup;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.module.addon.AddonModel;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTPageModuleMetadataTestCase extends GwtTest {
	
	final String  PAGE_MODULES_METADATA_PATH = "testdata/metadata/PageVersion8.xml";
	
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
	
	private Page loadFromFile(Page page, String path) throws SAXException, IOException {
		return new PageFactoryMockup(page).loadFromString(getFromFile(path));
	}
	
	@Test
	public void parseModulesMetadata() throws SAXException, IOException {
		String expected = getFromFile(PAGE_MODULES_METADATA_PATH);
		Page page = loadFromFile(new Page("Page 1", "Page1"), PAGE_MODULES_METADATA_PATH);

		Diff diff = new Diff(expected, page.toXML()); 
		diff.overrideElementQualifier(new ElementNameAndAttributeQualifier());

		XMLAssert.assertXMLEqual(diff, true);
	}
}
