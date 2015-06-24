package com.lorepo.icplayer.client.framework.module;

import com.google.gwt.user.client.ui.PushButton;
import com.google.gwt.user.client.ui.Widget;
import com.lorepo.icplayer.client.module.BasicModuleModel;
import com.lorepo.icplayer.client.utils.DOMUtils;

public class StyleUtils {

	public static void applyInlineStyle(Widget widget, IStyledModule module){
		DOMUtils.applyInlineStyle(widget.getElement(), module.getInlineStyle());

		String styleClass = module.getStyleClass();
		if(styleClass != null && !styleClass.isEmpty()){
			widget.setStylePrimaryName(styleClass);
		}
	};

	/**
     * Wrapper for {@link com.google.gwt.user.client.ui.UIObject} setStyle method.
     * In addition to setting style name it maintains custom class name provided in iceditor.
     *
     * @param style the new style name
     */
	public static void setButtonStyleName(String style, PushButton button, BasicModuleModel model) {
		/**
		 * Custom class is set as a second one because GWT PushButton takes the first one in situations like
		 * hovering and adds additional classes (-up/-up-hovering etc) based on its name.
		 */
		String customClass = model.getStyleClass();

		if (customClass != null && !customClass.equals("")) {
			button.setStyleName(style + " " + customClass);
		} else {
			button.setStyleName(style);
		}
	}

	/**
	 * This method sets class from jquery-ui library to keep conventions
	 */
	public static void addStateDisableClass(Widget widget) {
		widget.getElement().addClassName("ui-state-disabled");
	}

	public static void removeClassFromElement(Widget widget, String className) {
		widget.getElement().removeClassName(className);
	}
}
