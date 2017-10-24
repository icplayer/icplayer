package com.lorepo.icplayer.client.module.imagegap;

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
public class GWTImageGapModelTestCase extends GwtTest {
	private static final String PAGE_VERSION = "2";

	@Test
	public void saveLoad() throws SAXException, IOException {
		ImageGapModule module = new ImageGapModule();
		ModuleFactoryMockup moduleFactory = new ModuleFactoryMockup(module);
		moduleFactory.produce("testdata/imagegap/module-no-activity.xml", PAGE_VERSION);
		
		String xml = module.toXML();

		ImageGapModule newModule = new ImageGapModule();
		ModuleFactoryMockup newModuleFactory = new ModuleFactoryMockup(newModule);
		newModuleFactory.produceFromString(xml, Page.version);

		assertEquals("si1", newModule.getAnswerId());
		assertFalse(newModule.isActivity());
	}
}
