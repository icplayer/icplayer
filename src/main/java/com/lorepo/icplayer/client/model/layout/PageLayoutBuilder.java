package com.lorepo.icplayer.client.model.layout;

import com.lorepo.icplayer.client.model.layout.PageLayout.PageLayoutTypes;

public interface PageLayoutBuilder {
	public void setName(String name);
	public void setTreshold(int value);
	public void setType(PageLayoutTypes type);
	public void setCssID(String styleID);
}
