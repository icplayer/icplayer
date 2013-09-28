package com.lorepo.icplayer.client.ui;

import com.google.gwt.animation.client.Animation;
import com.google.gwt.user.client.ui.PopupPanel;

public class ShowAnimation extends Animation {
	private final PopupPanel panel;
    
    public ShowAnimation(PopupPanel panel) {
    	this.panel = panel;
    	run(500);
	}

    @Override
    protected void onComplete() {
    }

    @Override
    protected void onUpdate(double progress) {
  		panel.getElement().getStyle().setProperty("opacity", Double.toString(progress*.9));
    }

}