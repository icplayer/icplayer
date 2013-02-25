package com.lorepo.icplayer.client.module.api.player;

public interface IContent {

	public int	getPageCount();
	public IPage	getPage(int index);
	public IAddonDescriptor getAddonDescriptor(String addonId);
	
}
