package com.lorepo.icplayer.client.utils.widget;

import com.google.gwt.core.client.GWT;
import com.google.gwt.resources.client.ClientBundle;
import com.google.gwt.resources.client.ImageResource;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.HTML;
import com.lorepo.icf.utils.JavaScriptUtils;
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
		if (DevicesUtils.isMobile() || DevicesUtils.isSafariMobile() || DevicesUtils.isIPod()) {
			updateWrapperPosition();
		}
	}

	public static native void updateWrapperPosition() /*-{
		var width = $wnd.$($wnd.document).width();
		$wnd.$('.ic_waitdlg').width(width + 'px');
		$wnd.$('.ic_waitdlg').css('display', 'flex');
		$wnd.$('.ic_waitdlg').css('justify-content', 'center');
		$wnd.$('.ic_waitdlg').css('padding-left', '0');
		$wnd.$('.ic_waitdlg').css('left', '0');
	}-*/;
}