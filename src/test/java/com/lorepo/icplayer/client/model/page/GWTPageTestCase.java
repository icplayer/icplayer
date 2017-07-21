package com.lorepo.icplayer.client.model.page;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.util.HashSet;
import java.util.Set;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.apache.tools.ant.filters.StringInputStream;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.reflect.Whitebox;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import com.google.gwt.i18n.client.Dictionary;
import com.google.gwt.xml.client.Element;
import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.shape.ShapeModule;
import com.lorepo.icplayer.client.utils.DomElementManipulator;
import com.lorepo.icplayer.client.utils.XML;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTPageTestCase extends GwtTest {
	
	private XML xmlUtils = new XML();
	
	@Before
	public void setUp() {
		Dictionary dictMock = Mockito.mock(Dictionary.class);
		when(dictMock.get("width")).thenReturn("width");
		when(dictMock.get("height")).thenReturn("height");
		
		Set<String> dictValues = new HashSet<String>();
		dictValues.add("width");
		dictValues.add("height");
		when(dictMock.keySet()).thenReturn(dictValues);
		
		Whitebox.setInternalState(DictionaryWrapper.class, "dictionary", dictMock);
	}
	
	@Test
	public void saveScoringType() throws SAXException, IOException {
		Page page = xmlUtils.loadPageFromFile(new Page("Page 2", ""), "testdata/page4.xml");
		
		Page reloadedPage = xmlUtils.loadPageFromString(new Page("Page 2", ""), page.toXML());
		
		assertTrue(reloadedPage.getScoringType() == Page.ScoringType.zeroOne);
	}
	
	/**
	 * Sprawdzenie, ze podczas zapisu jest poprawny XML
	 * @throws ParserConfigurationException 
	 * @throws IOException 
	 * @throws SAXException 
	 */
	@Test
	public void toXMLWithStyle() throws ParserConfigurationException, SAXException, IOException {
		
		Page page = new Page("ala", "kot");
		IModuleModel module = new ShapeModule();
		
		module.setLeft(1);
		module.setTop(2);
		module.setWidth(3);
		module.setHeight(4);
		module.setInlineStyle("background-image: url('/file/123');");
		page.getModules().add(module);
		String xml = page.toXML();
		
		parseXML(xml);
	}
	
	@Test
	public void toXMLNotNull() {
		Page page = new Page("page1", "");
		String xml = page.toXML();
		
		assertNotNull(xml);
	}
	
	@Test
	public void toXMLSingleModule() {
		Page page = new Page("ala", "kot");
		IModuleModel module = new ShapeModule();
		
		module.setLeft(1);
		module.setTop(2);
		module.setWidth(3);
		module.setHeight(4);
		page.getModules().add(module);
		String xml = page.toXML();
		
		int index = xml.indexOf("<shapeModule ");
		
		assertTrue(index > -1);
	}
	
	/**
	 * Sprawdzenie, ze podczas zapisu jest poprawny XML
	 * @throws ParserConfigurationException 
	 * @throws IOException 
	 * @throws SAXException 
	 */
	@Test
	public void toXML() throws ParserConfigurationException, SAXException, IOException {
		
		Page page = new Page("ala", "kot");
		IModuleModel module = new ShapeModule();
		
		module.setLeft(1);
		module.setTop(2);
		module.setWidth(3);
		module.setHeight(4);
		page.getModules().add(module);
		String xml = page.toXML();
		
		parseXML(xml);
	}
	
	@Test
	public void ChangeSizeAndSaveLoad() throws Exception {
		DomElementManipulator manipulator = Mockito.mock(DomElementManipulator.class);
		PowerMockito.whenNew(DomElementManipulator.class).withArguments(Mockito.any(String.class)).thenReturn(manipulator);

		Page page = new Page("Sizes", "");
		
		page.setWidth(300);
		page.setHeight(400);
		
		String pageXML = page.toXML();

		Page reloadedPage = xmlUtils.loadPageFromString(new Page("id", "path"), pageXML);
		
		assertEquals(300, reloadedPage.getWidth());
		assertEquals(400, reloadedPage.getHeight());
	}
	
	@Test
	public void saveLoadCssClass() throws Exception {
		
		Page page = new Page("Class test page", "");
		page.setStyleClass("DemoClass");
		
		DomElementManipulator manipulator = Mockito.mock(DomElementManipulator.class);
		PowerMockito.whenNew(DomElementManipulator.class).withArguments(Mockito.any(String.class)).thenReturn(manipulator);

		Page reloadedPage = xmlUtils.loadPageFromString(new Page("id", "path"), page.toXML());
		
		assertEquals("DemoClass", reloadedPage.getStyleClass());
	}

	@Test
	public void isReportableTrue() throws Exception {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/page.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		DomElementManipulator manipulator = Mockito.mock(DomElementManipulator.class);
		PowerMockito.whenNew(DomElementManipulator.class).withArguments(Mockito.any(String.class)).thenReturn(manipulator);

		Page page = new Page("Page 1", "");
		page.load(element, "");
		String xml = page.toXML();
		element = xmlParser.parser(new StringInputStream(xml));
		
		page = new Page("Page 2", "");
		page.load(element, "");
		
		assertTrue(page.isReportable());
	}
	
	/**
	 * Try to parse XML
	 * @param xml
	 * @throws ParserConfigurationException
	 * @throws SAXException
	 * @throws IOException
	 */
	private static void parseXML(String xml) throws ParserConfigurationException, SAXException, IOException {
		DocumentBuilderFactory docBuilderFactory = DocumentBuilderFactory.newInstance();
        DocumentBuilder docBuilder;
		docBuilder = docBuilderFactory.newDocumentBuilder();
		InputSource is = new InputSource(new StringReader(xml));
        docBuilder.parse(is);
	}

}
