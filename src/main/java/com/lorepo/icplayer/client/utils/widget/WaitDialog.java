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
		updateInnerWrapperHeight();
	};

	public native void updateWrapperPosition() /*-{
		var width = this.@com.lorepo.icplayer.client.utils.widget.WaitDialog::getWidth()();
		var height = this.@com.lorepo.icplayer.client.utils.widget.WaitDialog::getHeight()();
		var scale = this.@com.lorepo.icplayer.client.utils.widget.WaitDialog::getScale()();

		$wnd.$('.ic_waitdlg').width(width + 'px');
		$wnd.$('.ic_waitdlg').height(height + 'px');
		$wnd.$('.ic_waitdlg').css('display', 'flex');
		$wnd.$('.ic_waitdlg').css('justify-content', 'center');
		$wnd.$('.ic_waitdlg').css('align-items', 'center');
		$wnd.$('.ic_waitdlg').css('padding', '0');
		$wnd.$('.ic_waitdlg').css('left', '0');
		$wnd.$('.ic_waitdlg').css('top', '0');
		$wnd.$('.ic_waitdlg').css('transform', 'scale(' + scale + ')');
	}-*/;

	public native int getWidth() /*-{
		var windowHeight = $wnd.$($wnd).height();
		var windowWidth = $wnd.$($wnd).width();
		var contentWidth = $wnd.$('#_icplayer').width();
		var isMobileDevice = this.@com.lorepo.icplayer.client.utils.widget.WaitDialog::isMobile()();
		var contentScale = this.@com.lorepo.icplayer.client.utils.widget.WaitDialog::getContentScale()();
		var aspectRatio = windowHeight / windowWidth;

		if (windowWidth && windowWidth < windowHeight && isMobileDevice) {
			return windowWidth;
		}

		if (contentWidth && contentWidth > 100 && !isMobileDevice && aspectRatio > 0.625) {
			return contentScale * contentWidth;
		}

		return windowWidth;
	}-*/;

	public native int getHeight() /*-{
		var windowHeight = $wnd.$($wnd).height();
		var windowWidth = $wnd.$($wnd).width();
		var contentHeight = $wnd.$('#_icplayer').height();
		var isMobileDevice = this.@com.lorepo.icplayer.client.utils.widget.WaitDialog::isMobile()();
		var isIOS = this.@com.lorepo.icplayer.client.utils.widget.WaitDialog::isIOS()();
		var isMCourserInstance = this.@com.lorepo.icplayer.client.utils.widget.WaitDialog::isMCourserInstance()();
		var contentScale = this.@com.lorepo.icplayer.client.utils.widget.WaitDialog::getContentScale()();
		var isWindowFitToPage = this.@com.lorepo.icplayer.client.utils.widget.WaitDialog::isWindowFitToPage()();
		var heightMultiplier = 0.625;
		var aspectRatio = windowHeight / windowWidth;

		if (windowHeight < windowWidth && isMobileDevice) {
			return windowHeight;
		} else if (isIOS && isMCourserInstance) {
		 	return heightMultiplier * windowWidth + 90;
		} else if (isMobileDevice) {
			return heightMultiplier * windowWidth;
		}

		if (contentHeight && contentHeight > 100) {
			return contentScale * contentHeight;
		}

		if (aspectRatio > 0.625 && isWindowFitToPage) {
			return heightMultiplier * windowWidth;
		} else if (isWindowFitToPage) {
			return windowHeight;
		}

		return windowWidth > 1200 ? heightMultiplier * 1200 : heightMultiplier * windowWidth;
	}-*/;

	public native boolean isMobile() /*-{
		return $wnd.MobileUtils.isMobileUserAgent($wnd.navigator.userAgent) || $wnd.MobileUtils.isSafariMobile($wnd.navigator.userAgent);
	}-*/;

	public native boolean isIOS() /*-{
		return $wnd.MobileUtils.isSafariMobile($wnd.navigator.userAgent);
	}-*/;

	public native boolean isMCourserInstance() /*-{
		return $wnd.location.href.includes("mcourser");
	}-*/;

	public native boolean isWindowFitToPage() /*-{
		return !!$wnd.document.getElementById("scrollableBody");
	}-*/;

	public native void updateInnerWrapperHeight() /*-{
		var imageHeight = $wnd.$('.ic_waitImage').height() 
		var firstChild = $wnd.$('.ic_waitdlg').children()[0];
		imageHeight = imageHeight < 110 ? 110 : imageHeight;
		
		$wnd.$(firstChild).height(imageHeight + 'px');
	}-*/;

	public native double getContentScale() /*-{
		var matrixScale = $wnd.$('#content').css('transform');
		if (!matrixScale || !matrixScale.includes('matrix')) {
			return 1;
		}

		var matrix = matrixScale.replace('matrix(', '').split(',')
		
		return +matrix[0];
	}-*/;

	public native double getScale() /*-{
		var icPageElement = $wnd.$('.ic_page').get(0);
		if (!icPageElement) {
			var parentWidth = parent.innerWidth;

			return parentWidth / 1200;
		}

		return this.@com.lorepo.icplayer.client.utils.widget.WaitDialog::getContentScale()();
	}-*/;
}