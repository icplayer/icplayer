package com.lorepo.icplayer.client.module.text;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.io.InputStream;

import org.apache.tools.ant.filters.StringInputStream;
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
public class TextModelTestCase {

	@Test
	public void moduleTypeName() {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("text_module")).thenReturn("Text");

		TextModel module = new TextModel();
		assertEquals("Text", module.getModuleTypeName());
	}

	
	@Test
	public void propertyItems() {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("text_module_text")).thenReturn("Text");

		final String SAMPLE_TEXT = "Sample text";
		TextModel module = new TextModel();
		
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i);
			if(property.getName().compareTo("Text") == 0){
				property.setValue(SAMPLE_TEXT);
			}
		}

		assertEquals(SAMPLE_TEXT, module.getParsedText());
	}
	

	@Test
	public void propertyDraggableGaps() {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("text_module_gap_type")).thenReturn("Gap type");

		TextModel module = new TextModel();

		boolean foundProperty = false;
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i);
			if(property.getName().compareTo("Gap type") == 0){
				foundProperty = true;
			}
		}

		assertTrue(foundProperty);
	}

	
	@Test
	public void draggableGaps() throws SAXException, IOException {
		
		final String EXPECTED = "<span id='text-3' class='ic_draggableGapEmpty'>";
		InputStream inputStream = getClass().getResourceAsStream("testdata/module-draggable.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		TextModel module = new TextModel();
		module.load(element, "");

		int foundIndex = module.getParsedText().indexOf(EXPECTED);
		assertTrue(foundIndex > 0);
	}
	
	@Test
	public void saveLoad() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/module-draggable.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		TextModel module = new TextModel();
		module.load(element, "");
		String oldText = module.getParsedText();
		
		String xml = module.toXML();
		element = xmlParser.parser(new StringInputStream(xml));
		module = new TextModel();
		module.load(element, "");
		String newText = module.getParsedText();

		assertTrue(module.hasDraggableGaps());
		assertEquals(100, module.getGapWidth());
		assertFalse(module.isActivity());
		assertTrue(module.isCaseSensitive());
		assertEquals(oldText, newText);
	}
	
	@Test
	public void saveLoadModule1() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/module1.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		TextModel module = new TextModel();
		module.load(element, "");
		
		String xml = module.toXML();
		element = xmlParser.parser(new StringInputStream(xml));
		module = new TextModel();
		module.load(element, "");

		assertTrue(module.isDisabled());
		assertFalse(module.isIgnorePunctuation());
	}
	
	@Test
	public void saveLoadModule2() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/module2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		TextModel module = new TextModel();
		module.load(element, "");
		
		String xml = module.toXML();
		element = xmlParser.parser(new StringInputStream(xml));
		module = new TextModel();
		module.load(element, "");

		assertTrue(module.isIgnorePunctuation());
	}
	
	@Test
	public void changeDraggableProperty() throws SAXException, IOException {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("text_module_gap_type")).thenReturn("Gap type");

		final String EXPECTED = "<input id='text-3' type='edit'";
		InputStream inputStream = getClass().getResourceAsStream("testdata/module-draggable.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		TextModel module = new TextModel();
		module.load(element, "");

		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i);
			if(property.getName().compareTo("Gap type") == 0){
				property.setValue("Editable");
			}
		}

		int foundIndex = module.getParsedText().indexOf(EXPECTED);
		assertTrue(foundIndex > 0);
	}

	
	@Test
	public void changeGapWidthProperty() throws SAXException, IOException {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("text_module_gap_width")).thenReturn("Gap width");
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/module-draggable.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		TextModel module = new TextModel();
		module.load(element, "");
		boolean found = false;

		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i);
			if(property.getName().compareTo("Gap width") == 0){
				found = true;
			}
		}

		assertTrue(found);
	}

	@Test
	public void propertyisActivity() {
		
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("is_activity")).thenReturn("Is&nbsp;activity");

		TextModel module = new TextModel();
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
	public void propertyisDisabled() {
		
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("is_disabled")).thenReturn("Is&nbsp;disabled");

		TextModel module = new TextModel();

		boolean foundProperty = false;
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i);
			if(property.getName().compareTo("Is&nbsp;disabled") == 0){
				foundProperty = true;
			}
		}

		assertTrue(foundProperty);
	}
	

	@Test
	public void propertyisCaseSensitive() {
		
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("case_sensitive")).thenReturn("Case&nbsp;sensitive");

		TextModel module = new TextModel();

		boolean foundProperty = false;
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i);
			if(property.getName().compareTo("Case&nbsp;sensitive") == 0){
				foundProperty = true;
			}
		}

		assertTrue(foundProperty);
	}
	

	@Test
	public void propertyisIgnorePunctuation() {
		
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("Ignore_punctuation")).thenReturn("Ignore punctuation");

		TextModel module = new TextModel();

		boolean foundProperty = false;
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i);
			if(property.getName().compareTo("Ignore punctuation") == 0){
				foundProperty = true;
			}
		}

		assertTrue(foundProperty);
	}
	
	
	@Test
	public void math() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/module3.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		TextModel module = new TextModel();
		module.load(element, "");

		InlineChoiceInfo choice = module.getChoiceInfos().get(0);
		
		assertEquals("<", choice.getAnswer());
	}
}
