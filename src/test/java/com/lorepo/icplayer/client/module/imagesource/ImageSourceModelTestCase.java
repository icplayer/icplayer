package com.lorepo.icplayer.client.module.imagesource;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.io.InputStream;

import org.apache.tools.ant.filters.StringInputStream;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.xml.sax.SAXException;

import com.google.gwt.xml.client.Element;
import com.lorepo.icf.properties.IBooleanProperty;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.xml.page.parsers.PageParser_v1;

@RunWith(PowerMockRunner.class)
@PrepareForTest(DictionaryWrapper.class)
public class ImageSourceModelTestCase {
	
	private final static String PAGE_VERSION = "2";
	public void loadPage(String xmlFile, Page page) {
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

	@Test
	public void moduleTypeName() {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("image_source_module")).thenReturn("Image source");

		ImageSourceModule module = new ImageSourceModule();
		assertEquals("Image source", module.getModuleTypeName());
	}


	@Test
	public void loadFromPage() throws SAXException, IOException {
		Page page = new Page("Page 1", "");
		loadPage("testdata/page.xml", page);
		
		IModuleModel module = page.getModules().get(0);
		
		assertTrue(module instanceof ImageSourceModule);
		ImageSourceModule imageModel = (ImageSourceModule) module;
		
		assertEquals("is1", imageModel.getId());
		assertEquals("media/river.jpg", imageModel.getUrl());
	}

	@Test
	public void propertyRemovable() throws SAXException, IOException {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("image_source_removable")).thenReturn("Removable");

		InputStream inputStream = getClass().getResourceAsStream("testdata/module2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ImageSourceModule module = new ImageSourceModule();
		module.load(element, "", PAGE_VERSION);
		assertFalse(module.isRemovable());
		
		boolean foundProperty = false;
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			if(module.getProperty(i) instanceof IBooleanProperty){
				IBooleanProperty property = (IBooleanProperty) module.getProperty(i);
				foundProperty = (property.getName().compareTo("Removable") == 0);
			}
		}
		
		assertTrue(foundProperty);
	}
	
}
