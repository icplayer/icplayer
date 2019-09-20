package com.lorepo.icplayer.client.module.text;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertFalse;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.io.InputStream;

import org.junit.Before;
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

    private static final String PAGE_VERSION = "2";

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
		module.load(element, "", PAGE_VERSION);
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
	public void givenTextModelWhenChangingCalculationStyleToOldStyleThenChangesThatProperty() {
		String propertyName = "name";
		String oldMethod = "old";
		String newMethod = "new";

		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get(TextModel.LONGEST_ANSWER_CALCULATION_STYLE)).thenReturn(newMethod);
		when(DictionaryWrapper.get(TextModel.ALL_CHARACTES_CALCULATION_STYLE)).thenReturn(oldMethod);
		when(DictionaryWrapper.get(TextModel.GAP_SIZE_CALCULATION_STYLE_LABEL)).thenReturn(propertyName);

		TextModel module = new TextModel();

		IProperty prop = module.getPropertyByName(propertyName);
		
		assertTrue(prop != null);
		
		prop.setValue(newMethod);
		assertFalse(module.isOldGapSizeCalculation());
		
		prop.setValue(oldMethod);
		assertTrue(module.isOldGapSizeCalculation());
	}
	
	@Test
	public void givenTextModelAndSameLabelsWhenChangingCalculationStyleToOldStyleThenAlwaysSetsOldMethod() {
		String propertyName = "name";
		String oldMethod = "SAME_LABEL";
		String newMethod = "SAME_LABEL";

		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get(TextModel.LONGEST_ANSWER_CALCULATION_STYLE)).thenReturn(newMethod);
		when(DictionaryWrapper.get(TextModel.ALL_CHARACTES_CALCULATION_STYLE)).thenReturn(oldMethod);
		when(DictionaryWrapper.get(TextModel.GAP_SIZE_CALCULATION_STYLE_LABEL)).thenReturn(propertyName);

		TextModel module = new TextModel();

		IProperty prop = module.getPropertyByName(propertyName);
		
		assertTrue(prop != null);
		assertTrue(module.isOldGapSizeCalculation());
		
		prop.setValue(newMethod);
		assertTrue(module.isOldGapSizeCalculation());
		
		prop.setValue(oldMethod);
		assertTrue(module.isOldGapSizeCalculation());
	}
	
	@Test
	public void givenTextModelAndDictionaryLackingKeysWhenChangingCalculationStyleToOldStyleThenAlwaysSetsOldMethod() {
		String propertyName = "name";
		String oldMethod = "LABEL";

		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get(TextModel.ALL_CHARACTES_CALCULATION_STYLE)).thenReturn(oldMethod);
		when(DictionaryWrapper.get(TextModel.GAP_SIZE_CALCULATION_STYLE_LABEL)).thenReturn(propertyName);

		TextModel module = new TextModel();

		IProperty prop = module.getPropertyByName(propertyName);
		
		assertTrue(prop != null);
		assertTrue(module.isOldGapSizeCalculation());
		
		prop.setValue("");
		assertTrue(module.isOldGapSizeCalculation());
		
		prop.setValue(oldMethod);
		assertTrue(module.isOldGapSizeCalculation());
	}
}
