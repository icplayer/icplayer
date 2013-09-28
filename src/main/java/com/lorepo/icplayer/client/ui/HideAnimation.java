package com.lorepo.icplayer.client.ui;

import com.google.gwt.animation.client.Animation;
import com.google.gwt.user.client.ui.PopupPanel;

public class HideAnimation extends Animation {
	private final PopupPanel panel;
    
    public HideAnimation(PopupPanel panel) {
    	this.panel = panel;
    	run(500);
	}

    @Override
    protected void onComplete() {
    	panel.hide();
    }

    @Override
    protected void onUpdate(double progress) {
    	double opacity = 1-progress*.9;
  		panel.getElement().getStyle().setProperty("opacity", Double.toString(opacity));
    }

}