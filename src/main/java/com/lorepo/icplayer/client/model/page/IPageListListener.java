package com.lorepo.icplayer.client.model.page;

import com.lorepo.icplayer.client.module.api.player.IChapter;
import com.lorepo.icplayer.client.module.api.player.IContentNode;



public interface IPageListListener {

	public void onNodeAdded(IContentNode node);
	public void onNodeRemoved(IContentNode node, IChapter parent);
	public void onNodeMoved(IChapter source, int from, int to);
	public void onChanged(IContentNode source);
}
