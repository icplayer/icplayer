package com.lorepo.icplayer.client.module.errorcounter;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.io.InputStream;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.xml.sax.SAXException;

import com.google.gwt.xml.client.Element;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;

@RunWith(PowerMockRunner.class)
@PrepareForTest(DictionaryWrapper.class)
public class ModelTestCase {
	
	private static final String PAGE_VERSION = "2";

	@Test
	public void moduleTypeName() {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("error_counter_module")).thenReturn("ErrorCounter");

		ErrorCounterModule module = new ErrorCounterModule();
		assertEquals("ErrorCounter", module.getModuleTypeName());
	}
	

	@Test
	public void ErrorCountVisible() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/module.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ErrorCounterModule module = new ErrorCounterModule();
		module.load(element, "", PAGE_VERSION);
		
		assertTrue(module.getShowErrorCounter());
	}
	

	@Test
	public void mistakeCountVisible() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/module.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ErrorCounterModule module = new ErrorCounterModule();
		module.load(element, "", PAGE_VERSION);
		
		assertTrue(module.getShowMistakeCounter());
	}
	

	@Test
	public void ErrorCountHidden() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/module2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ErrorCounterModule module = new ErrorCounterModule();
		module.load(element, "", PAGE_VERSION);
		
		assertFalse(module.getShowErrorCounter());
	}
	

	@Test
	public void mistakeHidden() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/module2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ErrorCounterModule module = new ErrorCounterModule();
		module.load(element, "", PAGE_VERSION);
		
		assertFalse(module.getShowMistakeCounter());
	}
	
	
	@Test
	public void propertyErrors() {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("errors_property")).thenReturn("Show Errors");

		ErrorCounterModule module = new ErrorCounterModule();

		String propertyValue = null;
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i);
			if(property.getName().compareTo("Show Errors") == 0){
				propertyValue = property.getValue();
			}
		}

		assertEquals("True", propertyValue);
	}
	
	
	@Test
	public void propertyMistakes() throws SAXException, IOException {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("mistakes_property")).thenReturn("Show Mistakes");

		InputStream inputStream = getClass().getResourceAsStream("testdata/module2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ErrorCounterModule module = new ErrorCounterModule();
		module.load(element, "", PAGE_VERSION);

		String propertyValue = null;
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i);
			if(property.getName().compareTo("Show Mistakes") == 0){
				propertyValue = property.getValue();
			}
		}

		assertEquals("False", propertyValue);
	}
}
