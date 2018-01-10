package com.lorepo.icplayer.client.model;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.io.InputStream;

import org.apache.tools.ant.filters.StringInputStream;
import org.junit.Test;
import org.xml.sax.SAXException;

import com.google.gwt.xml.client.Element;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;
import com.lorepo.icplayer.client.model.addon.AddonDescriptor;
import com.lorepo.icplayer.client.model.addon.AddonProperty;

public class AddonDescriptorTestCase  {
	
	private AddonDescriptor initDescriptor() throws SAXException, IOException{
		InputStream inputStream = getClass().getResourceAsStream("testdata/addon-descriptor.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		AddonDescriptor descriptor = new AddonDescriptor("1", "");
		descriptor.load(element, "");
		String xml = descriptor.toXML();
		element = xmlParser.parser(new StringInputStream(xml));
		descriptor = new AddonDescriptor("2", "");
		descriptor.load(element, "");
		
		return descriptor;
	}

	
	@Test
	public void testIdFromXML() throws SAXException, IOException{
		
		AddonDescriptor descriptor = initDescriptor();
		
		assertEquals("test1", descriptor.getAddonId());
	}

	@Test
	public void testProperties() throws SAXException, IOException{
		
		AddonDescriptor descriptor = initDescriptor();
		assertEquals(3, descriptor.getProperties().size());
	}
	
	@Test
	public void testCSSFromXML() throws SAXException, IOException{
		
		AddonDescriptor descriptor = initDescriptor();
		
		assertEquals(".myclass{background-color:red};", descriptor.getCSS());
	}
	
	@Test
	public void testViewFromXML() throws SAXException, IOException{
		
		AddonDescriptor descriptor = initDescriptor();
		
		assertEquals("<div>View</div>", descriptor.getViewHTML());
	}
	
	@Test
	public void testPreViewFromXML() throws SAXException, IOException{
		
		AddonDescriptor descriptor = initDescriptor();
		
		assertEquals("<div>Preview</div>", descriptor.getPreviewHTML());
	}
	
	@Test
	public void testPresenterFromXML() throws SAXException, IOException{
		
		AddonDescriptor descriptor = initDescriptor();
		
		String code = descriptor.getCode();
		int index = code.indexOf("return obj");
		assertTrue(index > 0);
	}
	
	@Test
	public void toXML() throws SAXException, IOException{
		
		AddonDescriptor descriptor = new AddonDescriptor("1", "/file/15");
		descriptor.setId("45");
		descriptor.addProperty(new AddonProperty("my name", "My name", "string"));

		String xml = descriptor.toXML();
		int index = xml.indexOf("<property");
		assertTrue(index > 0);
	}
	
	
	@Test
	public void testProperty() throws SAXException, IOException{
		
		AddonDescriptor descriptor = initDescriptor();
		AddonProperty property = descriptor.getProperties().get(0);
		
		assertEquals("Filename", property.getName());
		assertEquals("file", property.getType());
	}

	@Test
	public void testListPropertyToXML() throws SAXException, IOException{
		
		AddonDescriptor descriptor = initDescriptor();
		
		AddonProperty property = descriptor.getProperties().get(2);
		
		assertEquals("Options", property.getName());
		assertEquals("list", property.getType());
		assertEquals(2, property.getChildrenCount());
	}

	@Test
	public void testListProperty() throws SAXException, IOException{
		
		AddonDescriptor descriptor = initDescriptor();
		AddonProperty property = descriptor.getProperties().get(2);
		
		assertEquals("Options", property.getName());
		assertEquals("list", property.getType());
		assertEquals(2, property.getChildrenCount());
	}

	@Test
	public void resources() throws SAXException, IOException{
		
		AddonDescriptor descriptor = initDescriptor();
		
		assertEquals(2, descriptor.getResources().size());
		assertEquals("/file/12", descriptor.getResources().get(0));
	}


	@Test
	public void isLocalized() throws SAXException, IOException{
		
		AddonDescriptor descriptor = initDescriptor();
		
		AddonProperty property = descriptor.getProperties().get(1);
		assertEquals(true, property.isLocalized());
		
		
	}
	
}
