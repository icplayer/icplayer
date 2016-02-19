package com.lorepo.icplayer.client.module.shape;

import com.google.gwt.user.client.ui.AbsolutePanel;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.shape.ShapePresenter.IDisplay;

public class ShapeView extends AbsolutePanel implements IDisplay {
	public ShapeView(ShapeModule module, boolean isPreview){
		setStyleName("ic_shape");
		StyleUtils.applyInlineStyle(this, module);

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
<<<<<<< HEAD
	}
=======
	}	
>>>>>>> 1a4d29499a61b38702006c62b190961a45d12ba3
}
