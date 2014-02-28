package com.lorepo.icplayer.client.module.api.player;



public interface IChapter extends IContentNode {
	boolean add(IContentNode node);
	public IContentNode get(int index);
	public int size();
}
