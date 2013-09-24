package com.lorepo.icplayer.client.ui;

import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Event;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.ui.PopupPanel.PositionCallback;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.page.PageView;
import com.lorepo.icplayer.client.utils.widget.WaitDialog;

public class PlayerView extends VerticalPanel{

	private HorizontalPanel contentPanel;
	private PageView pageView1;
	private PageView pageView2;
	private PageView headerView;
	private PageView footerView;
	private WaitDialog	waitDlg;
	
	
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
	}
	
	
	@Override
	public void onBrowserEvent(Event event) {

		final int eventType = DOM.eventGetType(event);
		event.preventDefault();
		event.stopPropagation();

		if (Event.ONCLICK == eventType) {
			toggleNavigationPanels();
		}
	}
	
	
	private void toggleNavigationPanels() {
		JavaScriptUtils.log("toggle panels");
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
}
