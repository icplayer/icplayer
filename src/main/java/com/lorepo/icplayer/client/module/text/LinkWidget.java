package com.lorepo.icplayer.client.module.text;

import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.ui.Anchor;

public class LinkWidget extends Anchor{

	
	public LinkWidget(LinkInfo info){
		
		super(DOM.getElementById(info.getId()));
		setStyleName("ic_pageLink");
		onAttach();
	}

}
