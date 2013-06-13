package com.lorepo.icplayer.client.model;

import java.util.ArrayList;

import com.lorepo.icf.utils.i18n.DictionaryWrapper;



@SuppressWarnings("serial")
public class PageList extends ArrayList<Page> {

	private IPageListListener listener;
	
	
	public void addListener(IPageListListener l){
		this.listener = l;
	}
	
	
	@Override
	public boolean add(Page page){
		
		boolean result = super.add(page);
		
		if(listener != null){
			listener.onPageAdded(page);
		}
		
		return result;
	}

	
	public void insertBefore(int index, Page page){
		
		add(index, page);
		
		if(listener != null){
			listener.onPageAdded(page);
		}
	}

	
	@Override
	public Page remove(int index){
		
		Page page = super.remove(index);
		
		if(listener != null){
			listener.onPageRemoved(page);
		}
		
		return page;
	}

	
	@Override
	public boolean remove(Object page){
		
		int index = indexOf(page);
		
		if(index >= 0){
			remove(index);
			return true;
		}
		
		return false;
	}

	
	public int findPageIndexByName(String pageName) {

		int index = 0;
		String strippedSourceName = pageName.replaceAll("\\s+", "");
		for(Page page : this){
		
			String strippedName = page.getName().replaceAll("\\s+", "");
			if(strippedName.compareToIgnoreCase(strippedSourceName) == 0){
				return index;
			}
			index++;
		}
		
		return -1;
	}

	
	public String generateUniquePageName() {

		String pageName = "New page";
		
		for(int i = 1; i < 30; i++){
			pageName = DictionaryWrapper.get("page") + " " + i;
			if(findPageIndexByName(pageName) == -1){
				break;
			}
		}
		
		return pageName;
	}
	
}
