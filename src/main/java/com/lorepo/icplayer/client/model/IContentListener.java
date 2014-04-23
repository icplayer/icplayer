package com.lorepo.icplayer.client.model;

import com.lorepo.icplayer.client.module.api.player.IChapter;
import com.lorepo.icplayer.client.module.api.player.IContentNode;


/**
 * Interface implemented by view to listen to changes in content model
 * 
 * @author Krzysztof Langner
 *
 */
public interface IContentListener {

	void onAddPage(IContentNode node);
	void onRemovePage(IContentNode node, IChapter parent);
	void onPageMoved(IChapter source, int from, int to);
	void onChanged(IContentNode source);
}
