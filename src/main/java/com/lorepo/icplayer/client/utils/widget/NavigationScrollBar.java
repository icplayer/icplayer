package com.lorepo.icplayer.client.utils.widget;

import com.google.gwt.user.client.ui.Grid;
import com.google.gwt.user.client.ui.ScrollPanel;
import com.lorepo.icplayer.client.IPlayerController;

public class NavigationScrollBar extends ScrollPanel {

	private float maxPosition = 0;
	private int pageCount = 0;
	int currentPageIndex = 0;
	private IPlayerController playerController;

	public NavigationScrollBar(IPlayerController pController, int pCount) {
		super();
		playerController = pController;
		pageCount = pCount;
		setStyleName("ic_navibar_scroll_panel");
	}

	public void setScrollBarPosision() {
		currentPageIndex = playerController.getCurrentPageIndex();
		if (currentPageIndex > 0) currentPageIndex++;
		maxPosition = getMaximumHorizontalScrollPosition();
		int position = (int) ((float) currentPageIndex / (float) pageCount * (float) maxPosition);
		setHorizontalScrollPosition(position);
	}

	public void setActiveIcon() {
		currentPageIndex = playerController.getCurrentPageIndex();
		Grid contentTable = (Grid) getWidget();
		String inactiveOpacity = "inactive";
		String activeOpacity = "active";

		for (int i = 0; i < pageCount; i++) {
			contentTable.getWidget(0, i)
					.removeStyleDependentName(activeOpacity);
			contentTable.getWidget(0, i).addStyleDependentName(inactiveOpacity);
		}
		contentTable.getWidget(0, currentPageIndex).removeStyleDependentName(inactiveOpacity);
		contentTable.getWidget(0, currentPageIndex).addStyleDependentName(activeOpacity);
		
		if (playerController.isBookMode()) {
			if (playerController.hasCover()) {
				if (currentPageIndex > 0) {
					if ((currentPageIndex % 2) == 0) {
						contentTable.getWidget(0, currentPageIndex - 1)
								.removeStyleDependentName(inactiveOpacity);
						contentTable.getWidget(0, currentPageIndex - 1)
								.addStyleDependentName(activeOpacity);
					} else {
						contentTable.getWidget(0, currentPageIndex + 1)
								.removeStyleDependentName(inactiveOpacity);
						contentTable.getWidget(0, currentPageIndex + 1)
								.addStyleDependentName(activeOpacity);
					}
				}
			} 
			else if (((currentPageIndex) % 2) == 0) {
				contentTable.getWidget(0, currentPageIndex + 1)
						.removeStyleDependentName(inactiveOpacity);
				contentTable.getWidget(0, currentPageIndex + 1).addStyleDependentName(
						activeOpacity);
			} else {
				contentTable.getWidget(0, currentPageIndex - 1)
						.removeStyleDependentName(inactiveOpacity);
				contentTable.getWidget(0, currentPageIndex - 1).addStyleDependentName(
						activeOpacity);
			}
		}
	}
}
