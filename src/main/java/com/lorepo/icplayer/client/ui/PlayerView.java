package com.lorepo.icplayer.client.ui;

import com.gargoylesoftware.htmlunit.javascript.host.Screen;
import com.google.gwt.core.shared.GWT;
import com.google.gwt.dom.client.Document;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.logical.shared.ResizeEvent;
import com.google.gwt.event.logical.shared.ResizeHandler;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Event;
import com.google.gwt.user.client.Timer;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.ui.PopupPanel;
import com.google.gwt.user.client.ui.PopupPanel.PositionCallback;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.lorepo.icplayer.client.IPlayerController;
import com.lorepo.icplayer.client.page.PageView;
import com.lorepo.icplayer.client.ui.NavigationBar;
import com.lorepo.icplayer.client.utils.widget.WaitDialog;

public class PlayerView extends VerticalPanel{

	private IPlayerController playerController;
	private HorizontalPanel contentPanel;
	private PageView pageView1;
	private PageView pageView2;
	private PageView headerView;
	private PageView footerView;
	private WaitDialog	waitDlg;
	private NavigationButton nextPageButton = new NavigationButton("ic_navi_panel_next");
	private NavigationButton prevPageButton = new NavigationButton("ic_navi_panel_prev");
	private NavigationBar navigationBar;
	
	
	public PlayerView(){
		initUI();
		DOM.sinkEvents(this.getElement(), Event.ONCLICK);
	}


	private void initUI() {
		
		setStyleName("ic_player");
		
		waitDlg = new WaitDialog();
		pageView1 = new PageView("ic_page");
		contentPanel = new HorizontalPanel();
		contentPanel.addStyleName("ic_content");
		contentPanel.add(pageView1);
		add(contentPanel);
		prevPageButton.setAutoHideEnabled(false);
		prevPageButton.addClickHandler(new ClickHandler() {
			public void onClick(ClickEvent event) {
				prevPage();
			}
		});
		nextPageButton.setAutoHideEnabled(false);
		nextPageButton.addClickHandler(new ClickHandler() {
			public void onClick(ClickEvent event) {
				nextPage();
			}
		});
		if(playerController != null){
			navigationBar = new NavigationBar(playerController.getModel(), playerController);
		}
		
		Window.addResizeHandler(new ResizeHandler() {
			@Override
			public void onResize(ResizeEvent event) {
				prevPageButton.hide();
				nextPageButton.hide();
                if (navigationBar != null){
				    navigationBar.hide();

                }
			}
		});
	}
	
	
	protected void nextPage() {
		if(playerController != null){
			playerController.switchToNextPage();
			hideNavigationPanels();
		}
	}

	protected void prevPage() {
		if(playerController != null){
			playerController.switchToPrevPage();
			hideNavigationPanels();
		}
	}


	@Override
	public void onBrowserEvent(Event event) {

		final int eventType = DOM.eventGetType(event);
		// Can use prevent default because video stops working then
//		event.preventDefault();
		event.stopPropagation();
		
		if (Event.ONCLICK == eventType) {
			if(navigationBar == null){
				navigationBar = new NavigationBar(playerController.getModel(), playerController);
			}
			toggleNavigationPanels();
			event.stopPropagation();
			event.preventDefault();
		}
		if ( Event.ONKEYDOWN == eventType) {
        if (event.getKeyCode() == KeyCodes.KEY_ESCAPE) {
        	toggleNavigationPanels();
			event.stopPropagation();
			event.preventDefault();
        }
		}
		
	}
	
	public static native int getScreenHeight() /*-{
	return $wnd.innerHeight;
	}-*/;
	
	
	private void toggleNavigationPanels() {
		if(navigationBar.isShowing()) {
			hideNavigationPanels();
		} else {
			boolean isMobile = false;
			if (Window.Navigator.getUserAgent().matches("(.*)Android(.*)") || Window.Navigator.getUserAgent().matches("(.*)iPad(.*)") || Window.Navigator.getUserAgent().matches("(.*)iPhone(.*)")) {
				isMobile = true;
			}
			final int left = getAbsoluteLeft();
			final int top = Math.max(getAbsoluteTop(), Window.getScrollTop());
			final int right = left + getOffsetWidth();
			final int height = Math.min(getOffsetHeight()-top, Window.getClientHeight());
			int panelTop_tmp;
			int mobileTop = 17;
			if (isMobile) mobileTop = 0;
			if (Window.Navigator.getUserAgent().matches("(.*)iPhone(.*)")) mobileTop = -(getScreenHeight() - Window.getClientHeight()); 
			if ((getOffsetHeight() + getAbsoluteTop() - Window.getScrollTop() ) < Window.getClientHeight()){
				panelTop_tmp = getOffsetHeight() +getAbsoluteTop()- mobileTop;
			} else{
				panelTop_tmp = Window.getClientHeight()+ Window.getScrollTop() - mobileTop;
			}
			final int panelTop	= panelTop_tmp;
			
			prevPageButton.setPopupPositionAndShow(new PopupPanel.PositionCallback() {
				public void setPosition(int offsetWidth, int offsetHeight) {
					prevPageButton.setPopupPosition(left, top +(height-offsetHeight)/2);
					prevPageButton.show();
				}
	        });
			
			nextPageButton.setPopupPositionAndShow(new PopupPanel.PositionCallback() {
				public void setPosition(int offsetWidth, int offsetHeight) {
					nextPageButton.setPopupPosition(right-offsetWidth, top +(height-offsetHeight)/2);
					nextPageButton.show();
				}
	        });
			
			navigationBar.setWidth((getOffsetWidth())+"px");
			navigationBar.getWidget().setWidth((getOffsetWidth()-41)+"px");
			navigationBar.setPopupPositionAndShow(new PopupPanel.PositionCallback() {
				public void setPosition(int offsetWidth, int offsetHeight) {
					navigationBar.setPopupPosition(left, (panelTop - offsetHeight));
					navigationBar.setGlassEnabled(false);
				}
	        });
			
			prevPageButton.getElement().addClassName("ic_navi_panel_animation");
			nextPageButton.getElement().addClassName("ic_navi_panel_animation");
			
			
		}
	}

	public void hideNavigationPanels() {
		prevPageButton.getElement().removeClassName("ic_navi_panel_animation");
		nextPageButton.getElement().removeClassName("ic_navi_panel_animation");
		
		Timer t = new Timer() {
			@Override
			public void run() {
				prevPageButton.hide();
				nextPageButton.hide();
				navigationBar.hide();
			}
		};
		t.schedule(1);
	}

	public void showHeader(){
		headerView = new PageView("ic_header");
		insert(headerView, 0);
	}
	
	public void showFooter(){
		
		footerView = new PageView("ic_footer");
		add(footerView);
	}
	
	public PageView getPageView(int pageIndex){
		if(pageIndex == 1 && pageView2 != null){
			return pageView2;
		}
		else{
			return pageView1;
		}
	}


	public PageView getHeaderView(){
		return headerView;
	}
	
	
	public PageView getFooterView(){
		return footerView;
	}


	public void showWaitDialog() {
		waitDlg.setPopupPositionAndShow(new PositionCallback() {
			public void setPosition(int offsetWidth, int offsetHeight) {
				int left = getAbsoluteLeft() + (getOffsetWidth()-offsetHeight)/2;
				int top = Math.max(getAbsoluteTop(), 0)+100;
				waitDlg.setPopupPosition(left, top);
			}
		});
	}


	public void hideWaitDialog() {
		waitDlg.hide();
	}


	public void showTwoPages() {
		if(pageView2 == null){
			pageView2 = new PageView("ic_page");
		}
		if(contentPanel.getWidgetIndex(pageView2) == -1){
			contentPanel.add(pageView2);
		}
	}


	public void showSinglePage() {
		if(pageView2 != null){
			contentPanel.remove(pageView2);
		}
	}


	public void setPlayerController(IPlayerController playerController) {
		this.playerController = playerController;
	}
}
