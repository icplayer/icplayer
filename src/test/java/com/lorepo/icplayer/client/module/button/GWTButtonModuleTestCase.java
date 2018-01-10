package com.lorepo.icplayer.client.module.button;

import static org.junit.Assert.assertTrue;



import org.junit.Test;

import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTButtonModuleTestCase extends GwtTest{
	
	@Test
	public void toXML() {
		ButtonModule module = new ButtonModule();
		module.setLeft(1);
		module.setTop(2);
		module.setWidth(3);
		module.setHeight(4);
		module.setType("nextPage");
		
		String xml = module.toXML();
		
		String expected = "<buttonModule id=\"" + module.getId() + "\"";
		assertTrue(xml.startsWith(expected));
	}

}
