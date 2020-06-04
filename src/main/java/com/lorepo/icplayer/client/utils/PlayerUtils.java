package com.lorepo.icplayer.client.utils;

public class PlayerUtils {
	
	public native static boolean isInIframe() /*-{
		return $wnd.isFrameInDifferentDomain || $wnd.isInIframe;
	}-*/;
	
	public native static float getPlayerOffset () /*-{
		return $wnd.$("#_icplayer").offset().top;
	}-*/;
	
	public native static int getIframeOffset() /*-{
		if ($wnd.isFrameInDifferentDomain) {
			return $wnd.iframeSize.frameOffset || 64;
		} else {
			return $wnd.get_iframe().offset().top;
		}
	}-*/;
	
	public static float getAbsTopOffset () {
		if (PlayerUtils.isInIframe()) {
			return PlayerUtils.getIframeOffset();
		}

		return PlayerUtils.getPlayerOffset();
	}
	
}
