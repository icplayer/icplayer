package com.lorepo.icplayer.client.module.api.player;

public interface ITimeService {

	public String getAsString();
	public Long getTotalTime();
	public Long getPageTimeById(String pageId);
	void loadFromString(String state);
	public void updateTimeForPages(IPage page1, IPage page2);
}
