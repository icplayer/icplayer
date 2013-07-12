package com.lorepo.icplayer.client.page;

import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.user.client.Event;
import com.google.gwt.user.client.Event.NativePreviewEvent;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.Window.ScrollEvent;
import com.google.gwt.user.client.Window.ScrollHandler;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.Widget;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icf.utils.URLUtils;
import com.lorepo.icplayer.client.model.Page;
import com.lorepo.icplayer.client.utils.ILoadListener;
import com.lorepo.icplayer.client.utils.XMLLoader;

public class PagePopupPanel extends DialogBox {

	private Widget parentWidget;
	private PageView pageWidget;
	private PageController pageController;
	

	public PagePopupPanel(Widget parent, PageController pageController) {
		this.pageController = pageController;
		this.parentWidget = parent;
	}
	
	
	public void showPage(Page page, String baseUrl) {
		if(page.isLoaded()){
			initPanel(page);
		}
		else{
			loadPage(page, baseUrl);
		}
	}


	private void loadPage(Page page, String baseUrl) {
		XMLLoader reader = new XMLLoader(page);
		String url = URLUtils.resolveURL(baseUrl, page.getHref());
		reader.load(url, new ILoadListener() {
			public void onFinishedLoading(Object obj) {
				initPanel((Page) obj);
			}
			public void onError(String error) {
				JavaScriptUtils.log("Can't load page: " + error);
			}
		});
	}


	private void initPanel(Page page){
		pageWidget = new PageView();
		pageController.setView(pageWidget);
		pageController.setPage(page);
		setStyleName("ic_popup");
		setAnimationEnabled(true);
		setGlassEnabled(true);
		setWidget(pageWidget);
		show();
		center();
	}

	/**
	 * Center popup
	 * @param parentWidget
	 */
	public void center() {

		if(parentWidget != null){
			int left = parentWidget.getAbsoluteLeft();
			int offsetX = parentWidget.getOffsetWidth() - getOffsetWidth();
			left = left+offsetX/2;
			
			int top;
			if(parentWidget.getAbsoluteTop() > Window.getScrollTop()){
				top = parentWidget.getAbsoluteTop();
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
		return pageWidget;
	}
}
