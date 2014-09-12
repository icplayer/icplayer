package com.lorepo.icplayer.client.utils.widget;

import com.google.gwt.core.client.GWT;
import com.google.gwt.resources.client.ClientBundle;
import com.google.gwt.resources.client.ImageResource;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.HTML;

public class WaitDialog extends DialogBox {

	public interface WaitResources extends ClientBundle{
	    ImageResource wait_animation();
	}
	
    public static final WaitResources RES_INSTANCE =  GWT.create(WaitResources.class);
 

    public WaitDialog(){
    	setStyleName("ic_waitdlg");
		setModal(true);
		setAnimationEnabled(false);
		HTML html = new HTML("<div></div>");
		html.setStyleName("ic_waitImage");
		setWidget(html);
	}
}