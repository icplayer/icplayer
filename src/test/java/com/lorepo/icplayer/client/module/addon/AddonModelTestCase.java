package com.lorepo.icplayer.client.module.addon;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.io.InputStream;

import org.apache.tools.ant.filters.StringInputStream;
import org.junit.Test;
import org.xml.sax.SAXException;

import com.google.gwt.xml.client.Element;
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

public class AddonModelTestCase {

	@Test
	public void moduleTypeName() {
		
		AddonModel module = new AddonModel();
		assertEquals("Addon", module.getModuleTypeName());
	}

	
	@Test
	public void loadFromPageXML() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/addon.page.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		AddonModel module = new AddonModel();
		module.load(element, "");
		
		assertEquals("DemoAddon", module.getAddonId());
		assertEquals("addon1", module.getId());
	}

	@Test
	public void loadSaveParams() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/addon.page.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		AddonModel module = new AddonModel();
		module.load(element, "");
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
		module.load(element, "");
		module.setId("Te\'s");
		String xml = module.toXML();
		
		element = xmlParser.parser(new StringInputStream(xml));
		module = new AddonModel();
		module.load(element, "");

		assertEquals("Te\'s", module.getId());
	}

	@Test
	public void loadSaveHtml() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/addon2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		AddonModel module = new AddonModel();
		module.load(element, "");
		String oldText = module.getPropertyByName("Rich text").getValue();

		String xml = module.toXML();
		element = xmlParser.parser(new StringInputStream(xml));
		module = new AddonModel();
		module.load(element, "");
		String newText = module.getPropertyByName("Rich text").getValue();
		
		assertEquals(oldText, newText);
	}

	@Test
	public void validateXML() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/addon.page.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		AddonModel module = new AddonModel();
		module.load(element, "");
		String xml = module.toXML();
		xmlParser.parser(new StringInputStream(xml));
	}

	@Test
	public void escapeXML() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/addon.page.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		AddonModel module = new AddonModel();
		module.load(element, "");
		
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
		module.load(element, "");
		
		boolean foundPropertyFile = false;
		String value = null;
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			if(module.getProperty(i).getName().compareTo("Title") == 0){
				value = module.getProperty(i).getValue();
				foundPropertyFile = true;
				break;
			}
		}
		
		assertTrue(foundPropertyFile);
		assertEquals("This is title", value);
	}
	
	@Test
	public void toXML() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/addon.page.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		AddonModel module = new AddonModel();
		module.load(element, "");
		String xml = module.toXML();
		

		int indexStringProperty = xml.indexOf("<property name='Title' type='string' value='This is title'/>");
		int indexImageProperty = xml.indexOf("<property name='Image' type='image' value='myfile.jpg'/>");
		int indexFileProperty = xml.indexOf("<property name='File' type='file' value='testfile.abc'/>");
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
		module.load(element, "");
		
		String value = null;
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i); 
			if(property.getName().compareTo("Boolean") == 0){
				if(property instanceof IBooleanProperty){
					value = module.getProperty(i).getValue();
					break;
				}
			}
		}
		
		assertEquals("true", value);
	}
	
	@Test
	public void imageProperty() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/addon2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		AddonModel module = new AddonModel();
		module.load(element, "");
		
		String value = null;
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i); 
			if(property.getName().compareTo("Image") == 0){
				if(property instanceof IImageProperty){
					value = module.getProperty(i).getValue();
					break;
				}
			}
		}
		
		assertEquals("myfile.jpg", value);
	}
	
	@Test
	public void fileProperty() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/addon2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		AddonModel module = new AddonModel();
		module.load(element, "");
		
		String value = null;
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i); 
			if(property.getName().compareTo("File") == 0){
				if(property instanceof IFileProperty){
					value = module.getProperty(i).getValue();
					break;
				}
			}
		}
		
		assertEquals("testfile.abc", value);
	}
	
	@Test
	public void enumProperty() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/addon2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		AddonModel module = new AddonModel();
		module.load(element, "");
		
		IEnumSetProperty foundProperty = null;
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i); 
			if(property.getName().compareTo("Enum") == 0){
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
	}
	
	@Test
	public void textProperty() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/addon2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		AddonModel module = new AddonModel();
		module.load(element, "");
		
		ITextProperty foundProperty = null;
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i); 
			if(property.getName().compareTo("Text") == 0){
				if(property instanceof ITextProperty){
					foundProperty = (ITextProperty) property;
					break;
				}
			}
		}
		
		assertNotNull(foundProperty);
		assertEquals("ala", foundProperty.getValue());
	}

	
	@Test
	public void textProperty2() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/addon4.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		AddonModel module = new AddonModel();
		module.load(element, "");
		
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
		module.load(element, "");
		
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
	public void listPropertyToXML() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/addon2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		AddonModel module = new AddonModel();
		module.load(element, "");
		String xml = module.toXML();
		element = xmlParser.parser(new StringInputStream(xml));
		module = new AddonModel();
		module.load(element, "");
		
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
		module.load(element, "");
		
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
		
		foundProperty.setChildrenCount(2);
		assertEquals(2, foundProperty.getChildrenCount());
	}
	

	@Test
	public void addListPropertyRows() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/addon2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		AddonModel module = new AddonModel();
		module.load(element, "");
		String xml = module.toXML();
		element = xmlParser.parser(new StringInputStream(xml));
		module = new AddonModel();
		module.load(element, "");
		
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
		
		foundProperty.setChildrenCount(5);
		assertEquals(5, foundProperty.getChildrenCount());

		IPropertyProvider provider = foundProperty.getChild(4);
		assertEquals(2, provider.getPropertyCount());
	}
	
	
	@Test
	public void propertyCount() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/addon3.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		AddonModel module = new AddonModel();
		module.load(element, "");
		String xml = module.toXML();
		element = xmlParser.parser(new StringInputStream(xml));
		module = new AddonModel();
		module.load(element, "");
		
		assertEquals(8, module.getPropertyCount());
	}
	
	
	@Test
	public void replaceLinks() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/addon4.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		AddonModel module = new AddonModel();
		module.load(element, "http://ala/ma/kota/");
		
		IHtmlProperty foundProperty = null;
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i); 
			if(property.getName().compareTo("Rich text") == 0){
				if(property instanceof IHtmlProperty){
					foundProperty = (IHtmlProperty) property;
					break;
				}
			}
		}
		
		assertNotNull(foundProperty);
		int index = foundProperty.getValue().indexOf("/ala/ma/kota");
		assertTrue(index > 0);
	}

}
