package com.lorepo.icplayer.client.utils.widget;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.ui.PushButton;
import com.lorepo.icplayer.client.IPlayerController;

public class GoToPageIndexButton extends PushButton {

	public GoToPageIndexButton(final String label, final int index,
			final IPlayerController playerController, final String previewURL) {
		super(label);
		setStylePrimaryName("ic_navi_button");
		if (previewURL != null && previewURL != "")
		{
			getElement().getStyle().setProperty("backgroundImage",
					"url('" + previewURL + "')");
		}

		addClickHandler(new ClickHandler() {
			public void onClick(ClickEvent event) {
				event.stopPropagation();
				event.preventDefault();
				if (playerController.getCurrentPageIndex() != index) {
					playerController.switchToPage(index);
					playerController.getView().hideNavigationPanels();
				}
			}
		});
	}
	
}
