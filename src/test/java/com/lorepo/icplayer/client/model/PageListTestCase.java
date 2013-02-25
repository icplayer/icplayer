package com.lorepo.icplayer.client.model;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

import com.lorepo.icplayer.client.model.Page;
import com.lorepo.icplayer.client.model.PageList;


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
		
		PageList pages = new PageList();
		
		pages.add(new Page("Page 1", ""));
		pages.add(new Page("Page 2", ""));
		pages.add(new Page("Page 7", ""));
		
		String name = pages.generateUniquePageName();
		
		assertEquals("Page 3", name);
	}
	
}
