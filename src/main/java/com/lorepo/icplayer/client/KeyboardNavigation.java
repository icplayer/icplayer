package com.lorepo.icplayer.client;

public class KeyboardNavigation {
	public static native String getModuleStatus(String type) /*-{
		return $wnd.moduleStatus[type];
	}-*/;
}
