package com.lorepo.icplayer.client.model.page;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

import com.lorepo.icplayer.client.model.page.IPageListListener;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.model.page.PageList;
import com.lorepo.icplayer.client.module.api.player.IChapter;
import com.lorepo.icplayer.client.module.api.player.IContentNode;


public class PagesListenerTestCase {

	/**
	 * Inner klas do testowania otrzymywania eventów
	 */
	class PageListListener implements IPageListListener{

		protected boolean pageAddedCalled = false;
		protected boolean pageRemovedCalled = false;
		protected boolean pageMovedCalled = false;
		
		
		@Override
		public void onNodeAdded(IContentNode source) {
			pageAddedCalled = true;
		}

		@Override
		public void onNodeRemoved(IContentNode page, IChapter parent) {
			pageRemovedCalled = true;
		}

		@Override
		public void onNodeMoved(IChapter source, int from, int to) {
			pageMovedCalled = true;
		}

		@Override
		public void onChanged(IContentNode source) {
		}
		
	}
	
	
	@Test
	public void listenerOnPageAdded() {
		
		PageList pages = new PageList();
		PageListListener listener = new PageListListener();
		
		pages.addListener(listener);
		pages.add(new Page("Page 1", ""));
		
		assertTrue("Listener not called", listener.pageAddedCalled);
	}

	@Test
	public void listenerOnPageRemovedByIndex() {
		
		PageList pages = new PageList();
		Page page = new Page("Page", "");
		PageListListener listener = new PageListListener();
		
		pages.addListener(listener);
		
		pages.add(new Page("Page 1", ""));
		pages.add(new Page("Page 2", ""));
		pages.add(page);
		pages.add(new Page("Page 3", ""));
		
		pages.removePage(2);
		assertTrue("Listener not called", listener.pageRemovedCalled);
	}

	@Test
	public void listenerOnPageRemovedByObj() {
		
		PageList pages = new PageList();
		Page page = new Page("Page", "");
		PageListListener listener = new PageListListener();
		
		pages.addListener(listener);
		
		pages.add(new Page("Page 1", ""));
		pages.add(new Page("Page 2", ""));
		pages.add(page);
		pages.add(new Page("Page 3", ""));
		
		pages.remove(page);
		assertTrue("Listener not called", listener.pageRemovedCalled);
	}

	@Test
	public void listenerOnPageRemovedWrongIndex() {
		
		PageList pages = new PageList();
		Page page = new Page("Page", "");
		PageListListener listener = new PageListListener();
		
		pages.addListener(listener);
		
		pages.add(new Page("Page 1", ""));
		pages.add(new Page("Page 2", ""));
		pages.add(page);
		pages.add(new Page("Page 3", ""));
		
		try{
			pages.removePage(12);
		}
		catch(IndexOutOfBoundsException e){
			
		}
		
		assertFalse("Listener shouldn't be called", listener.pageRemovedCalled);
	}

	@Test
	public void listenerOnPageRemovedWrongObj() {
		
		PageList pages = new PageList();
		Page page = new Page("Page", "");
		PageListListener listener = new PageListListener();
		
		pages.addListener(listener);
		
		pages.add(new Page("Page 1", ""));
		pages.add(new Page("Page 2", ""));
		pages.add(new Page("Page 3", ""));
		
		pages.remove(page);
		assertFalse("Listener shouldn't be called", listener.pageRemovedCalled);
	}

}
