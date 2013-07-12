package com.lorepo.icplayer.client.module.api.player;

import com.google.gwt.user.client.ui.Widget;
import com.lorepo.icplayer.client.page.PageController.IPageDisplay;

public interface IPlayerView {

	Widget getAsWidget();
	void showWaitDialog();
	void hideWaitDialog();
	void showHeader();
	void showFooter();
	IPageDisplay getFooterView();
	IPageDisplay getHeaderView();
}
