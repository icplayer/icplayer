package com.lorepo.icplayer.client.utils;

import com.google.gwt.core.client.JavaScriptObject;

public class PlayerUtils {
	public static native JavaScriptObject getIframe () /*-{
		var iFrame = $wnd.get_iframe();
		if (iFrame) {
			return iFrame;
		}
		
		return null;
	}-*/;
	
	public native static boolean isInIframe() /*-{
		return $wnd.isFrameInDifferentDomain || $wnd.isInIframe;
	}-*/;
	
	public native static int getIframeOffset() /*-{
		if ($wnd.isFrameInDifferentDomain || $wnd.isInIframe) {
			return $wnd.iframeSize.frameOffset || 64;
		} else {
			return $wnd.get_iframe().offset().top;
		}
	}-*/;
	
	public native static int getIframeNotScaledOffset () /*-{
		return $wnd.iframeSize.notScaledOffset;
	}-*/;
	
	public native static int getIframeInnerHeight() /*-{
		return $wnd.iframeSize.windowInnerHeight;
	}-*/;
	
	public native static int getIframeHeight() /*-{
		if ($wnd.isFrameInDifferentDomain) {
			return $wnd.iframeSize.height;
		} else {
			return $wnd.get_iframe().height();
		}
	}-*/;
	
	public native static boolean isEditorPreview () /*-{
		return $wnd.iframeSize.isEditorPreview;
	}-*/;
	
	public native static float getFrameScale () /*-{
		return $wnd.iframeSize.frameScale || 1;
	}-*/;
	
	public native static float getPlayerOffset () /*-{
		return $wnd.$("#_icplayer").offset().top;
	}-*/;
	
	public static float getAbsTopOffset () {
		if (PlayerUtils.isInIframe()) {
			return PlayerUtils.getIframeOffset();
		}
		
		return PlayerUtils.getPlayerOffset();
	}
	
	public static native int getRealHeaderSize() /*-{
		return $wnd.$(".ic_header").height();
	}-*/;
	
	public static native int getRealFooterSize() /*-{
		return $wnd.$(".ic_footer").height();
	}-*/;
	
	public static native float getOffsetTop() /*-{
		return $wnd.iframeSize.offsetTop;
	}-*/;
	
	public static native int getScreenHeight() /*-{
		if ($wnd.isFrameInDifferentDomain) {
			var offsetIframe = $wnd.iframeSize.offsetTop;
			return $wnd.parent.innerHeight - offsetIframe;
		} else {
			// innerHeight can be unreliable on orientation change
			// i.e. https://bugs.chromium.org/p/chromium/issues/detail?id=231319
			return $wnd.outerHeight || $wnd.innerHeight;
		}
	}-*/;
}