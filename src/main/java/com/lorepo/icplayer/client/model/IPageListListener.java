package com.lorepo.icplayer.client.model;



public interface IPageListListener {

	public void onPageAdded(Page page);
	public void onPageRemoved(Page page);
	public void onPageMoved(int from, int to);
}
