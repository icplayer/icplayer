package com.lorepo.icplayer.client.utils.widget;

import com.google.gwt.core.client.GWT;
import com.google.gwt.resources.client.ClientBundle;
import com.google.gwt.resources.client.ImageResource;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.HTML;
import com.lorepo.icplayer.client.utils.DevicesUtils;

public class WaitDialog extends DialogBox {

	public interface WaitResources extends ClientBundle{
	    ImageResource wait_animation();
	}
	
    public static final WaitResources RES_INSTANCE =  GWT.create(WaitResources.class);
 

    public WaitDialog() {
    	setStyleName("ic_waitdlg");
		setModal(true);
		setAnimationEnabled(false);
		HTML html = new HTML("<div></div>");
		html.setStyleName("ic_waitImage");
		setWidget(html);
		centerElement();
	}

	public void centerElement() {
		center();
		updateWrapperPosition();
	};

	public native void updateWrapperPosition() /*-{
		var width = this.@com.lorepo.icplayer.client.utils.widget.WaitDialog::getWidth()();
		var height = this.@com.lorepo.icplayer.client.utils.widget.WaitDialog::getHeight()();

		$wnd.$('.ic_waitdlg').width(width + 'px');
		$wnd.$('.ic_waitdlg').height(height + 'px');
		$wnd.$('.ic_waitdlg').css('display', 'flex');
		$wnd.$('.ic_waitdlg').css('justify-content', 'center');
		$wnd.$('.ic_waitdlg').css('align-items', 'center');
		$wnd.$('.ic_waitdlg').css('padding-left', '0');
		$wnd.$('.ic_waitdlg').css('left', '0');
		$wnd.$('.ic_waitdlg').css('top', '0');
	}-*/;

	public native int getWidth() /*-{
		var windowHeight = $wnd.$($wnd).height();
		var windowWidth = $wnd.$($wnd).width();
		var documentWidth = $wnd.$($wnd.document).width();
		var contentWidth = $wnd.$('#_icplayer').width();
		var isMobileDevice = this.@com.lorepo.icplayer.client.utils.widget.WaitDialog::isMobile()();

		if (windowWidth && windowWidth < windowHeight && isMobileDevice) {
			return windowWidth;
		}

		if (contentWidth && contentWidth > 100 && contentWidth <= documentWidth && !isMobileDevice) {
			return contentWidth;
		}

		return documentWidth;
	}-*/;

	public native int getHeight() /*-{
		var windowHeight = $wnd.$($wnd).height();
		var windowWidth = $wnd.$($wnd).width();
		var documentHeight = $wnd.$($wnd.document).height();
		var contentHeight = $wnd.$('#_icplayer').height();
		var isMobileDevice = this.@com.lorepo.icplayer.client.utils.widget.WaitDialog::isMobile()();

		if (windowHeight && windowHeight < windowWidth && isMobileDevice) {
			return windowHeight;
		}

		if (contentHeight && contentHeight > 100 && contentHeight <= documentHeight && !isMobileDevice) {
			return contentHeight;
		}

		return windowHeight;
	}-*/;

	public native boolean isMobile() /*-{
		return $wnd.MobileUtils.isMobileUserAgent($wnd.navigator.userAgent) || $wnd.MobileUtils.isSafariMobile($wnd.navigator.userAgent);
	}-*/;
}