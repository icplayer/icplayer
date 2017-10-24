package com.lorepo.icplayer.client.module.choice;

import static org.junit.Assert.assertEquals;

import java.io.IOException;

import org.junit.Test;
import org.xml.sax.SAXException;

import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.module.mockup.ModuleFactoryMockup;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTChoiceModelTestCase extends GwtTest {
	
	private static final String PAGE_VERSION = "2";
	
	@Test
	public void saveLoad() throws SAXException, IOException {
		ChoiceModel module = new ChoiceModel();
		ModuleFactoryMockup moduleFactory = new ModuleFactoryMockup(module);

		moduleFactory.produce("testdata/choice/choice1.xml", PAGE_VERSION);
		String oldText = module.getOption(0).getText();

		String xml = module.toXML();
		ChoiceModel newModule = new ChoiceModel();
		
		ModuleFactoryMockup newModuleFactory = new ModuleFactoryMockup(newModule);
		newModuleFactory.produceFromString(xml, Page.version);
		String newText = newModule.getOption(0).getText();
		
		assertEquals(oldText, newText);
	}
}
