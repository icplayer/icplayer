package com.lorepo.icplayer.client.ui;

import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Event;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.ui.PopupPanel;
import com.google.gwt.user.client.ui.PopupPanel.PositionCallback;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.lorepo.icplayer.client.IPlayerController;
import com.lorepo.icplayer.client.page.PageView;
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
		nextPageButton.setAutoHideEnabled(false);
	}
	
	
	@Override
	public void onBrowserEvent(Event event) {

		final int eventType = DOM.eventGetType(event);
//		event.preventDefault();
		event.stopPropagation();

		if (Event.ONCLICK == eventType) {
			//toggleNavigationPanels();
		}
	}
	
	
	private void toggleNavigationPanels() {
		if(prevPageButton.isShowing()){
			prevPageButton.hide();
			nextPageButton.hide();
		}
		else{
			final int left = getAbsoluteLeft();
			final int top = getAbsoluteLeft();
			final int right = left + getOffsetWidth();
			prevPageButton.setPopupPositionAndShow(new PopupPanel.PositionCallback() {
				public void setPosition(int offsetWidth, int offsetHeight) {
					prevPageButton.setPopupPosition(left, top);
				}
	        });
			nextPageButton.setPopupPositionAndShow(new PopupPanel.PositionCallback() {
				public void setPosition(int offsetWidth, int offsetHeight) {
					nextPageButton.setPopupPosition(right-offsetWidth, top);
				}
	        });
		}
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
