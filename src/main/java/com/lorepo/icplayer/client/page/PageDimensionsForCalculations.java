package com.lorepo.icplayer.client.page;

import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.ui.AbsolutePanel;

public class PageDimensionsForCalculations {
	public int width;
	public int height;
	public int absoluteLeft;
	public int absoluteTop;
	
	public PageDimensionsForCalculations(int width, int height, int absoluteLeft, int absoluteTop) {
		this.width = width;
		this.height = height;
		this.absoluteLeft = absoluteLeft;
		this.absoluteTop = absoluteTop;
	}
	
	public static PageDimensionsForCalculations getAbsolutePageViewDimensions(AbsolutePanel panel) {
		int width = DOM.getElementPropertyInt(panel.getElement(), "clientWidth");
		int height = DOM.getElementPropertyInt(panel.getElement(), "clientHeight");
		int absoluteLeft = panel.getAbsoluteLeft();
		int absoluteTop = panel.getAbsoluteTop();
		
		return new PageDimensionsForCalculations(width, height, absoluteLeft, absoluteTop);
	}
}
