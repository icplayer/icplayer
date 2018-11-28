package com.lorepo.icplayer.client.module.shape;

import com.google.gwt.user.client.ui.AbsolutePanel;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.shape.ShapePresenter.IDisplay;

public class ShapeView extends AbsolutePanel implements IDisplay {
	
	String originalDisplay = "";
	
	public ShapeView(ShapeModule module, boolean isPreview){
		setStyleName("ic_shape");
		StyleUtils.applyInlineStyle(this, module);
		originalDisplay = getElement().getStyle().getDisplay();
		if (!isPreview) {
			setVisible(module.isVisible());
		}

		getElement().setId(module.getId());
	}

	@Override
	public void hide() {
		setVisible(false);
	}

	@Override
	public void show() {
		setVisible(true);
	}

	@Override
	public String getName() {
		return "Shape";
	}
	
	@Override
	public void setVisible(boolean visible) {
		if (visible) {
			super.setVisible(true);
			getElement().getStyle().setProperty("display", originalDisplay);	
		} else {
			super.setVisible(false);
		}
	}
}
