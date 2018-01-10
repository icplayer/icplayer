package com.lorepo.icplayer.client.module.sourcelist;

import static org.junit.Assert.assertEquals;

import java.io.IOException;

import org.junit.Test;
import org.xml.sax.SAXException;

import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.module.mockup.ModuleFactoryMockup;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTSourceListModelTestCase extends GwtTest {
	private final String PAGE_VERSION = "2";
	
	@Test
	public void saveLoad() throws SAXException, IOException {
		
		SourceListModule module = new SourceListModule();
		new ModuleFactoryMockup(module).produce("testdata/sourcelist/module.xml", PAGE_VERSION);
		
		String xml = module.toXML();

		SourceListModule newModule = new SourceListModule();
		new ModuleFactoryMockup(newModule).produceFromString(xml, Page.version);
		
		assertEquals(4, newModule.getItemCount());
	}
}
