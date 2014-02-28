package com.lorepo.icplayer.client.model;

import com.lorepo.icplayer.client.module.api.player.IChapter;
import com.lorepo.icplayer.client.module.api.player.IContentNode;



public interface IPageListListener {

	public void onNodeAdded(IContentNode node);
	public void onNodeRemoved(IContentNode node);
	public void onNodeMoved(IChapter source, int from, int to);
	public void onChanged(IContentNode source);
}
