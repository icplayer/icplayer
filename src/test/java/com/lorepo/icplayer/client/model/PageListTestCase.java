package com.lorepo.icplayer.client.model;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.when;

import java.util.ArrayList;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.api.player.IChapter;
import com.lorepo.icplayer.client.module.api.player.IContentNode;


@RunWith(PowerMockRunner.class)
@PrepareForTest(DictionaryWrapper.class)
public class PageListTestCase {

	private IContentNode eventSource = null;
	
	
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
	
	@Test
	public void removePageByName() {
		PageList pages = new PageList();
		
		pages.add(new Page("Page 1", ""));
		pages.add(new Page("Page 2", ""));
		pages.add(new Page("Page 7", ""));
		pages.remove("Page 2");
		pages.remove("Page 12");
		
		assertEquals(2, pages.getTotalPageCount());
	}
	
	@Test
	public void movePage() {
		PageList pages = new PageList();
		
		pages.add(new Page("Page 1", ""));
		pages.add(new Page("Page 2", ""));
		pages.add(new Page("Page 7", ""));

		pages.movePage(0, 1);
		assertEquals("Page 2", pages.getAllPages().get(0).getName());
		assertEquals("Page 1", pages.getAllPages().get(1).getName());

		pages.movePage(1, 0);
		assertEquals("Page 1", pages.getAllPages().get(0).getName());
		assertEquals("Page 2", pages.getAllPages().get(1).getName());
	}
	
	@Test
	public void countOnlyPages() {
		PageList pages = new PageList();
		
		pages.add(new Page("Page 1", ""));
		pages.add(new Page("Page 2", ""));
		pages.add(new Page("Page 7", ""));
		pages.add(new PageList());

		assertEquals(3, pages.getTotalPageCount());
	}
	
	@Test
	public void countChapterPages() {
		PageList pages = new PageList();
		PageList chapter = new PageList();
		
		chapter.add(new Page("Page 1", ""));
		chapter.add(new Page("Page 2", ""));
		chapter.add(new Page("Page 7", ""));
		pages.add(chapter);

		assertEquals(3, pages.getTotalPageCount());
	}
	
	@Test
	public void getChapterPage() {
		PageList pages = new PageList();
		PageList chapter = new PageList();
		Page page1 = new Page("Page 1", ""); 
		Page page2 = new Page("Page 2", "");
		
		pages.add(page1);
		chapter.add(page2);
		chapter.add(new Page("Page 7", ""));
		pages.add(chapter);

		assertEquals(page1, pages.getAllPages().get(0));
		assertEquals(page2, pages.getAllPages().get(1));
	}
	
	@Test
	public void findChapterPageByName() {
		PageList pages = new PageList();
		PageList chapter = new PageList();
		Page page1 = new Page("Page 1", ""); 
		Page page2 = new Page("Page 2", "");
		
		pages.add(page1);
		chapter.add(page2);
		chapter.add(new Page("Page 7", ""));
		pages.add(chapter);

		assertEquals(1, pages.findPageIndexByName("Page 2"));
	}
	
	@Test
	public void removeChapterPageByName() {
		PageList pages = new PageList();
		PageList chapter = new PageList();
		Page page1 = new Page("Page 1", ""); 
		Page page2 = new Page("Page 2", "");
		
		pages.add(page1);
		chapter.add(page2);
		chapter.add(new Page("Page 7", ""));
		pages.add(chapter);

		assertTrue(pages.remove("Page 7"));
		assertEquals(2, pages.getAllPages().size());
	}
	
	@Test
	public void setSubsetPagesCorrectly(){
		ArrayList<Integer> subsetArray = new ArrayList<Integer>();
		subsetArray.add(Integer.valueOf(1));
		subsetArray.add(Integer.valueOf(2));
		subsetArray.add(Integer.valueOf(4));
		PageList pages = new PageList();
		Page page1 = new Page("Page 1", ""); 
		Page page2 = new Page("Page 2", "");
		Page page3 = new Page("Page 3", "");
		Page page4 = new Page("Page 4", "");
		Page page5 = new Page("Page 5", "");
		pages.add(page1);
		pages.add(page2);
		pages.add(page3);
		pages.add(page4);
		pages.add(page5);
		
		pages.setSubsetPages(subsetArray);
		
		assertEquals(3, pages.getTotalPageCount());
		assertEquals(0, pages.findPageIndexByName("Page 2"));
		assertEquals(1, pages.findPageIndexByName("Page 3"));
		assertEquals(2, pages.findPageIndexByName("Page 5"));
	}
	
	@Test
	public void setSubsetPagesOutOfRAnge(){
		ArrayList<Integer> subsetArray = new ArrayList<Integer>();
		subsetArray.add(Integer.valueOf(1));
		subsetArray.add(Integer.valueOf(2));
		subsetArray.add(Integer.valueOf(10));
		PageList pages = new PageList();
		Page page1 = new Page("Page 1", ""); 
		Page page2 = new Page("Page 2", "");
		Page page3 = new Page("Page 3", "");
		Page page4 = new Page("Page 4", "");
		Page page5 = new Page("Page 5", "");
		pages.add(page1);
		pages.add(page2);
		pages.add(page3);
		pages.add(page4);
		pages.add(page5);
		
		 try {
			 pages.setSubsetPages(subsetArray);
			 Assert.fail( "Should have thrown an exception." );
		    } 
		    catch (Exception e) {
		        assertEquals("Page index 10 is out of range", e.getMessage());
		    }        
	}
	
	@Test
	public void setSubsetPagesWithNegativeNumbers(){
		ArrayList<Integer> subsetArray = new ArrayList<Integer>();
		subsetArray.add(Integer.valueOf(-1));
		subsetArray.add(Integer.valueOf(2));
		PageList pages = new PageList();
		Page page1 = new Page("Page 1", ""); 
		Page page2 = new Page("Page 2", "");
		Page page3 = new Page("Page 3", "");
		Page page4 = new Page("Page 4", "");
		Page page5 = new Page("Page 5", "");
		pages.add(page1);
		pages.add(page2);
		pages.add(page3);
		pages.add(page4);
		pages.add(page5);
		
		 try {
			 pages.setSubsetPages(subsetArray);
			 Assert.fail( "Should have thrown an exception." );
		    } 
		    catch (Exception e) {
		        assertEquals("Page index -1 is out of range", e.getMessage());
		    }        
	}

	@Test
	public void nameProperty(){
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("name")).thenReturn("Name");

		PageList pages = new PageList();

		for(int i = 0; i < pages.getPropertyCount(); i++){
			IProperty property = pages.getProperty(i);
			if(property.getName().compareToIgnoreCase("name") == 0){
				property.setValue("New name");
			}
		}

		assertEquals("New name", pages.getName());
	}

	@Test
	public void namePropertyEvent(){
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("name")).thenReturn("Name");

		PageList pages = new PageList();
		pages.addListener(new IPageListListener() {
			public void onNodeRemoved(IContentNode node) {
			}
			public void onNodeMoved(IChapter source, int from, int to) {
			}
			public void onNodeAdded(IContentNode node) {
			}
			public void onChanged(IContentNode source) {
				eventSource = source;
			}
		});

		for(int i = 0; i < pages.getPropertyCount(); i++){
			IProperty property = pages.getProperty(i);
			if(property.getName().compareToIgnoreCase("name") == 0){
				property.setValue("New name");
			}
		}

		assertEquals(pages, eventSource);
	}
	
	@Test
	public void removeFromTree() {
		PageList pages = new PageList();
		
		
		pages.add(new Page("Page 1", ""));
		pages.add(new Page("Page 2", ""));
		pages.add(new Page("Page 7", ""));
		PageList chapter = new PageList("chapter");
		chapter.add(new Page("Page 12", ""));
		chapter.add(new Page("Page 17", ""));
		PageList chapter2 = new PageList("chapter2");
		chapter.add(chapter2);
		pages.add(chapter);
		assertEquals(3, chapter.size());

		pages.removeFromTree(chapter2);
		assertEquals(2, chapter.size());
	}
}
