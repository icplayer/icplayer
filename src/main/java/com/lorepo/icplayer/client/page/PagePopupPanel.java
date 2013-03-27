package com.lorepo.icplayer.client.page;

import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.user.client.Event;
import com.google.gwt.user.client.Event.NativePreviewEvent;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.Window.ScrollEvent;
import com.google.gwt.user.client.Window.ScrollHandler;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.Widget;

public class PagePopupPanel extends DialogBox {

	/**
	 * Widget ktorego należy uzyc jako parenta do wycentrowania dialogu
	 */
	private Widget centerParent;
	PageView playerWidget;
	
	/**
	 * Set page
	 */
	public PagePopupPanel(PageView playerWidget) {

		this.playerWidget = playerWidget;
		setStyleName("ic_popup");
		setAnimationEnabled(true);
		setGlassEnabled(true);

		setWidget(playerWidget);
	}

	/**
	 * Center popup
	 * @param parentWidget
	 */
	public void center() {

		if(centerParent != null){
			int left = centerParent.getAbsoluteLeft();
			int offsetX = centerParent.getOffsetWidth() - getOffsetWidth();
			left = left+offsetX/2;
			
			int top;
			if(centerParent.getAbsoluteTop() > Window.getScrollTop()){
				top = centerParent.getAbsoluteTop();
			}
			else{
				top = Window.getScrollTop();
			}
			
			Window.addWindowScrollHandler(new ScrollHandler() {
				public void onWindowScroll(ScrollEvent event) {
					
					restrictScroll();
				}

			});
			
			setPopupPosition(left, top);
		}
	}

	
	private void restrictScroll() {
	
		int popupBottom = getAbsoluteTop() + getOffsetHeight();
		int windowBottom = Window.getScrollTop() + Window.getClientHeight();
		if(Window.getClientHeight() > getOffsetHeight()){
			if(Window.getScrollTop() > getAbsoluteTop()){
				Window.scrollTo(0, getAbsoluteTop());
			}
			else if(popupBottom > windowBottom){
				int diff = popupBottom-windowBottom;
				Window.scrollTo(0, Window.getScrollTop()+diff);
			}
		}
		else{
			int top = getAbsoluteTop() + (getOffsetHeight()-Window.getClientHeight());
			if(Window.getScrollTop() > top){
				Window.scrollTo(0, top);
			}
			else if(getAbsoluteTop() > Window.getScrollTop()){
				Window.scrollTo(0, getAbsoluteTop());
			}
		}
	}
	
	
	/**
	 * 
	 * @param widget
	 */
	public void setCenterParent(Widget widget) {

		centerParent = widget;
	}	
	
	/**
	 * Obsługa zamykania klawiszem Esc
	 */
	@Override
    protected void onPreviewNativeEvent(NativePreviewEvent event) {
        super.onPreviewNativeEvent(event);
        switch (event.getTypeInt()) {
            case Event.ONKEYDOWN:
                if (event.getNativeEvent().getKeyCode() == KeyCodes.KEY_ESCAPE) {
                    hide();
                }
                break;
        }
    }

	
	public PageView getView(){
		return playerWidget;
	}
}
