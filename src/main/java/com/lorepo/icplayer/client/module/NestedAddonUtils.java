package com.lorepo.icplayer.client.module;

import com.google.gwt.dom.client.Element;
import com.google.gwt.user.client.ui.HTML;

public class NestedAddonUtils {

    public static String CLASS_NAME = "ic_addon_gap";
    public static String ID_PREFIX = "addonGap-";
    public static String ID_EDITOR_PREFIX = "editor-addonGap-";
    public static String GAP_PREFIX = "\\addon{";

    public static String getDefinition(String addonId) {
        return GAP_PREFIX + addonId + "}";
    }

    public static Element getPlaceholder(String addonId) {
        HTML html = new HTML("<input></input>");
        Element el = html.getElement().getFirstChildElement();
        updatePlaceholder(addonId, el);
        return el;
    }

    public static Element getPlaceholderInEditorMode(String addonId) {
        HTML html = new HTML("<input></input>");
        Element el = html.getElement().getFirstChildElement();
        updatePlaceholderInEditorMode(addonId, el);
        return el;
    }

    public static void updatePlaceholder(String addonId, Element el) {
        el.addClassName(CLASS_NAME);
        el.setId(ID_PREFIX + addonId);
        el.setAttribute("placeholder", addonId);
        el.setAttribute("size", Integer.toString(addonId.length() + 1));
    }

    public static void updatePlaceholderInEditorMode(String addonId, Element el) {
        updatePlaceholder(addonId, el);
        el.setAttribute("data-addon-value", getDefinition(addonId));
    }


    public static native boolean insertIntoAddonGap(String moduleID, Element view, Element page) /*-{
		var idPrefix = @com.lorepo.icplayer.client.module.NestedAddonUtils::ID_PREFIX;
		var idEditorPrefix = @com.lorepo.icplayer.client.module.NestedAddonUtils::ID_EDITOR_PREFIX;
		var escapedModuleID = moduleID.replace(/[ !"#$%&'()*+,.:;<=>?@[^`{|}~\/\]]/g, '\\$&'); //regex to escape jQuery selectors - https://api.jquery.com/category/selectors/
		var $addonGap = $wnd.$(page).find('#' + idPrefix + escapedModuleID);
		if ($addonGap.length == 0) $addonGap = $wnd.$(page).find('#'+idEditorPrefix + escapedModuleID);
		if ($addonGap.length == 0) return false;
		view.classList.add("inner_addon");
		$addonGap.first().replaceWith(view);
		if (view.onAttachCallback) {
			view.onAttachCallback();
		}
		return true;
	}-*/;
}
