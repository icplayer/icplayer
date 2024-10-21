package com.lorepo.icplayer.client.module.api.player;

import java.util.List;

public interface IPage extends IContentNode{

	@Override
	public String getName();
	public boolean isReportable();
	public String getBaseURL();
	public String getPreview();
	public String getPreviewLarge();
	public String getURL();
	public String getHref();
	public List<String> getModulesList();
	public void setPlayerServices(IPlayerServices ps);
	public int getPageWeight();
	public void setModulesMaxScore(int s);
	public int getModulesMaxScore();
	void setPageCustomWeight(int w);
	int getPageCustomWeight();
	void setPageWeight(int w);
	public void setAsReportable();
	public void setAsNonReportable();
	public void setContentBaseURL(String baseURL);
	public String getContentBaseURL();
}
