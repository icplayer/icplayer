package com.lorepo.icplayer.client.model;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.when;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.model.Page;
import com.lorepo.icplayer.client.model.PageList;


@RunWith(PowerMockRunner.class)
@PrepareForTest(DictionaryWrapper.class)
public class PageListTestCase {

	@Test
	public void indexByName() {
		
		PageList pages = new PageList();
		Page page = new Page("Cells, Tissues and Organs", "");
		int index;
		
		pages.add(new Page("Page 1", ""));
		pages.add(new Page("Page 2", ""));
		pages.add(page);
		pages.add(new Page("Page 3", ""));
		
		index = pages.findPageIndexByName("Cells, Tissues and Organs");
		
		assertEquals(2, index);
	}
	
	@Test
	public void indexByNameIgnoreWhiteChars() {
		
		PageList pages = new PageList();
		Page page = new Page("Cells, Tissues and Organs", "");
		int index;
		
		pages.add(new Page("Page 1", ""));
		pages.add(new Page("Page 2", ""));
		pages.add(page);
		pages.add(new Page("Page 3", ""));
		
		index = pages.findPageIndexByName("Cells,\n Tissues\tand Organs ");
		
		assertEquals(2, index);
	}
	
	@Test
	public void indexByNameIgnoreCase() {
		
		PageList pages = new PageList();
		Page page = new Page("Page", "");
		int index;
		
		pages.add(new Page("Page 1", ""));
		pages.add(new Page("Page 2", ""));
		pages.add(page);
		pages.add(new Page("Page 3", ""));
		
		index = pages.findPageIndexByName("page");
		
		assertEquals(2, index);
	}
	
	@Test
	public void generateUniquePageName() {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("page")).thenReturn("Page");
		PageList pages = new PageList();
		
		pages.add(new Page("Page 1", ""));
		pages.add(new Page("Page 2", ""));
		pages.add(new Page("Page 7", ""));
		
		String name = pages.generateUniquePageName();
		
		assertEquals("Page 3", name);
	}
	
}
