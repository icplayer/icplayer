package com.lorepo.icplayer.client.module.ordering;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;

import java.io.IOException;

import org.junit.Test;
import org.xml.sax.SAXException;

import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.module.mockup.ModuleFactoryMockup;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTOrderingModelTestCase extends GwtTest {
	
	private final String PAGE_VERSION = "2"; 
	
	@Test
	public void saveLoad() throws SAXException, IOException {
		OrderingModule module = new OrderingModule();
		ModuleFactoryMockup ft = new ModuleFactoryMockup(module);
		ft.produce("testdata/ordering/ordering2.xml", PAGE_VERSION);
		
		OrderingModule newModule = new OrderingModule();
		new ModuleFactoryMockup(newModule).produceFromString(module.toXML(), Page.version);
		
		String oldText = module.getItem(0).getText();
		String newText = newModule.getItem(0).getText();
		
		assertEquals(oldText, newText);
		assertFalse(newModule.isActivity());
	}
}
