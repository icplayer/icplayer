package com.lorepo.icplayer.client.module.image;

import static org.junit.Assert.assertEquals;

import java.io.IOException;

import org.junit.Test;
import org.xml.sax.SAXException;

import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.module.image.ImageModule.DisplayMode;
import com.lorepo.icplayer.client.module.mockup.ModuleFactoryMockup;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTImageModelTestCase extends GwtTest{
	private static final String PAGE_VERSION = "2";
	
	@Test
	public void saveLoad() throws SAXException, IOException {
		ImageModule module = new ImageModule();
		
		ModuleFactoryMockup moduleFactory = new ModuleFactoryMockup(module);
		moduleFactory.produce("testdata/image/module.xml", PAGE_VERSION);
		
		ImageModule newModule = new ImageModule();
		ModuleFactoryMockup newModuleFactory = new ModuleFactoryMockup(newModule);
		newModuleFactory.produceFromString(module.toXML(), Page.version);
		
		DisplayMode result = newModule.getDisplayMode();
		
		assertEquals(DisplayMode.keepAspect, result);
	}
}
