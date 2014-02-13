package com.lorepo.icplayer.client.module.api.player;

public interface IPage extends IContentNode{

	public String getName();
	public boolean isReportable();
	public String getBaseURL();
	public String getPreview();
	public String getURL();
	public String getId();
	public String getHref();
}
