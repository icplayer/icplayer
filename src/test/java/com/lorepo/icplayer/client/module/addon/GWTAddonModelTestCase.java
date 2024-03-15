package com.lorepo.icplayer.client.module.addon;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.io.InputStream;

import org.apache.tools.ant.filters.StringInputStream;
import org.junit.Test;
import org.xml.sax.SAXException;

import com.google.gwt.xml.client.Element;
import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icf.properties.IBooleanProperty;
import com.lorepo.icf.properties.IEnumSetProperty;
import com.lorepo.icf.properties.IFileProperty;
import com.lorepo.icf.properties.IHtmlProperty;
import com.lorepo.icf.properties.IImageProperty;
import com.lorepo.icf.properties.IListProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.IPropertyProvider;
import com.lorepo.icf.properties.ITextProperty;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTAddonModelTestCase extends GwtTest {
	
	private static final String PAGE_VERSION = "2";

	@Test
	public void moduleTypeName() {
		AddonModel module = new AddonModel();
		assertEquals("Addon", module.getModuleTypeName());
	}
	
	@Test
	public void loadIsSettingBaseURLValue() throws SAXException, IOException {
		InputStream inputStream = getClass().getResourceAsStream("testdata/addon.page.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		String expectedBaseURL = "Expected BaseURL Value";
		AddonModel module = new AddonModel();
		module.load(element, expectedBaseURL, PAGE_VERSION);
		
		String result = module.getBaseURL();

		assertNotNull(result);
		assertEquals(expectedBaseURL, result);
	}

	@Test
	public void loadFromPageXML() throws SAXException, IOException {
		InputStream inputStream = getClass().getResourceAsStream("testdata/addon.page.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		AddonModel module = new AddonModel();
		module.load(element, "", PAGE_VERSION);
		
		assertEquals("DemoAddon", module.getAddonId());
		assertEquals("addon1", module.getId());
	}

	@Test
	public void loadSaveParams() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/addon.page.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		AddonModel module = new AddonModel();
		module.load(element, "", PAGE_VERSION);
		String xml = module.toXML();
		
		int index = xml.indexOf("myfile.jpg");
		assertTrue(index > 0);
	}

	@Test
	public void escapeId() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/addon.page.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		AddonModel module = new AddonModel();
		module.load(element, "", PAGE_VERSION);
		module.setId("Te\'s");
		String xml = module.toXML();
		
		element = xmlParser.parser(new StringInputStream(xml));
		module = new AddonModel();
		module.load(element, "", PAGE_VERSION);

		assertEquals("Te\'s", module.getId());
	}

	@Test
	public void loadSaveHtml() throws SAXException, IOException {
		InputStream inputStream = getClass().getResourceAsStream("testdata/addon2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		AddonModel module = new AddonModel();
		module.load(element, "", PAGE_VERSION);
		String oldText = module.getPropertyByName("Rich text").getValue();

		String xml = module.toXML();
		element = xmlParser.parser(new StringInputStream(xml));
		module = new AddonModel();
		module.load(element, "", PAGE_VERSION);
		String newText = module.getPropertyByName("Rich text").getValue();
		assertEquals(oldText, newText);
	}

	@Test
	public void validateXML() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/addon.page.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		AddonModel module = new AddonModel();
		module.load(element, "", PAGE_VERSION);
		String xml = module.toXML();
		xmlParser.parser(new StringInputStream(xml));
	}

	@Test
	public void escapeXML() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/addon.page.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		AddonModel module = new AddonModel();
		module.load(element, "", PAGE_VERSION);
		
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			if(module.getProperty(i).getName().compareTo("Title") == 0){
				module.getProperty(i).setValue("<Escape 'this'>");
				break;
			}
		}
		
		String xml = module.toXML();
		xmlParser.parser(new StringInputStream(xml));
	}

	@Test
	public void stringProperty() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/addon.page.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		AddonModel module = new AddonModel();
		module.load(element, "", PAGE_VERSION);
		
		boolean foundPropertyFile = false;
		String value = null;
		String displayName = null;
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			if(module.getProperty(i).getName().compareTo("Title") == 0){
				value = module.getProperty(i).getValue();
				displayName = module.getProperty(i).getDisplayName();
				foundPropertyFile = true;
				break;
			}
		}
		
		assertTrue(foundPropertyFile);
		assertEquals("This is title", value);
		assertEquals("Addon title", displayName);
	}
	
	@Test
	public void toXML() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/addon.page.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		AddonModel module = new AddonModel();
		module.load(element, "", PAGE_VERSION);
		String xml = module.toXML();
		
		int indexStringProperty = xml.indexOf("<property name=\"Title\" displayName=\"Addon title\" type=\"string\" value=\"This is title\"/>");
		int indexImageProperty = xml.indexOf("<property name=\"Image\" displayName=\"Image file\" type=\"image\" value=\"myfile.jpg\"/>");
		int indexFileProperty = xml.indexOf("<property name=\"File\" displayName=\"Test file\" type=\"file\" value=\"testfile.abc\"/>");
		
		assertTrue(indexStringProperty > 0);
		assertTrue(indexImageProperty > 0);
		assertTrue(indexFileProperty > 0);
	}
	
	@Test
	public void booleanProperty() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/addon2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		AddonModel module = new AddonModel();
		module.load(element, "", PAGE_VERSION);
		
		String value = null;
		String displayName = null;
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i); 
			if(property.getName().compareTo("Boolean") == 0){
				if(property instanceof IBooleanProperty){
					value = module.getProperty(i).getValue();
					displayName = module.getProperty(i).getDisplayName();
					break;
				}
			}
		}
		
		assertEquals("true", value);
		assertEquals("Boolean property", displayName);
	}
	
	@Test
	public void imageProperty() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/addon2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		AddonModel module = new AddonModel();
		module.load(element, "", PAGE_VERSION);
		
		String value = null;
		String displayName = null;
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i); 
			if(property.getName().compareTo("Image") == 0){
				if(property instanceof IImageProperty){
					value = module.getProperty(i).getValue();
					displayName = module.getProperty(i).getDisplayName();
					break;
				}
			}
		}
		
		assertEquals("myfile.jpg", value);
		assertEquals("", displayName);
		
	}
	
	@Test
	public void fileProperty() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/addon2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		AddonModel module = new AddonModel();
		module.load(element, "", PAGE_VERSION);
		
		String value = null;
		String displayName = null;
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i); 
			if(property.getName().compareTo("File") == 0){
				if(property instanceof IFileProperty){
					value = module.getProperty(i).getValue();
					displayName = module.getProperty(i).getDisplayName();
					break;
				}
			}
		}
		
		assertEquals("testfile.abc", value);
		assertEquals("", displayName);
	}
	
	@Test
	public void enumProperty() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/addon2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		AddonModel module = new AddonModel();
		module.load(element, "", PAGE_VERSION);
		
		IEnumSetProperty foundProperty = null;
		String displayName = null;
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i); 
			if(property.getName().compareTo("Enum") == 0){
				displayName = module.getProperty(i).getDisplayName();
				if(property instanceof IEnumSetProperty){
					foundProperty = (IEnumSetProperty) property;
					break;
				}
			}
		}
		
		assertNotNull(foundProperty);
		assertEquals("ala", foundProperty.getValue());
		assertEquals(3, foundProperty.getAllowedValueCount());
		assertEquals("ala", foundProperty.getAllowedValue(0));
		assertEquals("ma", foundProperty.getAllowedValue(1));
		assertEquals("kota", foundProperty.getAllowedValue(2));
		assertEquals("Enum property", displayName);
	}
	
	@Test
	public void textProperty() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/addon2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		AddonModel module = new AddonModel();
		module.load(element, "", PAGE_VERSION);
		
		ITextProperty foundProperty = null;
		String displayName = null;
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i); 
			if(property.getName().compareTo("Text") == 0){
				displayName = module.getProperty(i).getDisplayName();
				if(property instanceof ITextProperty){
					foundProperty = (ITextProperty) property;
					break;
				}
			}
		}
		
		assertNotNull(foundProperty);
		assertEquals("ala", foundProperty.getValue());
		assertEquals("Text property", displayName);
	}

	
	@Test
	public void textProperty2() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/addon4.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		AddonModel module = new AddonModel();
		module.load(element, "", PAGE_VERSION);
		
		ITextProperty foundProperty = null;
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i); 
			if(property.getName().compareTo("Subtitles") == 0){
				if(property instanceof ITextProperty){
					foundProperty = (ITextProperty) property;
					break;
				}
			}
		}
		
		assertNotNull(foundProperty);
		assertEquals("temperature \\(\\neq\\)", foundProperty.getValue());
	}

	
	@Test
	public void listProperty() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/addon2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		AddonModel module = new AddonModel();
		module.load(element, "", PAGE_VERSION);
		
		IListProperty foundProperty = null;
		String displayName = null;
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i); 
			if(property.getName().compareTo("Options") == 0){
				displayName = module.getProperty(i).getDisplayName();
				if(property instanceof IListProperty){
					foundProperty = (IListProperty) property;
					break;
				}
			}
		}
		
		assertNotNull(foundProperty);
		assertEquals(3, foundProperty.getChildrenCount());
		
		IPropertyProvider provider = foundProperty.getChild(0);
		assertEquals(2, provider.getPropertyCount());
		assertEquals("Options property", displayName);
	}
	

	@Test
	public void listPropertyToXML() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/addon2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		AddonModel module = new AddonModel();
		module.load(element, "", PAGE_VERSION);
		
		IListProperty foundProperty = null;
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i); 
			if(property.getName().compareTo("Options") == 0){
				if(property instanceof IListProperty){
					foundProperty = (IListProperty) property;
					break;
				}
			}
		}
		
		assertNotNull(foundProperty);
		assertEquals(3, foundProperty.getChildrenCount());
		
		IPropertyProvider provider = foundProperty.getChild(0);
		assertEquals(2, provider.getPropertyCount());
		
	}
	

	@Test
	public void removeListPropertyRows() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/addon2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		AddonModel module = new AddonModel();
		module.load(element, "", PAGE_VERSION);
		
		IListProperty foundProperty = null;
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i); 
			if(property.getName().compareTo("Options") == 0){
				if(property instanceof IListProperty){
					foundProperty = (IListProperty) property;
					break;
				}
			}
		}
		
		assertNotNull(foundProperty);
		assertEquals(3, foundProperty.getChildrenCount());
		
		foundProperty.addChildren(2);
		assertEquals(5, foundProperty.getChildrenCount());
	}
	

	
	@Test
	public void addListPropertyRows() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/addon2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		AddonModel module = new AddonModel();
		module.load(element, "", PAGE_VERSION);
		
		IListProperty foundProperty = null;
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i); 
			if(property.getName().compareTo("Options") == 0){
				if(property instanceof IListProperty){
					foundProperty = (IListProperty) property;
					break;
				}
			}
		}
		
		assertNotNull(foundProperty);
		assertEquals(3, foundProperty.getChildrenCount());
		
		foundProperty.addChildren(5);
		assertEquals(8, foundProperty.getChildrenCount());

		IPropertyProvider provider = foundProperty.getChild(4);
		assertEquals(2, provider.getPropertyCount());
	}
	
	
	@Test
	public void propertyCount() throws SAXException, IOException {
		InputStream inputStream = getClass().getResourceAsStream("testdata/addon3.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		AddonModel module = new AddonModel();
		module.load(element, "", PAGE_VERSION);
		
		assertEquals(15, module.getPropertyCount());
	}
	
	
	@Test
	public void replaceLinks() throws SAXException, IOException {
		InputStream inputStream = getClass().getResourceAsStream("testdata/addon4.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		AddonModel module = new AddonModel();
		module.load(element, "http://ala/ma/kota/", PAGE_VERSION);
		
		IHtmlProperty foundProperty = (IHtmlProperty) module.getPropertyByName("Rich text");
		
		assertTrue(foundProperty != null);
		
		int index = foundProperty.getValue().indexOf("/ala/ma/kota");
		assertTrue(index > 0);
	}


	@Test
	public void noLocked() throws SAXException, IOException {
		InputStream inputStream = getClass().getResourceAsStream("testdata/addon2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		AddonModel module = new AddonModel();
		module.load(element, "", PAGE_VERSION);

		assertFalse(module.isLocked());
	}


	@Test
	public void locked() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/addonLocked.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		AddonModel module = new AddonModel();
		module.load(element, "", PAGE_VERSION);

		assertTrue(module.isLocked());
	}
}
