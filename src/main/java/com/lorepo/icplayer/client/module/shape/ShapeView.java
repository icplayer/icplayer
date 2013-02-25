package com.lorepo.icplayer.client.module.shape;

import com.google.gwt.user.client.ui.AbsolutePanel;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.api.IModuleView;

public class ShapeView extends AbsolutePanel implements IModuleView{

	public ShapeView(ShapeModule module, boolean isPreview){

		setStyleName("ic_shape");
		StyleUtils.applyInlineStyle(this, module);
		if(!isPreview){
			setVisible(module.isVisible());
		}
		getElement().setId(module.getId());
	}
}
