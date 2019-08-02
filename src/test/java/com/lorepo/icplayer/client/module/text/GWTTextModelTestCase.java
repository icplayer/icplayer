package com.lorepo.icplayer.client.module.text;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashSet;
import java.util.Set;
import org.apache.commons.lang.StringUtils;
import org.apache.tools.ant.filters.StringInputStream;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.powermock.reflect.Whitebox;
import org.xml.sax.SAXException;

import com.google.gwt.i18n.client.Dictionary;
import com.google.gwt.xml.client.Element;
import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;
import com.lorepo.icplayer.client.module.text.InlineChoiceInfo;
import com.lorepo.icplayer.client.module.text.TextModel;


@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTTextModelTestCase extends GwtTest {

	private static final String PAGE_VERSION = "2";

	@Before
	public void setUp () {
		Dictionary dictMock = Mockito.mock(Dictionary.class);
		when(dictMock.get("text_module_text")).thenReturn("Text");
		when(dictMock.get("text_module_gap_type")).thenReturn("Gap type");

		Set<String> keySet = new HashSet<String>();
		keySet.add("text_module_text");
		keySet.add("text_module_gap_type");

		when(dictMock.keySet()).thenReturn(keySet);
		
		Whitebox.setInternalState(DictionaryWrapper.class, "dictionary", dictMock);
		Whitebox.setInternalState(DictionaryWrapper.class, "cachedKeySet", dictMock.keySet());
	}

	@Test
	public void propertyDraggableGaps() {
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
	public void saveLoadModule1() throws SAXException, IOException {

		InputStream inputStream = getClass().getResourceAsStream("testdata/module1.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);

		TextModel module = new TextModel();
		module.load(element, "", PAGE_VERSION);

		String xml = module.toXML();
		element = xmlParser.parser(new StringInputStream(xml));
		module = new TextModel();
		module.load(element, "", PAGE_VERSION);

		assertTrue(module.isDisabled());
		assertFalse(module.isIgnorePunctuation());
	}

	@Test
	public void saveLoadModule2() throws SAXException, IOException {

		InputStream inputStream = getClass().getResourceAsStream("testdata/module2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);

		TextModel module = new TextModel();
		module.load(element, "", PAGE_VERSION);

		String xml = module.toXML();
		element = xmlParser.parser(new StringInputStream(xml));
		module = new TextModel();
		module.load(element, "", PAGE_VERSION);

		assertTrue(module.isIgnorePunctuation());
	}

	@Test
	public void nonUnicodeText() throws SAXException, IOException {
		InputStream inputStream = getClass().getResourceAsStream("testdata/module1.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);

		TextModel module = new TextModel();
		module.load(element, "", PAGE_VERSION);
		for(int i = 0; i < module.getPropertyCount(); i++){
			IProperty property = module.getProperty(i);
			if(property.getName().compareTo("Text") == 0){
				property.setValue("In chapter 6");
			}
		}

		String xml = module.toXML();
		element = xmlParser.parser(new StringInputStream(xml));
		module = new TextModel();
		module.load(element, "", PAGE_VERSION);

		assertEquals("In chapter 6", module.getParsedText());
	}

	@Test
	public void changeDraggableProperty() throws SAXException, IOException {
		final String EXPECTED = "<input id=\"-3\" type=\"edit\"";
		InputStream inputStream = getClass().getResourceAsStream("testdata/module-draggable.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		TextModel module = new TextModel();
		module.load(element, "", PAGE_VERSION);

		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i);
			if(property.getName().compareTo("Gap type") == 0){
				property.setValue("Editable");
			}
		}
		
		String text = module.getParsedText().replaceAll("id=\"[^-]+", "id=\"");
		int foundIndex = text.indexOf(EXPECTED);
		assertTrue(foundIndex > 0);
	}

	
	@Test
	public void math() throws SAXException, IOException {
		InputStream inputStream = getClass().getResourceAsStream("testdata/module3.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		TextModel module = new TextModel();
		module.load(element, "", PAGE_VERSION);

		InlineChoiceInfo choice = module.getChoiceInfos().get(0);
		
		assertEquals("<", choice.getAnswer());
	}
	
	@Test
	public void apostropheInGapDefinitionShouldntEscapeHTML() throws SAXException, IOException {
		InputStream inputStream = getClass().getResourceAsStream("testdata/moduleWithApostrophe.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		TextModel module = new TextModel();
		module.load(element, "", PAGE_VERSION);

		String EXPECTED_STRING = "type=\"edit\" data-gap=\"editable\" size=\"6\" class=\"ic_gap\"";
		int index = module.getParsedText().indexOf(EXPECTED_STRING);
		assertTrue(index > 0);
		EXPECTED_STRING = "type=\"edit\" data-gap=\"editable\" size=\"5\" class=\"ic_gap\">";
		index = module.getParsedText().indexOf(EXPECTED_STRING);
		assertTrue(index > 0);
		
		int count = StringUtils.countMatches(module.getParsedText(), EXPECTED_STRING);
		assertTrue (count == 4);
	}
	
	@Test
	public void ampInGapDefinitionShouldBeEscapedToQuot() throws SAXException, IOException {
		InputStream inputStream = getClass().getResourceAsStream("testdata/moduleWithAmp.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		TextModel module = new TextModel();
		module.load(element, "", PAGE_VERSION);
		
		String EXPECTED_STRING = "<option value=\"-\">---</option><option value=\"&quot;Volvo&quot;\" aria-label=\"&quot;Volvo&quot;\">\"Volvo\"</option><option value=\"option 2\" aria-label=\"option 2\">option 2</option><option value=\"option 3\" aria-label=\"option 3\">option 3</option></select>";
		int index = module.getParsedText().indexOf(EXPECTED_STRING);
		assertTrue(index > 0);
		
		EXPECTED_STRING = "type=\"edit\" data-gap=\"editable\" size=\"5\" class=\"ic_gap\">";
		index = module.getParsedText().indexOf(EXPECTED_STRING);
		assertTrue(index > 0);
		
		int count = StringUtils.countMatches(module.getParsedText(), EXPECTED_STRING);
		assertTrue (count == 4);
	}

	@Test
	public void saveLoad() throws SAXException, IOException {
		InputStream inputStream = getClass().getResourceAsStream("testdata/module-draggable.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);

		TextModel module = new TextModel();
		module.load(element, "", PAGE_VERSION);
		String oldText = module.getParsedText();

		String xml = module.toXML();
		Element newElement = xmlParser.parser(new StringInputStream(xml));

		TextModel newModule = new TextModel();
		newModule.load(newElement, "", PAGE_VERSION);
		String newText = newModule.getParsedText();

		assertTrue(module.hasDraggableGaps());
		assertEquals(100, module.getGapWidth());
		assertFalse(module.isActivity());
		assertTrue(module.isCaseSensitive());
		oldText = oldText.replaceAll("id=\"[^-]+", "id=\"");
		newText = newText.replaceAll("id=\"[^-]+", "id=\"");

		assertEquals(oldText, newText);
	}
	
	@Test
	public void givenOldModelWhenCheckingOldGapSizeCalculationStyleThenReturnsTrue() throws SAXException, IOException {

		InputStream inputStream = getClass().getResourceAsStream("testdata/module2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);

		TextModel module = new TextModel();
		module.load(element, "", PAGE_VERSION);

		assertTrue(module.isOldGapSizeCalculation());
	}
	
	@Test
	public void givenTextModelWhenLoadingOlderModelAndCheckingCalculationStyleThenReturnsTrue() throws SAXException, IOException {

		InputStream inputStream = getClass().getResourceAsStream("testdata/module2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);

		TextModel module = new TextModel();
		module.load(element, "", PAGE_VERSION);

		assertTrue(module.isOldGapSizeCalculation());
	}
	
	@Test
	public void givenNewModelWithNewGapSizeCalculationWhenCheckingOldGapSizeCalculationStyleThenReturnsFalse() throws SAXException, IOException {

		InputStream inputStream = getClass().getResourceAsStream("testdata/module5WithOldCalculationStyle.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);

		TextModel module = new TextModel();
		module.load(element, "", PAGE_VERSION);

		assertTrue(module.isOldGapSizeCalculation());
	}
}
