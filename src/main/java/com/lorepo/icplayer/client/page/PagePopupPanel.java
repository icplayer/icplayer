package com.lorepo.icplayer.client.page;

import com.google.gwt.dom.client.Style;
import com.google.gwt.dom.client.Style.Overflow;
import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.Event;
import com.google.gwt.user.client.Event.NativePreviewEvent;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.Window.ScrollEvent;
import com.google.gwt.user.client.Window.ScrollHandler;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.Widget;
import com.lorepo.icf.utils.ILoadListener;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icf.utils.URLUtils;
import com.lorepo.icf.utils.XMLLoader;
import com.lorepo.icplayer.client.model.Page;
import com.lorepo.icplayer.client.module.api.event.ValueChangedEvent;

public class PagePopupPanel extends DialogBox {

	private Widget parentWidget;
	private PageView pageWidget;
	private PageController pageController;
	private String additionalClasses;
	private String top;
	private String left;
	private PageController openingPageController;
	private String popupName = "";

	public PagePopupPanel(Widget parent, PageController pageController, String top, String left, String additionalClasses) {
		this.pageController = pageController;
		this.parentWidget = parent;
		this.additionalClasses = additionalClasses;
		this.top = top;
		this.left = left;
	}
	
	
	public void showPage(Page page, String baseUrl) {
		if(page.isLoaded()){
			initPanel(page);
		}
		else{
			loadPage(page, baseUrl);
		}
		
		popupName = page.getName();
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
		pageWidget = new PageView("ic_popup_page");
		String classes = additionalClasses == "" ? "ic_popup" : "ic_popup " + additionalClasses;

		setStyleName(classes);
		setAnimationEnabled(true);
		setGlassEnabled(true);
		setWidget(pageWidget);
				
		int windowWidth = Window.getClientWidth();
		int windowHeight = Window.getClientHeight();
		int popupWidth = page.getWidth(); 
		int popupHeight = page.getHeight();
		
		if (popupWidth > windowWidth){
			page.setWidth(windowWidth);
		}
		
		if (popupHeight > windowHeight){
			page.setHeight(windowHeight);
		}
		
		show();
		pageController.setView(pageWidget);
		pageController.setPage(page);
				
		Style glassStyle = getGlassElement().getStyle();
				
		this.pageWidget.getWidget().getElement().getStyle().setOverflow(Overflow.AUTO);
				
		if (popupWidth > windowWidth || popupHeight > windowHeight){
			this.compensateBorder();
		}
		
		int top;
		if (parentWidget.getAbsoluteTop() > Window.getScrollTop()) {
			top = parentWidget.getAbsoluteTop();
		} else {
			top = Window.getScrollTop();
		}
		
		int height = getElement().getClientHeight();
	
		if (height < Window.getClientHeight()) {
			height = Window.getClientHeight();
		}
			
		height += top;
		
		glassStyle.setProperty("top", 0 + "px");
		glassStyle.setProperty("height", height + "px");
		center();
	}
	
	public static native int getParentWindowOffset() /*-{
		var current_window = $wnd;
		var global_offset = 0;
		
		while (current_window != current_window.parent) {
			var iframe_offset = 0,
				iframes = current_window.parent.document.getElementsByTagName("iframe");
	
			for (var i=0; i < iframes.length; i++) {
				var current_iframe = iframes[i];
	
				if (current_window.location.href == current_iframe.src){
					var iframe_placement = current_iframe.getBoundingClientRect().top,
						body_placement = current_window.parent.document.body.getBoundingClientRect().top;
	
					iframe_offset = Math.round(iframe_placement - body_placement);
				}
			}
		
			global_offset += current_window.parent.pageYOffset - iframe_offset;
			current_window = current_window.parent;
		}
		
		global_offset = Math.max(0, global_offset);
		return global_offset;
		
	}-*/;

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
			
			try{
				top += getParentWindowOffset();
			}catch(Exception e) {
				top += 0;
			}
			
			Window.addWindowScrollHandler(new ScrollHandler() {
				public void onWindowScroll(ScrollEvent event) {
					
					restrictScroll();
				}

			});
			
			
			if(this.top != null && this.top != "" && this.left != null && this.left != "" && isInteger(this.left) && isInteger(this.top)){		
				int propertyLeft = Integer.parseInt(this.left);
				int propertyTop = Integer.parseInt(this.top);
				setPopupPosition(propertyLeft, propertyTop);
			} else if (this.top != null && this.top != "" && isInteger(this.top)) {
				int propertyTop = Integer.parseInt(this.top);
				setPopupPosition(left, propertyTop);
			}else if (this.left != null && this.left != "" && isInteger(this.left)) {
				int propertyLeft = Integer.parseInt(this.left);
				setPopupPosition(propertyLeft, top);
			} else {
				setPopupPosition(left, top);
			}
		}
	}

	public boolean isInteger(String s) {
      boolean isValidInteger = false;
      try{
         Integer.parseInt(s); 
         isValidInteger = true;
      }
      catch (NumberFormatException ex){}
 
      return isValidInteger;
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
	
	private void compensateBorder(){
		int popupWidth = this.pageWidget.getOffsetWidth();
		int popupHeight = this.pageWidget.getOffsetHeight();
		int borderWidth = this.getBorderWidth();
		int borderHeight = this.getBorderHeight();
		
		this.pageWidget.setWidth(popupWidth - 2 * borderWidth);
		this.pageWidget.setHeight(popupHeight - 2 * borderHeight);
	}
	
	private native int getBorderWidth() /*-{
		var widthWithBorder = $wnd.$(".ic_popup").outerWidth(true);
		var widthWithoutBorder = $wnd.$(".ic_popup_page").outerWidth();
		return (widthWithBorder - widthWithoutBorder);
	}-*/;

	private native int getBorderHeight() /*-{
		var heightWithBorder = $wnd.$(".ic_popup").outerHeight(true);
		var heightWithoutBorder = $wnd.$(".ic_popup_page").outerHeight();
		return (heightWithBorder - heightWithoutBorder);
	}-*/;
	
	
	/**
	 * Obsługa zamykania klawiszem Esc
	 */
	@Override
    protected void onPreviewNativeEvent(NativePreviewEvent event) {
        super.onPreviewNativeEvent(event);
        switch (event.getTypeInt()) {
            case Event.ONKEYDOWN:
                if (event.getNativeEvent().getKeyCode() == KeyCodes.KEY_ESCAPE) {
                    close();
                }
                break;
        }
    }

	
	public PageView getView(){
		return pageWidget;
	}

	public static native void removeHoveringFromButtons() /*-{
	  var popups = $wnd.$('[id^="OpenPopup"]');
	  
	  $wnd.$(popups).each(function () {
	  	var element = $wnd.$(this),
  			classNames = element.attr("class");
  		classNames = classNames.replace(/-hovering/g, "");
  		element.attr("class", classNames);
	  });
	}-*/;
	
	public void setPagePlayerController(PageController openingPageController) {
		this.openingPageController = openingPageController;
	}
	
	public void close() {
		removeHoveringFromButtons();
		hide();
		pageController.getPlayerController().setPopupEnabled(false);
		pageController.closePage();
		
		ValueChangedEvent valueEvent = new ValueChangedEvent("Popup", popupName, "closed", "");
		this.openingPageController.getPlayerServices().getEventBus().fireEvent(valueEvent);
	}
}
