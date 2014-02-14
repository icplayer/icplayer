package com.lorepo.icplayer.client.module.api.player;



public interface IChapter extends IContentNode {
	public int size();
	public IContentNode get(int index);
}
