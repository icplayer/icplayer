package com.lorepo.icplayer.client.framework.module;

import com.google.gwt.user.client.ui.Widget;
import com.lorepo.icplayer.client.utils.DOMUtils;

public class StyleUtils {

	/**
	 * Wstawienie stylu inline do elementu DOM
	 */
	public static void applyInlineStyle(Widget widget, IStyledModule module){
		
		DOMUtils.applyInlineStyle(widget.getElement(), module.getInlineStyle());
		
		String styleClass = module.getStyleClass();
		if(styleClass != null && !styleClass.isEmpty()){
			widget.setStylePrimaryName(styleClass);
		}
		
	};
}
