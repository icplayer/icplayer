package com.lorepo.icplayer.client.module;

import static org.junit.Assert.assertEquals;

import java.util.List;

import org.junit.Test;

public class ModuleUtilsTestCase {
	
	@Test
	public void emptyList() {
		String rawText = "";
		
		List<String> modules = ModuleUtils.getListFromRawText(rawText);
		
		assertEquals(0, modules.size());
	}
	
	@Test
	public void singleElementInList() {
		String rawText = "Text1";
		
		List<String> modules = ModuleUtils.getListFromRawText(rawText);
		
		assertEquals(1, modules.size());
		assertEquals("Text1", modules.get(0));
	}
	
	@Test
	public void multipleElementsInList() {
		String rawText = "Text1; Table1; Text 2";
		
		List<String> modules = ModuleUtils.getListFromRawText(rawText);
		
		assertEquals(3, modules.size());
		assertEquals("Text1", modules.get(0));
		assertEquals("Table1", modules.get(1));
		assertEquals("Text 2", modules.get(2));
	}
}
