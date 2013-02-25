package com.lorepo.icplayer.client.model;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

import com.lorepo.icplayer.client.model.IPageListListener;
import com.lorepo.icplayer.client.model.Page;
import com.lorepo.icplayer.client.model.PageList;


public class PagesListenerTestCase {

	/**
	 * Inner klas do testowania otrzymywania eventów
	 */
	class PageListListener implements IPageListListener{

		protected boolean pageAddedCalled = false;
		protected boolean pageRemovedCalled = false;
		protected boolean pageMovedCalled = false;
		
		
		@Override
		public void onPageAdded(Page source) {
			pageAddedCalled = true;
		}

		@Override
		public void onPageRemoved(Page page) {
			pageRemovedCalled = true;
		}

		@Override
		public void onPageMoved(int from, int to) {
			pageMovedCalled = true;
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
		
		pages.remove(2);
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
			pages.remove(12);
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
