package com.lorepo.icplayer.client.module.imagegap;

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
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.xml.page.parsers.PageParser_v1;

@RunWith(PowerMockRunner.class)
@PrepareForTest(DictionaryWrapper.class)
public class ImageGapModelTestCase {
	
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
		when(DictionaryWrapper.get("image_gap_module")).thenReturn("Image gap");

		ImageGapModule module = new ImageGapModule();
		assertEquals("Image gap", module.getModuleTypeName());
	}


	@Test
	public void loadFromPage() throws SAXException, IOException {
		Page page = new Page("Page 1", "");
		loadPage("testdata/page.xml", page);
		
		IModuleModel module = page.getModules().get(0);
		
		assertTrue(module instanceof ImageGapModule);
		ImageGapModule imageModel = (ImageGapModule) module;
		
		assertEquals("ig1", imageModel.getId());
		assertEquals("si1", imageModel.getAnswerId());
	}



	@Test
	public void propertyAnswerId() {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("image_gap_answer")).thenReturn("Answer&nbsp;ID");

		ImageGapModule module = new ImageGapModule();

		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i);
			if(property.getName().compareTo("Answer&nbsp;ID") == 0){
				property.setValue("test12");
			}
		}

		assertEquals("test12", module.getAnswerId());
	}

	@Test
	public void propertyisActivity() {
		
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("is_activity")).thenReturn("Is&nbsp;activity");

		ImageGapModule module = new ImageGapModule();
		boolean foundProperty = false;
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i);
			if(property.getName().compareTo("Is&nbsp;activity") == 0){
				foundProperty = true;
			}
		}

		assertTrue(foundProperty);
	}

	@Test
	public void events() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/module.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ImageGapModule module = new ImageGapModule();
		module.load(element, "", PAGE_VERSION);

		assertEquals("correct()", module.getEventCode("onCorrect"));
		assertEquals("wrong()", module.getEventCode("onWrong"));
		assertEquals("empty()", module.getEventCode("onEmpty"));
	}

	
	@Test
	public void eventPropertEmpty() throws SAXException, IOException {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("image_gap_on_empty")).thenReturn("onEmpty");
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/module.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ImageGapModule module = new ImageGapModule();
		module.load(element, "", PAGE_VERSION);

		String onEmpty = null;
		
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i);
			if(property.getName().compareTo(ImageGapModule.EVENT_EMPTY) == 0){
				onEmpty = property.getValue();
			}
		}

		assertEquals("empty()", onEmpty);
	}

	
	@Test
	public void eventPropertCorrect() throws SAXException, IOException {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("image_gap_on_correct")).thenReturn("onCorrect");
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/module.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ImageGapModule module = new ImageGapModule();
		module.load(element, "", PAGE_VERSION);

		String onCorrect = null;
		
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i);
			if(property.getName().compareTo(ImageGapModule.EVENT_CORRECT) == 0){
				onCorrect = property.getValue();
			}
		}

		assertEquals("correct()", onCorrect);
	}

	
	@Test
	public void eventPropertWrong() throws SAXException, IOException {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("image_gap_on_wrong")).thenReturn("onWrong");
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/module.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ImageGapModule module = new ImageGapModule();
		module.load(element, "", PAGE_VERSION);

		String onWrong = null;
		
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i);
			if(property.getName().compareTo(ImageGapModule.EVENT_WRONG) == 0){
				onWrong = property.getValue();
			}
		}

		assertEquals("wrong()", onWrong);
	}

	
	@Test
	public void eventPropertWrongNotNull() throws SAXException, IOException {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("image_gap_on_correct")).thenReturn("onCorrect");
		when(DictionaryWrapper.get("image_gap_on_wrong")).thenReturn("onWrong");
		when(DictionaryWrapper.get("image_gap_on_empty")).thenReturn("onEmpty");
		
		ImageGapModule module = new ImageGapModule();

		String onCorrect = null;
		String onWrong = null;
		String onEmpty = null;
		
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i);
			if(property.getName().compareTo(ImageGapModule.EVENT_CORRECT) == 0){
				onCorrect = property.getValue();
			}
			else if(property.getName().compareTo(ImageGapModule.EVENT_WRONG) == 0){
				onWrong = property.getValue();
			}
			else if(property.getName().compareTo(ImageGapModule.EVENT_EMPTY) == 0){
				onEmpty = property.getValue();
			}
		}

		assertEquals("", onCorrect);
		assertEquals("", onWrong);
		assertEquals("", onEmpty);
	}

	
	@Test
	public void multiAnswers() throws SAXException, IOException {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("image_gap_answer")).thenReturn("Answer&nbsp;ID");

		InputStream inputStream = getClass().getResourceAsStream("testdata/module2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ImageGapModule module = new ImageGapModule();
		module.load(element, "", PAGE_VERSION);

		String value = null;
		
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i);
			if(property.getName().compareTo("Answer&nbsp;ID") == 0){
				value = property.getValue();
				break;
			}
		}

		assertEquals("si1\nsi2", value);
	}

	
	@Test
	public void multiAnswersSave() throws SAXException, IOException {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("image_gap_answer")).thenReturn("Answer&nbsp;ID");

		InputStream inputStream = getClass().getResourceAsStream("testdata/module2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ImageGapModule module = new ImageGapModule();
		module.load(element, "", PAGE_VERSION);

		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i);
			if(property.getName().compareTo("Answer&nbsp;ID") == 0){
				property.setValue("abc\ndef");
				break;
			}
		}

		assertEquals("abc;def", module.getAnswerId());
	}

	
}
