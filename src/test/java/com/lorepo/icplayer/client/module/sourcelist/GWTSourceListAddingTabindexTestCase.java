package com.lorepo.icplayer.client.module.sourcelist;

import java.util.ArrayList;
import java.util.HashMap;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.powermock.reflect.Whitebox;

import com.google.gwt.dom.client.Element;
import com.google.gwt.user.client.ui.Label;
import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;

import static org.junit.Assert.assertEquals;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTSourceListAddingTabindexTestCase extends GwtTest {
	private SourceListModule sourceListModule = null;
	private SourceListView sourceListView = null;
	
	@Before
	public void setUp() {
		this.sourceListModule = Mockito.mock(SourceListModule.class);
		this.sourceListView = new SourceListView(this.sourceListModule, true);		
	}
	
	@Test
	public void ifTabindexEnabledAddAttributeToItemView() {
		Mockito.when(this.sourceListModule.isTabindexEnabled()).thenReturn(true);
		
		final String itemId = "Item";
		this.sourceListView.addItem(itemId, "Test", false);
		Element element = this.sourceListView.getItem(itemId);
		
		int returnedValue = element.getTabIndex();		
		int expectedValue = 0;
		
		assertEquals(expectedValue, returnedValue);
	}
}
