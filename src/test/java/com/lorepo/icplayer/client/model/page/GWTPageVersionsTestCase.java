package com.lorepo.icplayer.client.model.page;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Scanner;

import org.apache.commons.io.IOUtils;
import org.custommonkey.xmlunit.Diff;
import org.custommonkey.xmlunit.XMLAssert;
import org.custommonkey.xmlunit.XMLUnit;
import org.junit.Before;
import org.junit.Test;
import org.xml.sax.SAXException;

import com.google.gwt.xml.client.Element;
import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;
import com.lorepo.icplayer.client.model.layout.Size;
import com.lorepo.icplayer.client.utils.XML;
import com.lorepo.icplayer.client.xml.page.PageFactory;
import com.lorepo.icplayer.client.xml.page.parsers.PageParser_v0;
import com.lorepo.icplayer.client.xml.page.parsers.PageParser_v1;
import com.lorepo.icplayer.client.xml.page.parsers.PageParser_v2;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTPageVersionsTestCase extends GwtTest {
	Page page = null;
	PageFactory factory = null;
	private XML xmlUtils = new XML();
	
	
	private String getFromFile(String path) throws IOException {
		InputStream xmlStream = getClass().getResourceAsStream(path);
		Scanner s = new Scanner(xmlStream).useDelimiter("\\A");
		String result = s.hasNext() ? s.next() : "";
		return result;
	}
	
	private void loadPagev0(Page page, String path) throws SAXException, IOException {
		InputStream inputStream = getClass().getResourceAsStream(path);
		
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		PageParser_v0 parser = new PageParser_v0();
		parser.setPage(page);
		parser.parse(element);
	}
	
	private void loadPagev1(Page page, String path) throws SAXException, IOException {
		InputStream inputStream = getClass().getResourceAsStream(path);
		
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		PageParser_v1 parser = new PageParser_v1();
		parser.setPage(page);
		parser.parse(element);
	}
	
	@Before
	public void setUp() {
		XMLUnit.setIgnoreWhitespace(true);
		XMLUnit.setIgnoreComments(true);
		XMLUnit.setIgnoreDiffBetweenTextAndCDATA(true);
		XMLUnit.setNormalizeWhitespace(true);
		XMLUnit.setIgnoreAttributeOrder(true);
		
		this.page = new Page("Page", "");
	}
	
	@Test
	public void readingVersion2PageWithNoHeaders() throws IOException, SAXException {
		String pageXML = getFromFile("testdata/PageVersion3NoHeaders.xml");
		this.loadPagev1(this.page, "testdata/PageVersion2WithoutHeaders.xml");		
		
		String result = page.toXML();
		
		Diff diff = new Diff(pageXML, result);
		XMLAssert.assertXMLEqual(diff, true);
	}
	
	@Test
	public void readingVersion2Page() throws IOException, SAXException {
		String pageXML = getFromFile("testdata/PageVersion3.xml");
		this.loadPagev1(this.page, "testdata/PageVersion2.xml");
		String result = page.toXML();
		
		Diff diff = new Diff(pageXML, result);
		XMLAssert.assertXMLEqual(diff, true);
	}
	
	@Test
	public void readingPageWithoutVersion() throws IOException, SAXException {
		String pageXML = getFromFile("testdata/PageVersion3.xml");
		this.loadPagev0(this.page, "testdata/PageWithoutVersion.xml");
		
		String result = this.page.toXML();
		Diff diff = new Diff(pageXML, result);
		
		XMLAssert.assertXMLEqual(diff, true);
	}
	
	@Test
	public void pageWithoutVersionCheckingHeadersAndLayout() throws IOException, SAXException {
		this.loadPagev0(this.page, "testdata/PageWithoutVersion.xml");
		
		assertTrue(this.page.hasFooter());
		assertTrue(this.page.hasHeader());
		assertEquals(0, this.page.getHeight());
		assertEquals(0, this.page.getWidth());
		assertEquals("3", this.page.getVersion());
	}
	
	@Test
	public void pageVersion2CheckingLayout() throws IOException, SAXException {
		this.loadPagev0(this.page, "testdata/PageWithoutVersion.xml");
		
		assertEquals(0, this.page.getHeight());
		assertEquals(0, this.page.getWidth());
		assertEquals("3", this.page.getVersion());
	}
}
