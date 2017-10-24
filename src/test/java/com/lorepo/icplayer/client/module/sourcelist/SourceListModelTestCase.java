package com.lorepo.icplayer.client.module.sourcelist;

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
import com.lorepo.icf.properties.IStringListProperty;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.xml.page.parsers.PageParser_v1;

@RunWith(PowerMockRunner.class)
@PrepareForTest(DictionaryWrapper.class)
public class SourceListModelTestCase {

	private static final String PAGE_VERSION = "2";
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

	@Test
	public void moduleTypeName() {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("source_list_module")).thenReturn("Source list");

		SourceListModule module = new SourceListModule();
		assertEquals("Source list", module.getModuleTypeName());
	}

	
	@Test
	public void loadFromPage() throws SAXException, IOException {
		Page page = new Page("AddonPage", "");
		loadPage("testdata/page.xml", page);
		
		IModuleModel module = page.getModules().get(0);
		
		assertTrue(module instanceof SourceListModule);
		SourceListModule sourceListModel = (SourceListModule) module;
		
		assertEquals("sl1", module.getId());
		assertEquals(4, sourceListModel.getItemCount());
	}

	@Test
	public void cdataItems() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/module.ver2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		SourceListModule module = new SourceListModule();
		module.load(element, "", PAGE_VERSION);
		
		assertEquals(4, module.getItemCount());
		assertEquals("A", module.getItem(0));
	}

	@Test
	public void propertyItems() {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("source_list_items")).thenReturn("Items");

		SourceListModule module = new SourceListModule();
		
		boolean foundItemsProperty = false;
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			if(module.getProperty(i) instanceof IStringListProperty){
				IStringListProperty listProperty = (IStringListProperty) module.getProperty(i);
				foundItemsProperty = (listProperty.getName().equals("Items"));
			}
		}
		
		assertTrue(foundItemsProperty);
	}
	
	@Test
	public void propertyRemovable() throws SAXException, IOException {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("source_list_removable")).thenReturn("Removable");

		InputStream inputStream = getClass().getResourceAsStream("testdata/module2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		SourceListModule module = new SourceListModule();
		module.load(element, "", PAGE_VERSION);
		assertFalse(module.isRemovable());
		
		boolean foundProperty = false;
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			if(module.getProperty(i) instanceof IBooleanProperty){
				IBooleanProperty property = (IBooleanProperty) module.getProperty(i);
				if(property.getName().compareTo("Removable") == 0){
					foundProperty = true;
					break;
				}
			}
		}
		
		assertTrue(foundProperty);
	}
	
	@Test
	public void isVertical() throws SAXException, IOException {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("source_list_vertical")).thenReturn("Vertical");

		InputStream inputStream = getClass().getResourceAsStream("testdata/module.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		SourceListModule module = new SourceListModule();
		module.load(element, "", PAGE_VERSION);
		assertFalse(module.isVertical());

		for(int i = 0; i < module.getPropertyCount(); i++){
			
			if(module.getProperty(i) instanceof IBooleanProperty){
				IBooleanProperty property = (IBooleanProperty) module.getProperty(i);
				if(property.getName().compareTo("Vertical") == 0){
					property.setValue("True");
				}
			}
		}
		
		assertTrue(module.isVertical());
	}
}
