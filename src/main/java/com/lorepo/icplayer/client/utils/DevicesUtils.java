package com.lorepo.icplayer.client.utils;

public class DevicesUtils {
	public static native boolean isSafariMobile() /*-{
		return $wnd.MobileUtils.isSafariMobile($wnd.navigator.userAgent);
	}-*/;
}
