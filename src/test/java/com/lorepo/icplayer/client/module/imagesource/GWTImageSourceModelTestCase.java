package com.lorepo.icplayer.client.module.imagesource;

import static org.junit.Assert.assertEquals;

import java.io.IOException;

import org.junit.Test;
import org.xml.sax.SAXException;

import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.module.mockup.ModuleFactoryMockup;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTImageSourceModelTestCase extends GwtTest {
	
	private static final String PAGE_VERSION = "2";
	
	@Test
	public void saveLoad() throws SAXException, IOException {
		
		ImageSourceModule module = new ImageSourceModule();
		ModuleFactoryMockup factory = new ModuleFactoryMockup(module);
		factory.produce("testdata/imagesource/module.xml", PAGE_VERSION);

		String xml = module.toXML();
		
		ImageSourceModule newmodule = new ImageSourceModule();
		ModuleFactoryMockup newfactory = new ModuleFactoryMockup(newmodule);
		newfactory.produceFromString(xml, Page.version);
		
		assertEquals("media/river.jpg", newmodule.getUrl());
	}
}
