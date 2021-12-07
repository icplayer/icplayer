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
        el.setAttribute("data-addon-value", getDefinition(addonId));
        el.addClassName(CLASS_NAME);
        el.setId(ID_PREFIX + addonId);
        el.setAttribute("placeholder", addonId);
        el.setAttribute("size", Integer.toString(addonId.length() + 1));
        return el;
    }

    public static void updatePlaceholder(String addonId, Element el) {
        el.setAttribute("data-addon-value", getDefinition(addonId));
        el.setId(ID_PREFIX + addonId);
        el.setAttribute("placeholder", addonId);
        el.setAttribute("size", Integer.toString(addonId.length() + 1));
    }

    public static boolean insertIntoAddonGap(String moduleID, Element view, Element page) {
        return insertIntoAddonGap(moduleID, view, page, ID_PREFIX, ID_EDITOR_PREFIX);
    }

    private static native boolean insertIntoAddonGap(String moduleID, Element view, Element page, String idPrefix, String idEditorPrefix) /*-{
		var $addonGap = $wnd.$(page).find('#' + idPrefix + moduleID);
		if ($addonGap.length == 0) $addonGap = $wnd.$(page).find('#'+idEditorPrefix + moduleID);
		if ($addonGap.length == 0) return false;
		view.classList.add("inner_addon");
		$addonGap.first().replaceWith(view);
		if (view.onAttachCallback) {
			view.onAttachCallback();
		}
		return true;
	}-*/;
}
