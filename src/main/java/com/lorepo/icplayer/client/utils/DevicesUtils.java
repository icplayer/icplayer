package com.lorepo.icplayer.client.utils;

public class DevicesUtils {
	public static native boolean isSafariMobile() /*-{
		return $wnd.MobileUtils.isSafariMobile($wnd.navigator.userAgent);
	}-*/;
	
	public static native boolean isMobile() /*-{
		return $wnd.MobileUtils.isMobileUserAgent($wnd.navigator.userAgent);
	}-*/;
}
