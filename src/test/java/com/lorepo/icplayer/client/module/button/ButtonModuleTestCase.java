package com.lorepo.icplayer.client.module.button;

import static org.junit.Assert.assertEquals;
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
public class ButtonModuleTestCase {

	private static final String PAGE_VERSION = "2";

	@Test
	public void moduleTypeName() {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("button_module")).thenReturn("Button");

		ButtonModule module = new ButtonModule();
		assertEquals("Button", module.getModuleTypeName());
	}


	
	@Test
	public void goToPageProperty() throws SAXException, IOException {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("page")).thenReturn("Page");
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/gotopage.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ButtonModule module = new ButtonModule();
		module.load(element, "", PAGE_VERSION);
		
		String pageName = null;
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i);
			if(property.getName().compareTo("Page") == 0){
				pageName = property.getValue();
			}
		}
		
		assertEquals("math", pageName);
	}

	@Test
	public void additionalClassesProperty() throws SAXException, IOException {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("additional_classes")).thenReturn("Additional classes");
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/popup.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ButtonModule module = new ButtonModule();
		module.load(element, "", PAGE_VERSION);
		
		String additionalClassesText = null;
		for (int i=0; i<module.getPropertyCount(); i++) {
			IProperty property = module.getProperty(i);
			if (property.getName().compareTo("Additional classes") == 0) {
				additionalClassesText = property.getValue();
			}
		}

		assertEquals("new_class", additionalClassesText);
	}
	
	@Test
	public void onClickProperty() throws SAXException, IOException {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("on_click")).thenReturn("onClick");

		InputStream inputStream = getClass().getResourceAsStream("testdata/standard.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ButtonModule module = new ButtonModule();
		module.load(element, "", PAGE_VERSION);
		
		String onClickText = null;
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i);
			if(property.getName().compareTo("onClick") == 0){
				onClickText = property.getValue();
			}
		}
		
		assertEquals("abc", onClickText);
	}
	
}
