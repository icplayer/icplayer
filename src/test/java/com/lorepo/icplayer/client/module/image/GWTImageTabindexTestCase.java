package com.lorepo.icplayer.client.module.image;

import static org.junit.Assert.assertEquals;

import org.junit.Before;
import org.junit.Test;
import org.powermock.reflect.Whitebox;

import com.google.gwt.dom.client.Element;
import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;


@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTImageTabindexTestCase extends GwtTest {
	ImageModule module = null;
	ImageView view = null;
	
	@Before
	public void setUp() {
		this.module = new ImageModule();
	}
	
	@Test
	public void testShouldSetTabindexOfViewTo0() throws Exception {
		this.module.setIsTabindexEnabled(true);
		this.view = new ImageView(this.module, false);
		
		Element result = Whitebox.invokeMethod(this.view, "getElement");
		
		assertEquals(0, result.getTabIndex());
	}
}
