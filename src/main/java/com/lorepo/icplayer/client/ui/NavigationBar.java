package com.lorepo.icplayer.client.ui;

import com.google.gwt.user.client.Event.NativePreviewEvent;
import com.google.gwt.user.client.ui.PopupPanel;
import com.google.gwt.user.client.ui.Grid;
import com.google.gwt.user.client.Event;
import com.google.gwt.user.client.Window;
import com.google.gwt.event.dom.client.KeyCodes;
import com.lorepo.icplayer.client.IPlayerController;
import com.lorepo.icplayer.client.module.api.player.IContent;
import com.lorepo.icplayer.client.utils.widget.NavigationScrollBar;
import com.lorepo.icplayer.client.utils.widget.GoToPageIndexButton;

public class NavigationBar extends PopupPanel {
	
	public NavigationBar(IContent contentModel,
			final IPlayerController playerController) {
		super(true);

		String buttonLabel = "";
		String previewURL = null;

		setAutoHideEnabled(false);
		setModal(false);
		setGlassEnabled(false);

		setStyleName("ic_navi_panel_bar");

		int pageCount = contentModel.getPageCount();

		NavigationScrollBar scroll = new NavigationScrollBar(playerController,
				pageCount);

		Grid buttonGrid = new Grid(1, pageCount);
		buttonGrid.setStyleName("ic_navibar_grid_panel");
		buttonGrid.getElement().getStyle().setProperty("marginLeft", "auto");
		buttonGrid.getElement().getStyle().setProperty("marginRight", "auto");
		String baseUrl = contentModel.getPage(0).getBaseURL();
				
		for (int col = 0; col < pageCount; ++col) {

			previewURL = NavigationBarUtils.getPagePreviewURL(contentModel.getPage(col).getPreview(), baseUrl);
			
			buttonLabel = "";
			if (previewURL == null || previewURL == "" || previewURL.endsWith("/")) {
				buttonLabel += (col + 1);
			}
			
			GoToPageIndexButton goToPageButton = new GoToPageIndexButton(
					buttonLabel, col, playerController, previewURL);
			buttonGrid.setWidget(0, col, goToPageButton);
		}

		if (playerController.isBookMode()) {
			int bookInx = 0;
			if (playerController.hasCover()) {
				bookInx = 1;
			}
			for (int j = bookInx; j < pageCount; j++) {
				if (((j - bookInx) % 2) == 0) {
					buttonGrid.getCellFormatter().setStyleName(0, j,
							"ic_navibar_tableCell-right");
				} else {
					buttonGrid.getCellFormatter().setStyleName(0, j,
							"ic_navibar_tableCell-left");
				}
			}
		}

		if (Window.Navigator.getUserAgent().matches("(.*)Android(.*)")
				|| Window.Navigator.getUserAgent().matches("(.*)iPad(.*)")
				|| Window.Navigator.getUserAgent().matches("(.*)iPhone(.*)")) {
			scroll.setStyleName("ic_navibar_scroll_panel_mobile");
		}
		
		scroll.setWidget(buttonGrid);
		scroll.setActiveIcon();
		scroll.setScrollBarPosision();
		setWidget(scroll);
	}

	@Override
	public void show() {
		NavigationScrollBar scroll = (NavigationScrollBar) getWidget();
		scroll.setActiveIcon();
		super.show();
		scroll.setScrollBarPosision();
	}

	@Override
	protected void onPreviewNativeEvent(NativePreviewEvent event) {
		switch (event.getTypeInt()) {
		case Event.ONKEYDOWN:
			if (event.getNativeEvent().getKeyCode() == KeyCodes.KEY_ESCAPE) {
				hide();
			}
		}
	}
}
