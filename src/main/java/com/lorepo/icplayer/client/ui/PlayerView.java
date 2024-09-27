package com.lorepo.icplayer.client.ui;

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
import com.google.gwt.user.client.ui.VerticalPanel;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.IPlayerController;
import com.lorepo.icplayer.client.page.PageView;
import com.lorepo.icplayer.client.utils.DevicesUtils;
import com.lorepo.icplayer.client.utils.widget.WaitDialog;
import com.google.gwt.user.client.ui.PopupPanel.PositionCallback;


public class PlayerView extends VerticalPanel{

	private IPlayerController playerController;
	private HorizontalPanel contentPanel;
	private PageView pageView1;
	private PageView pageView2;
	private PageView headerView;
	private PageView footerView;
	private WaitDialog	waitDialog;
	private NavigationButton nextPageButton = new NavigationButton("ic_navi_panel_next");
	private NavigationButton prevPageButton = new NavigationButton("ic_navi_panel_prev");
	private NavigationBar navigationBar;
	private boolean navigationPanelsAutomaticAppearance = true;
	private boolean disableNavigationPanels = false;
	
	public PlayerView(){
		initUI();
		DOM.sinkEvents(this.getElement(), Event.ONCLICK);
	}

	private void initUI() {

		setStyleName("ic_player");
		getElement().setAttribute("role", "presentation");
		
		this.createWaitDailog();
		pageView1 = new PageView("ic_page");
		contentPanel = new HorizontalPanel();
		contentPanel.addStyleName("ic_content");
		contentPanel.getElement().setAttribute("role", "presentation");
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

	public void createWaitDailog() {
		waitDialog = new WaitDialog();
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
		if (this.disableNavigationPanels) return;
		final int eventType = DOM.eventGetType(event);
		// Can use prevent default because video stops working then
//		event.preventDefault();
		event.stopPropagation();

		if (Event.ONCLICK == eventType) {
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
	
	private void checkNavigationBar() {
		if(navigationBar == null){
			navigationBar = new NavigationBar(playerController.getModel(), playerController);
		}
	}
	
	private void toggleNavigationPanels() {
		if (!navigationPanelsAutomaticAppearance) {
			return;
		}
		checkNavigationBar();
		if(navigationBar.isShowing()) {
			hideNavigationPanels();
		} else {
			showNavigationPanels();
		}
	}
	
	public void showNavigationPanels() {
		checkNavigationBar();
		if(playerController.getModel().getPageCount() > 1) {
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
		if(navigationBar == null){
			return;
		}
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
	
	public void setNavigationPanelsAutomaticAppearance(boolean shouldAppear) {
		navigationPanelsAutomaticAppearance = shouldAppear;
	}

	public void createHeader(){
		headerView = new PageView("ic_header");
		insert(headerView, 0);
	}
	
	public void createFooter(){		
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
	
	public void removeHeaderView() {
		if (this.headerView != null) {
			this.remove(this.headerView);
			this.headerView = null;
		}
	}
	
	public void removeFooterView() {
		if (this.footerView != null) {
			this.remove(this.footerView);
			this.footerView = null;
		}
	}


	public PageView getHeaderView(){
		return headerView;
	}
	
	
	public PageView getFooterView(){
		return footerView;
	}

	public void showWaitDialog() {
		if (!isWaitDialogVisible()) {
			waitDialog.show();
			waitDialog.centerElement();
		}
	}
	
	private native boolean isWaitDialogVisible() /*-{
		return $wnd.$('.ic_waitdlg').is(':visible');
	}-*/;
	
	native static int getTopWindowInnerHeight() /*-{
		var height = 100;
		try {
			height = $wnd.window.top[0].innerHeight;
		} catch(e) {
			try {
				height = $wnd.window.top.innerHeight;
			} catch (e) {}
		}
		return height;
	}-*/;
	
	public void hideWaitDialog() {
		waitDialog.hide();
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

	public void setDisableNavigationPanels(boolean disableNavigationPanels) {
		this.disableNavigationPanels = disableNavigationPanels;
	}
}
