package com.lorepo.icplayer.client.ui;

import com.google.gwt.user.client.ui.PopupPanel.PositionCallback;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.lorepo.icplayer.client.page.PageView;
import com.lorepo.icplayer.client.utils.widget.WaitDialog;

public class PlayerView extends VerticalPanel{

	private PageView pageView;
	private PageView headerView;
	private PageView footerView;
	private WaitDialog	waitDlg;
	
	
	public PlayerView(){
		initUI();
	}


	private void initUI() {
		
		setStyleName("ic_player");
		
		waitDlg = new WaitDialog();
		pageView = new PageView();
		pageView.addStyleName("ic_mainPage");
		add(pageView);
	}
	
	
	public void showHeader(){
		
		headerView = new PageView();
		headerView.addStyleName("ic_header");
		insert(headerView, 0);
	}
	
	public void showFooter(){
		
		footerView = new PageView();
		footerView.addStyleName("ic_footer");
		add(footerView);
	}
	
	public PageView getPageView(){
		return pageView;
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
}
