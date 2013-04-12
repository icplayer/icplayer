package com.lorepo.icplayer.client.module.choice;

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
import com.lorepo.icf.properties.IHtmlProperty;
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
				IPropertyProvider propertyProvider = listProperty.getChild(0);
				for(int j = 0; j < propertyProvider.getPropertyCount(); j++){
					IProperty property = propertyProvider.getProperty(j); 
					if(propertyProvider.getProperty(j) instanceof IHtmlProperty){
						property.setValue("test");
						break;
					}
				}
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
		module.load(element, "");

		ChoiceOption option = module.getOption(0);
		
		assertEquals("Feedback 1", option.getFeedback());
	}

	@Test
	public void saveLoad() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/choice1.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ChoiceModel module = new ChoiceModel();
		module.load(element, "");
		String oldText = module.getOption(0).getText();

		String xml = module.toXML();
		element = xmlParser.parser(new StringInputStream(xml));
		module = new ChoiceModel();
		module.load(element, "");
		String newText = module.getOption(0).getText();
		
		assertEquals(oldText, newText);
	}

	@Test
	public void notDisabled() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/choice1.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ChoiceModel module = new ChoiceModel();
		module.load(element, "");

		assertFalse(module.isDisabled());
	}

	@Test
	public void isDisabled() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/choice2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ChoiceModel module = new ChoiceModel();
		module.load(element, "");
		String xml = module.toXML();
		element = xmlParser.parser(new StringInputStream(xml));
		module = new ChoiceModel();
		module.load(element, "");
		
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
		module.load(element, "");

		boolean foundProperty = false;
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i);
			if(property.getName().compareTo("Is&nbsp;disabled") == 0){
				foundProperty = true;
			}
		}

		assertTrue(foundProperty);
	}
}
