package com.lorepo.icplayer.client.model;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.powermock.api.mockito.PowerMockito.doReturn;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.model.addon.AddonPropertyUtils;


@RunWith(PowerMockRunner.class)
@PrepareForTest({XMLUtils.class, DictionaryWrapper.class})
public class AddonPropertyUtilsTestCase {

	@Test
	public void testLoadDisplayNameFromDictionary() throws Exception {
		PowerMockito.spy(XMLUtils.class);
		doReturn(null).when(XMLUtils.class, "getAttributeAsString", null, "displayName");
		doReturn("label").when(XMLUtils.class, "getAttributeAsString", null, "nameLabel");
		
		PowerMockito.spy(DictionaryWrapper.class);
		doReturn("Property name").when(DictionaryWrapper.class, "get", "label");
		
		String displayName = AddonPropertyUtils.loadDisplayNameFromXML(null);
		
		assertEquals("Property name", displayName);
	}
	
	@Test
	public void testLoadDisplayNameFromAttribute() throws Exception {
		PowerMockito.spy(XMLUtils.class);
		doReturn("Property name from attribute").when(XMLUtils.class, "getAttributeAsString", null, "displayName");
		doReturn(null).when(XMLUtils.class, "getAttributeAsString", null, "nameLabel");
		
		String displayName = AddonPropertyUtils.loadDisplayNameFromXML(null);
		
		assertEquals("Property name from attribute", displayName);
	}
	
	@Test
	public void testLoadDisplayNameFromDictionaryOverridesAttribute() throws Exception {
		PowerMockito.spy(XMLUtils.class);
		doReturn("Property name from attribute").when(XMLUtils.class, "getAttributeAsString", null, "displayName");
		doReturn("label").when(XMLUtils.class, "getAttributeAsString", null, "nameLabel");
		
		PowerMockito.spy(DictionaryWrapper.class);
		doReturn("Property name from dictionary").when(DictionaryWrapper.class, "get", "label");
		
		String displayName = AddonPropertyUtils.loadDisplayNameFromXML(null);
		
		assertEquals("Property name from dictionary", displayName);
	}
	
	@Test
	public void testLoadDisplayNameWhenNoAttributePresent() throws Exception {
		PowerMockito.spy(XMLUtils.class);
		doReturn(null).when(XMLUtils.class, "getAttributeAsString", null, "displayName");
		doReturn(null).when(XMLUtils.class, "getAttributeAsString", null, "nameLabel");
		
		String displayName = AddonPropertyUtils.loadDisplayNameFromXML(null);
		
		assertNull(displayName);
	}
}
