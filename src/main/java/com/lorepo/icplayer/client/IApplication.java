package com.lorepo.icplayer.client;

import com.lorepo.icplayer.client.module.api.player.IPlayerServices;

public interface IApplication {

	void load(String url, int pageIndex);
	void setState(String state);
	String getState();
	IPlayerServices getPlayerServices();

}
