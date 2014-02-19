package com.lorepo.icplayer.client.model;


/**
 * Interface implemented by view to listen to changes in content model
 * 
 * @author Krzysztof Langner
 *
 */
public interface IContentListener {

	void onAddPage(Page page);
	void onRemovePage(Page page);
	void onPageMoved(int from, int to);
}
