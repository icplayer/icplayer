package com.lorepo.icplayer.client.model.page;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.apache.tools.ant.filters.StringInputStream;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import com.google.gwt.xml.client.Element;
import com.lorepo.icf.properties.IBooleanProperty;
import com.lorepo.icf.properties.IEnumSetProperty;
import com.lorepo.icf.properties.IImageProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.IPropertyListener;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.framework.module.IStyleListener;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.model.page.Page.LayoutType;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.shape.ShapeModule;
import com.lorepo.icplayer.client.xml.page.parsers.PageParser_v1;

@RunWith(PowerMockRunner.class)
@PrepareForTest(DictionaryWrapper.class)
public class PageTestCase {

	private boolean eventReceived;
	
	private void loadPage(String xmlFile, Page page) {
		InputStream inputStream = getClass().getResourceAsStream(xmlFile);
		try {
			XMLParserMockup xmlParser = new XMLParserMockup();
			Element element = xmlParser.parser(inputStream);
			PageParser_v1 parser = new PageParser_v1();
			parser.setPage(page);
			page = (Page) parser.parse(element);
		} catch (SAXException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	@Ignore("toXML need fix")
	@Test
	public void toXMLNotNull() {
		
		Page page = new Page("page1", "");
		String xml = page.toXML();
		
		assertNotNull(xml);
	}

	@Test
	public void loadFromXMLAddon() throws SAXException, IOException {
		Page page = new Page("AddonPage", "");
		loadPage("testdata/addon.page.xml", page);
		
		IModuleModel moduleModel = page.getModules().get(0); 
		assertEquals("HelloWorldAddon", moduleModel.getModuleTypeName());
	}

	@Test
	public void getModuleById() throws SAXException, IOException {
		Page page = new Page("AddonPage", "");
		loadPage("testdata/addon.page.xml", page);
		
		IModuleModel moduleModel = page.getModules().getModuleById("button1"); 
		assertNotNull(moduleModel);
	}

	@Test
	public void setNameSendEvent() throws SAXException, IOException {
		Page page = new Page("AddonPage", "");
		loadPage("testdata/addon.page.xml",page);
		
		eventReceived = false;
		page.addPropertyListener(new IPropertyListener() {
			
			@Override
			public void onPropertyChanged(IProperty source) {
				eventReceived = true;
			}
		});

		page.setName("new name");
		
		assertTrue(eventReceived);
	}

	@Test
	public void styleEvent() throws SAXException, IOException {
		
		Page page = new Page("AddonPage", "");
		
		eventReceived = false;
		page.addStyleListener(new IStyleListener() {
			
			@Override
			public void onStyleChanged() {
				eventReceived = true;
			}
		});

		page.setInlineStyle("test");
		
		assertTrue(eventReceived);
	}

	@Ignore("xml parsing need fix")
	@Test
	public void saveLoadCssClass() throws SAXException, IOException {
		
		Page page = new Page("Class test page", "");
		page.setStyleClass("DemoClass");
		String xml = page.toXML();
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(new StringInputStream(xml));
		
		page = new Page("id", "path");
		page.load(element, "");
		
		assertEquals("DemoClass", page.getStyleClass());
	}

	@Ignore("xml parsing need fix")
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
	@Ignore("xml parsing need fix")
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

	
	/**
	 * Sprawdzenie, ze podczas zapisu jest poprawny XML
	 * @throws ParserConfigurationException 
	 * @throws IOException 
	 * @throws SAXException 
	 */
	@Ignore("xml parsing need fix")
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

	
	/**
	 * Try to parse XML
	 * @param xml
	 * @throws ParserConfigurationException
	 * @throws SAXException
	 * @throws IOException
	 */
	private static void parseXML(String xml) throws ParserConfigurationException,
			SAXException, IOException {
		DocumentBuilderFactory docBuilderFactory = DocumentBuilderFactory.newInstance();
        DocumentBuilder docBuilder;
		docBuilder = docBuilderFactory.newDocumentBuilder();
		InputSource is = new InputSource(new StringReader(xml));
        docBuilder.parse(is);
	}
	
	@Test
	public void isLoaded() throws SAXException, IOException {
		Page page = new Page("AddonPage", "");
		loadPage("testdata/addon.page.xml", page);
		
		assertTrue(page.isLoaded());
	}

	@Test
	public void getPageSize() throws SAXException, IOException {
		Page page = new Page("Sizes", "");
		loadPage("testdata/page.xml", page);
		
		assertEquals(100, page.getWidth());
		assertEquals(200, page.getHeight());
	}

	@Test
	public void pageSizeProperties() throws SAXException, IOException {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("width")).thenReturn("width");
		when(DictionaryWrapper.get("height")).thenReturn("height");
		
		Page page = new Page("Sizes", "");
		loadPage("testdata/page.xml", page);

		int width = 0;
		int height = 0;
		
		for(int i = 0; i < page.getPropertyCount(); i++){
		
			IProperty property = page.getProperty(i);
			if(property.getName().compareToIgnoreCase("width") == 0){
				width = Integer.parseInt(property.getValue());
			}
			else if(property.getName().compareToIgnoreCase("height") == 0){
				height = Integer.parseInt(property.getValue());
			}
		}
		
		assertEquals(100, width);
		assertEquals(200, height);
	}

	@Ignore("parsing xml need fix")
	@Test
	public void saveLoadsize() throws SAXException, IOException {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("width")).thenReturn("width");
		when(DictionaryWrapper.get("height")).thenReturn("height");

		Page page = new Page("Sizes", "");
		for(int i = 0; i < page.getPropertyCount(); i++){

			IProperty property = page.getProperty(i);
			if(property.getName().compareToIgnoreCase("width") == 0){
				property.setValue("300");
			}
			else if(property.getName().compareToIgnoreCase("height") == 0){
				property.setValue("400");
			}
		}

		String xml = page.toXML();
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(new StringInputStream(xml));

		page = new Page("id", "path");
		page.load(element, "");

		assertEquals(300, page.getWidth());
		assertEquals(400, page.getHeight());
	}

	@Ignore("parsing xml need fix")
	@Test
	public void isReportableTrue() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/page.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		Page page = new Page("Page 1", "");
		page.load(element, "");
		String xml = page.toXML();
		element = xmlParser.parser(new StringInputStream(xml));
		
		page = new Page("Page 2", "");
		page.load(element, "");
		
		assertTrue(page.isReportable());
	}

	@Test
	public void reportableProperty(){
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("is_reportable")).thenReturn("Is&nbsp;reportable");

		Page page = new Page("Page 1", "");

		assertTrue(page.isReportable());

		for(int i = 0; i < page.getPropertyCount(); i++){
			IProperty property = page.getProperty(i);
			if(property instanceof IBooleanProperty && 
					property.getName().compareToIgnoreCase("Is&nbsp;reportable") == 0)
			{
				property.setValue("false");
			}
		}

		assertFalse(page.isReportable());
	}


	@Test
	public void previewProperty(){
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("Preview")).thenReturn("Preview");

		Page page = new Page("Page 1", "");
		page.setPreview("/file/1");
		String foundValue = null;

		for(int i = 0; i < page.getPropertyCount(); i++){
			IProperty property = page.getProperty(i);
			if(property instanceof IImageProperty && 
					property.getName().compareToIgnoreCase("Preview") == 0)
			{
				foundValue = property.getValue();
				break;
			}
		}

		assertEquals("/file/1", foundValue);
	}
	
	
	@Test
	public void outstreachHeight1() throws SAXException, IOException {
		Page page = new Page("Sizes", "");
		loadPage("testdata/page.xml", page);
		
		page.outstreachHeight(20, 8);
		IModuleModel module1 = page.getModules().get(0);
		IModuleModel module2 = page.getModules().get(1);
		
		assertEquals(10, module1.getTop());
		assertEquals(98, module2.getTop());
	}

	@Test
	public void outstreachHeight2() throws SAXException, IOException {
		Page page = new Page("Sizes", "");
		loadPage("testdata/page.xml", page);
		
		page.outstreachHeight(20, -8);
		IModuleModel module1 = page.getModules().get(0);
		IModuleModel module2 = page.getModules().get(1);
		
		assertEquals(10, module1.getTop());
		assertEquals(82, module2.getTop());
	}

	@Test
	public void uniqueName() throws SAXException, IOException {
		Page page = new Page("Sizes", "");
		loadPage("testdata/page.xml", page);
		
		String name = page.createUniquemoduleId("Test");
		assertEquals("Test1", name);
	}

	@Test
	public void getPixelLayout() throws SAXException, IOException {
		Page page = new Page("Sizes", "");
		loadPage("testdata/page.xml", page);
		
		assertTrue(page.getLayout() == LayoutType.pixels);
	}

	@Test
	public void getResponsiveLayout() throws SAXException, IOException {
		Page page = new Page("Sizes", "");
		loadPage("testdata/page2.xml", page);
		
		assertTrue(page.getLayout() == LayoutType.responsive);
	}
	

	@Test
	public void defaultScoringType() throws SAXException, IOException {
		Page page = new Page("Page 1", "");
		loadPage("testdata/page.xml", page);
		
		assertTrue(page.getScoringType() == Page.ScoringType.percentage);
	}
	

	@Ignore("to xml need fix")
	@Test
	public void saveScoringType() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/page4.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		Page page = new Page("Page 1", "");
		page.load(element, "");
		String xml = page.toXML();
		element = xmlParser.parser(new StringInputStream(xml));
		
		page = new Page("Page 2", "");
		page.load(element, "");
		
		assertTrue(page.getScoringType() == Page.ScoringType.zeroOne);
	}



	@Test
	public void scoreTypeProperty(){
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("score_type")).thenReturn("Score Type");

		Page page = new Page("Page 1", "");
		page.setPreview("/file/1");
		String foundValue = null;

		for(int i = 0; i < page.getPropertyCount(); i++){
			IProperty property = page.getProperty(i);
			if( property instanceof IEnumSetProperty && 
				property.getName().equalsIgnoreCase("Score Type"))
			{
				foundValue = property.getValue();
				break;
			}
		}

		assertEquals("percentage", foundValue);
	}
}
