package com.lorepo.icplayer.client.module;

import com.lorepo.icplayer.client.page.PageController;


public interface IWCAGModuleView {
	public void setWCAGStatus (boolean isWCAGOn);
	public void setPageController (PageController pc);
	public String getLang ();
}
