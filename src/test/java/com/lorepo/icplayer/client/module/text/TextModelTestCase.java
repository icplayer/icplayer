package com.lorepo.icplayer.client.module.text;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.io.InputStream;

import org.apache.tools.ant.filters.StringInputStream;
import org.junit.Before;
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
import com.lorepo.icplayer.client.mockup.utils.DomElementManipulatorMockup;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;
import com.lorepo.icplayer.client.utils.DomElementManipulator;

@RunWith(PowerMockRunner.class)
@PrepareForTest({DictionaryWrapper.class, TextModel.class, TextParser.class})
public class TextModelTestCase {
	
	@Before
	public void setUp () throws Exception {
		PowerMockito.whenNew(DomElementManipulator.class).withArguments("span").thenReturn(new DomElementManipulatorMockup("span"));
		PowerMockito.whenNew(DomElementManipulator.class).withArguments("div").thenReturn(new DomElementManipulatorMockup("div"));
		PowerMockito.whenNew(DomElementManipulator.class).withArguments("input").thenReturn(new DomElementManipulatorMockup("input"));
	}

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
	@Ignore
	public void draggableGaps() throws Exception {
		PowerMockito.whenNew(DomElementManipulator.class).withArguments("span").thenReturn(new DomElementManipulatorMockup("span"));
		PowerMockito.whenNew(DomElementManipulator.class).withArguments("div").thenReturn(new DomElementManipulatorMockup("div"));
		PowerMockito.whenNew(DomElementManipulator.class).withArguments("input").thenReturn(new DomElementManipulatorMockup("input"));
		
		final String EXPECTED = "<span id='-3' class='ic_draggableGapEmpty'>";
		InputStream inputStream = getClass().getResourceAsStream("testdata/module-draggable.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		TextModel module = new TextModel();
		module.load(element, "");

		
		System.out.println(module.getParsedText());
		String text = module.getParsedText().replaceAll("id='[^-]+", "id='");
		int foundIndex = text.indexOf(EXPECTED);
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
		oldText = oldText.replaceAll("id='[^-]+", "id='");
		newText = newText.replaceAll("id='[^-]+", "id='");
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
	public void nonUnicodeText() throws SAXException, IOException {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("text_module_text")).thenReturn("Text");
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/module1.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		TextModel module = new TextModel();
		module.load(element, "");
		for(int i = 0; i < module.getPropertyCount(); i++){
			IProperty property = module.getProperty(i);
			if(property.getName().compareTo("Text") == 0){
				property.setValue("In chapter 6");
			}
		}
		
		String xml = module.toXML();
		element = xmlParser.parser(new StringInputStream(xml));
		module = new TextModel();
		module.load(element, "");

		assertEquals("In chapter 6", module.getParsedText());
	}
	
	
	@Test
	@Ignore
	public void changeDraggableProperty() throws SAXException, IOException {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("text_module_gap_type")).thenReturn("Gap type");

		final String EXPECTED = "<input id='-3' type='edit'";
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

		String text = module.getParsedText().replaceAll("id='[^-]+", "id='");
		int foundIndex = text.indexOf(EXPECTED);
		assertTrue(foundIndex > 0);
	}

	
	@Test
	public void changeGapWidthProperty() throws SAXException, IOException, Exception {
		PowerMockito.whenNew(DomElementManipulator.class).withArguments("span").thenReturn(new DomElementManipulatorMockup("span"));
		PowerMockito.whenNew(DomElementManipulator.class).withArguments("div").thenReturn(new DomElementManipulatorMockup("div"));
		PowerMockito.whenNew(DomElementManipulator.class).withArguments("input").thenReturn(new DomElementManipulatorMockup("input"));
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
	public void propertyKeepOriginalOrder() {
		
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("Keep_original_order")).thenReturn("Keep Original Order");

		TextModel module = new TextModel();

		boolean foundProperty = false;
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i);
			if(property.getName().compareTo("Keep Original Order") == 0){
				foundProperty = true;
			}
		}

		assertTrue(foundProperty);
	}
	
	
	@Test
	@Ignore
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
