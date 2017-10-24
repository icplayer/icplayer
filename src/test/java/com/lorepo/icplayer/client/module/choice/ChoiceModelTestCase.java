package com.lorepo.icplayer.client.module.choice;

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
import com.lorepo.icf.properties.IListProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.IPropertyListener;
import com.lorepo.icf.properties.IPropertyProvider;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;

@RunWith(PowerMockRunner.class)
@PrepareForTest(DictionaryWrapper.class)
public class ChoiceModelTestCase {

	private boolean eventReceived;
	private static final String PAGE_VERSION = "2";

	@Test
	public void moduleTypeName() {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("choice_module")).thenReturn("Choice");

		ChoiceModel module = new ChoiceModel();
		assertEquals("Choice", module.getModuleTypeName());
	}

	
	@Test
	public void propertyEvent() {
		ChoiceModel module = new ChoiceModel();
		
		eventReceived = false;
		module.addPropertyListener(new IPropertyListener() {
			
			@Override
			public void onPropertyChanged(IProperty source) {
				eventReceived = true;
			}
		});
		
		// Look for property "Option 1"
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			if(module.getProperty(i) instanceof IListProperty){
				IListProperty listProperty = (IListProperty) module.getProperty(i);
				listProperty.setValue("test");
				break;
			}
		}
		
		assertTrue(eventReceived);
	}

	@Test
	public void option3properties() {
		
		ChoiceModel module = new ChoiceModel();
		
		// Look for property "Option 1"
		IPropertyProvider propertyProvider = null;
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			if(module.getProperty(i) instanceof IListProperty){
				IListProperty listProperty = (IListProperty) module.getProperty(i);
				propertyProvider = listProperty.getChild(0);
			}
		}
		
		assertEquals(3, propertyProvider.getPropertyCount());
	}

	@Test
	public void setEvent() {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("choice_item_event")).thenReturn("Event");

		ChoiceModel module = new ChoiceModel();
		
		// Look for property "Option 1"
		ChoiceOption option = module.getOption(0);
		
		assertTrue(option.getFeedback().isEmpty());
		
		for(int j = 0; j < option.getPropertyCount(); j++){
			IProperty property = option.getProperty(j); 
			if(property.getName().compareTo("Event") == 0){
				property.setValue("test");
				break;
			}
		}
		
		assertEquals("test", option.getFeedback());
	}

	@Test
	public void scoreFromXML() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/choice1.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ChoiceModel module = new ChoiceModel();
		module.load(element, "", PAGE_VERSION);

		ChoiceOption option = module.getOption(0);
		
		assertEquals("Feedback 1", option.getFeedback());
	}



	@Test
	public void notDisabled() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/choice1.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ChoiceModel module = new ChoiceModel();
		module.load(element, "", PAGE_VERSION);

		assertFalse(module.isDisabled());
	}

	@Test
	public void isDisabled() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/choice2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ChoiceModel module = new ChoiceModel();
		module.load(element, "", PAGE_VERSION);
		
		assertTrue(module.isDisabled());
	}

	@Test
	public void propertyisDisabled() throws SAXException, IOException {
		
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("is_disabled")).thenReturn("Is&nbsp;disabled");

		InputStream inputStream = getClass().getResourceAsStream("testdata/choice1.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ChoiceModel module = new ChoiceModel();
		module.load(element, "", PAGE_VERSION);

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
	public void isActivity() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/choice2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ChoiceModel module = new ChoiceModel();
		module.load(element, "", PAGE_VERSION);
		
		assertFalse(module.isActivity());
	}
	
	@Test
	public void notActivity() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/choice1.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ChoiceModel module = new ChoiceModel();
		module.load(element, "", PAGE_VERSION);
		
		assertTrue(module.isActivity());
	}
	
	@Test
	public void propertyisActivity() {
		
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("is_activity")).thenReturn("Is&nbsp;activity");

		ChoiceModel module = new ChoiceModel();
		boolean foundProperty = false;
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i);
			if(property.getName().compareTo("Is&nbsp;activity") == 0){
				foundProperty = true;
			}
		}

		assertTrue(foundProperty);
	}
}
