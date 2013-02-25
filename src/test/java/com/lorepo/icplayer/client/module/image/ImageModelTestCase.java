package com.lorepo.icplayer.client.module.image;

import static org.junit.Assert.assertEquals;
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
import com.lorepo.icplayer.client.module.image.ImageModule.DisplayMode;

@RunWith(PowerMockRunner.class)
@PrepareForTest(DictionaryWrapper.class)
public class ImageModelTestCase {

	@Test
	public void moduleTypeName() {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("image_module")).thenReturn("Image");

		ImageModule module = new ImageModule();
		assertEquals("Image", module.getModuleTypeName());
	}


	@Test
	public void saveLoad() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/module.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ImageModule module = new ImageModule();
		module.load(element, "");
		String xml = module.toXML();
		
		element = xmlParser.parser(new StringInputStream(xml));
		module = new ImageModule();
		module.load(element, "");
		
		assertEquals(DisplayMode.keepAspect, module.getDisplayMode());
	}
	
	
	@Test
	public void propertyMode() {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("mode_property")).thenReturn("Mode");

		ImageModule module = new ImageModule();

		String propertyValue = null;
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i);
			if(property.getName().compareTo("Mode") == 0){
				propertyValue = property.getValue();
			}
		}

		assertEquals("stretch", propertyValue);
	}
	
}
