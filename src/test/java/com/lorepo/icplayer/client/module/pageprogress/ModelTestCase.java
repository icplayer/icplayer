package com.lorepo.icplayer.client.module.pageprogress;

import static org.junit.Assert.assertEquals;

import java.io.IOException;

import org.junit.Before;
import org.junit.Test;
import org.xml.sax.SAXException;

import com.lorepo.icplayer.client.module.mockup.ModuleFactoryMockup;

public class ModelTestCase {
	PageProgressModule module = null;
	private final String PAGE_VERSION = "2";
	
	@Before
	public void setUp () {
		this.module = new PageProgressModule();
	}
	
	@Test
	public void testLoadingXMLWillSetCorrectValue () throws SAXException, IOException {
		ModuleFactoryMockup moduleFactory = new ModuleFactoryMockup(this.module);
		moduleFactory.produce("testdata/pageprogress/module.xml", PAGE_VERSION);
		
		assertEquals("", this.module.getRawWorksWith());
	}
}
