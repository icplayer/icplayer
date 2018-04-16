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
import com.google.web.bindery.event.shared.HandlerRegistration;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icf.utils.URLUtils;
import com.lorepo.icplayer.client.content.services.dto.ScaleInformation;
import com.lorepo.icplayer.client.module.api.event.ValueChangedEvent;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.xml.IProducingLoadingListener;
import com.lorepo.icplayer.client.xml.page.PageFactory;
import com.lorepo.icplayer.client.model.page.Page;

public class PagePopupPanel extends DialogBox {

	private Widget parentWidget;
	private PageView pageWidget;
	private PageController pageController;
	private String additionalClasses;
	private String top;
	private String left;
	private PageController openingPageController;
	private String popupName = "";
	private int popupHeightWithoutBorder = 0;
	private ScaleInformation scale;
	private IPlayerServices icplayer;
	private HandlerRegistration scrollHandler = null;
	private String layoutID = "";

	public PagePopupPanel(Widget parent, PageController pageController, String top, String left, String additionalClasses) {
		this.pageController = pageController;
		this.parentWidget = parent;
		this.additionalClasses = additionalClasses;
		this.top = top;
		this.left = left;
		this.scale = new ScaleInformation();
		this.icplayer = null;
	}
	
	public PagePopupPanel(Widget parent, PageController pageController, String top, String left, String additionalClasses, IPlayerServices icplayer) {
		this.pageController = pageController;
		this.parentWidget = parent;
		this.additionalClasses = additionalClasses;
		this.top = top;
		this.left = left;
		scale = new ScaleInformation();
		this.icplayer = icplayer;
	}
	
	public void setLayoutID(String id){
		this.layoutID = id;
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
		String url = URLUtils.resolveURL(baseUrl, page.getHref());
		PageFactory factory = new PageFactory((Page) page);
		
		factory.load(url, new IProducingLoadingListener () {

			@Override
			public void onFinishedLoading(Object producedItem) {
				Page page = (Page) producedItem;
				initPanel(page);
			}

			@Override
			public void onError(String error) {
				JavaScriptUtils.log("Can't load page: " + error);
			}
			
		});
	}


	private void initPanel(Page page){
		pageWidget = new PageView("ic_popup_page");
		String classes = additionalClasses == "" ? "ic_popup" : "ic_popup " + additionalClasses;

		if(this.layoutID.length()>0 && page.getSizes().containsKey(this.layoutID)) {
			page.setSemiResponsiveLayoutID(this.layoutID);
		}
		
		setStyleName(classes);
		setAnimationEnabled(true);
		setGlassEnabled(true);
		setWidget(pageWidget);
		
		if (this.icplayer!=null) {
			scale = this.icplayer.getScaleInformation();
		}
		this.getElement().getStyle().setProperty("transform", scale.transform);
		this.getElement().getStyle().setProperty("transform-origin", scale.transformOrigin);
				
		int windowWidth = Window.getClientWidth();
		int windowHeight = Window.getClientHeight() > getWindowHeight() ? Window.getClientHeight() : getWindowHeight();

		int popupWidth = page.getWidth();
		int popupHeight = page.getHeight();
		
		if (scaleInt(popupWidth,scale.scaleX) > windowWidth) {
			page.setWidth(scaleInt(windowWidth,1.0/scale.scaleX));
		}
		
		if (scaleInt(popupHeight,scale.scaleY) > windowHeight){
			page.setHeight(scaleInt(windowHeight,1.0/scale.scaleY));
		}
		
		show();
		pageController.setView(pageWidget);
		pageController.setPage(page);
				
		Style glassStyle = getGlassElement().getStyle();
		
		if (scaleInt(popupWidth, scale.scaleX) >= windowWidth){
			this.pageWidget.getWidget().getElement().getStyle().setOverflowX(Overflow.AUTO);
			this.forceHardwareAcceleration(this.pageWidget.getWidget().getElement());
			this.compensateWidthBorder();
		}

		if (scaleInt(popupHeight, scale.scaleY) >= windowHeight){
			this.pageWidget.getWidget().getElement().getStyle().setOverflowY(Overflow.AUTO);
			this.forceHardwareAcceleration(this.pageWidget.getWidget().getElement());
			this.compensateHeightBorder();
		}
		
		int top;
		if (Math.abs(parentWidget.getAbsoluteTop()) > Window.getScrollTop()) {
			top = Math.abs(parentWidget.getAbsoluteTop());
		} else {
			top = Window.getScrollTop();
		}
		
		int height = getElement().getClientHeight();
		if (height < windowHeight) {
			height = windowHeight;
		}
			
		height += top;
		
		glassStyle.setProperty("top", 0 + "px");
		glassStyle.setProperty("height", height + "px");
		
		center();
	}
	
	private native int getWindowHeight() /*-{
		return $wnd.$($wnd.document).height();
	}-*/;
	
	// This method makes the device use hardware acceleration on the provided element, increasing performance
	private void forceHardwareAcceleration(Element e){
		e.getStyle().setProperty("transform", "translate3d(0,0,0)");
		e.getStyle().setProperty("-webkit-transform", "translate3d(0,0,0)");
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
			int offsetX = scaleInt(parentWidget.getOffsetWidth() - getOffsetWidth(), scale.scaleX);
			left = left+offsetX/2;
			if (left<0) {
				left = 0;
			}
			
			int top;
			if(Math.abs(parentWidget.getAbsoluteTop()) > Window.getScrollTop()){
				top = Math.abs(parentWidget.getAbsoluteTop());
			}
			else{
				top = Window.getScrollTop();
			}

			try{
				top += getParentWindowOffset();
			}catch(Exception e) {
				top += 0;
			}
			
			scrollHandler = Window.addWindowScrollHandler(new ScrollHandler() {
				public void onWindowScroll(ScrollEvent event) {

					restrictScroll();
				}

			});

			if(this.top != null && this.top != "" && this.left != null && this.left != "" && isInteger(this.left) && isInteger(this.top)){
				int propertyLeft = scaleInt(Integer.parseInt(this.left), scale.scaleX);
				int propertyTop = scaleInt(Integer.parseInt(this.top), scale.scaleY);
				setPopupPosition(propertyLeft, propertyTop);
			} else if (this.top != null && this.top != "" && isInteger(this.top)) {
				int propertyTop = scaleInt(Integer.parseInt(this.top), scale.scaleY);
				setPopupPosition(left, propertyTop);
			}else if (this.left != null && this.left != "" && isInteger(this.left)) {
				int propertyLeft = scaleInt(Integer.parseInt(this.left), scale.scaleX);
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
	
	private native int getTopWindowScroll()/*-{
		return $wnd.$(top.window).scrollTop();
	}-*/;
	
	private native void setTopWindowScroll(int scroll)/*-{
		$wnd.$(top.window).scrollTop(scroll);
	}-*/;
	
	private void restrictScroll() {
		int windowHeight = Window.getClientHeight() > getWindowHeight() ? Window.getClientHeight() : getWindowHeight();
		int absoluteTop = Integer.parseInt(this.getElement().getStyle().getProperty("top").replace("px", ""));
		int offsetHeight = scaleInt(getOffsetHeight(), scale.scaleY);
		int scrollTop = getTopWindowScroll();
		int popupBottom = absoluteTop + offsetHeight;
		int windowBottom = scrollTop + windowHeight;
		if (windowHeight > offsetHeight) {
			if (scrollTop > absoluteTop) {
				setTopWindowScroll(absoluteTop);
			}
			else if (popupBottom > windowBottom) {
				int diff = popupBottom-windowBottom;
				setTopWindowScroll(scrollTop + diff);
			}
		}
		else{
			int top = absoluteTop + (offsetHeight - windowHeight);
			if(scrollTop > top){
				setTopWindowScroll(top);
			}
			else if(absoluteTop > scrollTop) {
				setTopWindowScroll(absoluteTop);
			}
		}
	}
	
	private void compensateHeightBorder(){
		int popupHeight = this.pageWidget.getOffsetHeight();
		int borderHeight = this.getBorderHeight();
		int popupWithoutBorder = popupHeight - borderHeight;
		popupHeightWithoutBorder = popupWithoutBorder;

		this.pageWidget.setHeight(popupWithoutBorder);
	}
	
	private void compensateWidthBorder(){
		int popupWidth = this.pageWidget.getOffsetWidth();
		int borderWidth = this.getBorderWidth();
		int popupWithoutBorder = popupWidth - borderWidth;
		
		this.pageWidget.setWidth(popupWithoutBorder);
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
		if (scrollHandler!=null) {
			scrollHandler.removeHandler();
		}
		hide();
		pageController.getPlayerController().setPopupEnabled(false);
		pageController.closePage();

		ValueChangedEvent valueEvent = new ValueChangedEvent("Popup", popupName, "closed", "");
		this.openingPageController.getPlayerServices().getEventBus().fireEvent(valueEvent);
	}
	
	private int scaleInt(int value, double scale) {
		return new Double(value * scale).intValue();
	}
	
}
