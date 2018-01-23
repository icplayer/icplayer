package com.lorepo.icplayer.client.module;

import com.lorepo.icplayer.client.page.PageController;


public interface IWCAGModuleView {
	public void setPageController (PageController pc);
	public void setWCAGStatus (boolean isWCAGOn);
	public String getLang ();
}
