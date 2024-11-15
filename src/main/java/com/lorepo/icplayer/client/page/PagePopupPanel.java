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
import com.lorepo.icplayer.client.utils.DevicesUtils;
import com.lorepo.icplayer.client.xml.IProducingLoadingListener;
import com.lorepo.icplayer.client.xml.page.PageFactory;
import com.lorepo.icplayer.client.model.page.PopupPage;

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

	public void showPage(PopupPage page, String baseUrl) {
		if(page.isLoaded()){
			initPanel(page);
		}
		else{
			loadPage(page, baseUrl);
		}

		popupName = page.getName();
	}


	private void loadPage(PopupPage page, String baseUrl) {
		String url = URLUtils.resolveURL(baseUrl, page.getHref());
		PageFactory factory = new PageFactory((PopupPage) page);

		factory.load(url, new IProducingLoadingListener () {

			@Override
			public void onFinishedLoading(Object producedItem) {
				PopupPage page = (PopupPage) producedItem;
				initPanel(page);
			}

			@Override
			public void onError(String error) {
				JavaScriptUtils.log("Can't load page: " + error);
			}
		});
	}

	private void initPanel(PopupPage page) {
		pageWidget = new PageView("ic_popup_page");
		String classes = additionalClasses == "" ? "ic_popup" : "ic_popup " + additionalClasses;

		if(this.layoutID.length()>0 && page.getSizes().containsKey(this.layoutID)) {
			page.setSemiResponsiveLayoutID(this.layoutID);
		}

		setStyleName(classes);
		setAnimationEnabled(true);
		setGlassEnabled(true);
		setModal(false);
		setWidget(pageWidget);

		if (this.icplayer!=null) {
			scale = this.icplayer.getScaleInformation();
		}
		this.getElement().getStyle().setProperty("transform", scale.transform);
		this.getElement().getStyle().setProperty("transform-origin", scale.transformOrigin);

		int windowWidth = Window.getClientWidth();
		int windowHeight = Window.getClientHeight();

		int popupWidth = page.getWidth();
		int popupHeight = page.getHeight();

		page.setOriginalHeight(popupHeight);
		page.setOriginalWidth(popupWidth);

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

		int maxHeight = Window.getClientHeight() > getWindowHeight() ? Window.getClientHeight() : getWindowHeight();

		int height = getElement().getClientHeight();
		if (height < maxHeight) {
			height = maxHeight;
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

	/**
	 * Center popup
	 * @param parentWidget
	 */
	public void center() {
		if (parentWidget == null) {
			return;
		}
		
		if (this.top != null && this.top != "" && this.left != null && this.left != "" && isInteger(this.left) && isInteger(this.top)){
			int propertyLeft = adjustLeftFromProperty();
			int propertyTop = adjustTopFromProperty();
			setPopupPosition(propertyLeft, propertyTop);
		} else if (this.top != null && this.top != "" && isInteger(this.top)) {
			int propertyTop = adjustTopFromProperty();
			int calculatedLeft = calculateLeftWhenCentred();
			setPopupPosition(calculatedLeft, propertyTop);
		} else if (this.left != null && this.left != "" && isInteger(this.left)) {
			int propertyLeft = adjustLeftFromProperty();
			int calculatedTop = calculateTopWhenCentred();
			setPopupPosition(propertyLeft, calculatedTop);
		} else {
			int calculatedTop = calculateTopWhenCentred();
			int calculatedLeft = calculateLeftWhenCentred();
			setPopupPosition(calculatedLeft, calculatedTop);
		}
	}
	
	private int calculateTopWhenCentred() {
		return calculateTopWhenCentred(this.getElement());
	}
	
	private static native int calculateTopWhenCentred(Element popupElement) /*-{
		var elementHeight = popupElement.getBoundingClientRect().height;
		return $wnd.PositioningUtils.calculateTopForPopupToBeCentred(elementHeight);
	}-*/;
	
	private int calculateLeftWhenCentred() {
		return calculateLeftWhenCentred(this.getElement());
	}
	
	private static native int calculateLeftWhenCentred(Element popupElement) /*-{
		var elementWidth = popupElement.getBoundingClientRect().width;
		return $wnd.PositioningUtils.calculateLeftForPopupToBeCentred(elementWidth);
	}-*/;
	
	private int adjustTopFromProperty() {
		return getTopOffset(parentWidget.getAbsoluteTop()) + scaleInt(Integer.parseInt(this.top), scale.baseScaleY);
	}
	
	private int adjustLeftFromProperty() {
		return parentWidget.getAbsoluteLeft() + scaleInt(Integer.parseInt(this.left), scale.baseScaleX);
	}
	
	private static native int getTopOffset(int absoluteTop) /*-{
		if ($wnd.DevicesUtils.isFirefox()) {
			return 0;
		}
		return absoluteTop + $wnd.pageYOffset;
	}-*/;

	public boolean isInteger(String s) {
      boolean isValidInteger = false;
      try{
         Integer.parseInt(s); 
         isValidInteger = true;
      }
      catch (NumberFormatException ex){}
 
      return isValidInteger;
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
