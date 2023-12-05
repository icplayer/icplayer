package com.lorepo.icplayer.client.utils;

public class DevicesUtils {
	public static native boolean isSafariMobile() /*-{
		return $wnd.MobileUtils.isSafariMobile($wnd.navigator.userAgent);
	}-*/;

	public static native boolean isIPod() /*-{
		return $wnd.navigator.userAgent.match(/(iPad|iPod|Mac)/g) ||
			$wnd.navigator.userAgent.match(/(Mac)/g) && $wnd.navigator.maxTouchPoints && $wnd.navigator.maxTouchPoints > 2;
	}-*/;
	
	public static native boolean isMobile() /*-{
		return $wnd.MobileUtils.isMobileUserAgent($wnd.navigator.userAgent);
	}-*/;
}
