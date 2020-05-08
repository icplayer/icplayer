package com.lorepo.icplayer.client.page;

import java.util.HashMap;

import com.gargoylesoftware.htmlunit.javascript.background.JavaScriptStringJob;
import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Document;
import com.google.gwt.dom.client.Style.Unit;
import com.google.gwt.event.shared.HandlerRegistration;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONValue;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.Window.ScrollEvent;
import com.google.gwt.user.client.rpc.AsyncCallback;
import com.google.gwt.user.client.ui.SimplePanel;
import com.google.gwt.user.client.ui.Widget;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.model.page.Page.LayoutType;
import com.lorepo.icplayer.client.model.page.group.Group;
import com.lorepo.icplayer.client.model.page.group.GroupView;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.page.PageController.IPageDisplay;
import com.lorepo.icplayer.client.utils.PlayerUtils;

public class PageView extends SimplePanel implements IPageDisplay {

	private IPageDisplay display;
	private String styleName;
	private Widget innerPanel;
	private HandlerRegistration onScrollHandler = null;
	private JavaScriptObject onMessageHandler = null;
	private Page page;
	private boolean isStaticFooter = false;
	
	public PageView(String styleName){
		this.styleName = styleName;
		addStyleName("ic_page_panel");
	}

	@Override
	public void setPage(Page page) {
	
		Widget innerPanel;
		if(page.getLayout() == LayoutType.responsive){
			ResponsivePageView panel = new ResponsivePageView();
			innerPanel = panel;
			display = panel;
		}
		else{
			AbsolutePageView panel = new AbsolutePageView();
			innerPanel = panel;
			display = panel;
		}
		
		innerPanel.setStyleName(styleName);
		this.innerPanel = innerPanel;
		setWidget(innerPanel);
		display.setPage(page);
		this.page = page;
		
		if (this.isStaticFooter) {
			DOM.setStyleAttribute(this.innerPanel.getElement(), "top", "0");
		}
	}

	@Override
	public void refreshMathJax() {
		display.refreshMathJax();
	}


	@Override
	public void addModuleView(IModuleView view, IModuleModel module){
		display.addModuleView(view, module);
	}
	
	@Override
	public void addModuleViewIntoGroup(IModuleView view, IModuleModel module, String groupId) {
		display.addModuleViewIntoGroup(view, module, groupId);
	}

	public void addGroupView(GroupView groupView) {
		display.addGroupView(groupView);
	}
	
	@Override
	public void setWidth(int width) {
		display.setWidth(width);
	}


	@Override
	public void setHeight(int height) {
		display.setHeight(height);
	}

	@Override
	public void removeAllModules() {
		if(display != null){
			display.removeAllModules();
		}
	}

	@Override
	public HashMap<String, Widget> getWidgets() {
		if (display != null) {
			return display.getWidgets();
		}
		
		return null;
	}
	
	@Override
	public void outstretchHeight (int y, int difference, boolean isRestore, boolean dontMoveModules) {
		this.display.outstretchHeight(y, difference, isRestore, dontMoveModules);
	}

	@Override
	public void recalculatePageDimensions() {
		this.display.recalculatePageDimensions();
	}
	
	@Override
	public void setAsStaticFooter() {
		this.isStaticFooter = true;
		this.addStyleName("ic_static_footer");
		if (this.innerPanel != null) {
			DOM.setStyleAttribute(this.innerPanel.getElement(), "top", "0");
		}
		
		this.onScroll(new AsyncCallback<Float>() {

			@Override
			public void onFailure(Throwable caught) {
			}

			@Override
			public void onSuccess(Float result) {
				if (PlayerUtils.isInIframe()) {
					float offset = PlayerUtils.getAbsTopOffset();
					float scale = PlayerUtils.getFrameScale();
					int iframeSize = PlayerUtils.getIframeInnerHeight();
					float sum = (iframeSize - page.getHeight() + result) / scale - offset;
					
					if (sum >= PlayerUtils.getIframeHeight() - page.getHeight()) {
						DOM.setStyleAttribute(getElement(), "top", "auto");
					} else {
						DOM.setStyleAttribute(getElement(), "top", String.valueOf(sum) + "px");
					}
				} else {
					String refferer = Document.get().getReferrer();
					if (refferer.indexOf(JavaScriptUtils.getOrigin()) > -1) {
						int offset = 0;
						if (PlayerUtils.getIframe() != null) {
							offset = PlayerUtils.getIframeOffset();
						}
						
						float sum = JavaScriptUtils.getTopInnerHeight() - offset - page.getHeight() + result;
						int iframeHeight = 0;
						
						if (PlayerUtils.getIframe() != null) {
							iframeHeight = PlayerUtils.getIframeHeight();
						}
						
						if (sum >= iframeHeight - page.getHeight()) {
							DOM.setStyleAttribute(getElement(), "top", "auto");
						} else {
							DOM.setStyleAttribute(getElement(), "top", String.valueOf(sum) + "px");
						}
					}
				}
			}
		});
	}
	
	@Override
	public void setAsNonStaticFooter() {
		removeStyleName("ic_static_footer");
		getElement().getStyle().clearTop();
		getElement().getStyle().clearPosition();
		getElement().getStyle().clearBottom();
		this.clearScrollEvents();
	}
	
	@Override
	public void setAsStaticHeader() {
		this.addStyleName("ic_static_header");
		this.onScroll(new AsyncCallback<Float>() {

			@Override
			public void onFailure(Throwable caught) {
			}

			@Override
			public void onSuccess(Float scroll) {
				if (PlayerUtils.isInIframe()) {
					int offset = PlayerUtils.getIframeOffset();
					if (PlayerUtils.isEditorPreview()) {
						offset = 0;
					}
					
					float scale = PlayerUtils.getFrameScale();
					
					float outScroll = 0;
					if (scroll > offset) {
						outScroll = (scroll - offset) / scale;
					}
					
					DOM.setStyleAttribute(getElement(), "top", String.valueOf(outScroll) + "px");
				} else {	// This is manager when player is not in iFrame, but header can not go on page header.
					float logoHeight = PlayerUtils.getPlayerOffset();
					
					if (logoHeight > 0) {
						if (scroll < logoHeight) {
							DOM.setStyleAttribute(getElement(), "top", String.valueOf(logoHeight - scroll) + "px");
						} else {
							DOM.setStyleAttribute(getElement(), "top", "0px");
						}
					} else {
						DOM.setStyleAttribute(getElement(), "top", "0px");
					}
				}
			}
		});
		
	}
	
	@Override
	public void setTopOffset(int value) {
		// Move to bottom main page if header is static
		innerPanel.getElement().getStyle().setMarginTop(value, Unit.PX);
	}
	
	@Override
	public void setBottomOffset(int value) {
		innerPanel.getElement().getStyle().setMarginBottom(value, Unit.PX);
	}
	
	@Override
	protected void onUnload () {
		super.onUnload();
		this.clearScrollEvents();
	}
	
	private void clearScrollEvents () {
		if (this.onScrollHandler != null) {
			this.onScrollHandler.removeHandler();
		}
		
		if (this.onMessageHandler != null) {
			JavaScriptUtils.removeOnMessageHandler(this.onMessageHandler);
		}
	}
	
	private void onScroll (final AsyncCallback<Float>callback) {
		if (PlayerUtils.isInIframe()) {
			this.onDifferentDomainScroll(callback);
		} else {
			this.onTheSameDomainScroll(callback);
		}
		
	}
	
	private void onDifferentDomainScroll (final AsyncCallback<Float>callback) {
		this.onMessageHandler = JavaScriptUtils.onMessage(new Callback<String, String>() {

			@Override
			public void onFailure(String reason) {
			}

			@Override
			public void onSuccess(String result) {
				if (result.startsWith("I_FRAME_SIZES:")) {
					JSONValue value = JSONParser.parseStrict(result.substring("I_FRAME_SIZES:".length()));
					float parsedValue = (float) value.isObject().get("offsetTop").isNumber().doubleValue();
					callback.onSuccess(parsedValue);
				}
			}
		});
	}
	
	private void onTheSameDomainScroll (final AsyncCallback<Float>callback) {
		this.onScrollHandler = Window.addWindowScrollHandler(new Window.ScrollHandler() {
			
			@Override
			public void onWindowScroll(ScrollEvent event) {
				callback.onSuccess(Float.valueOf(event.getScrollTop()));
			}
		});
	}
}
