package com.lorepo.icplayer.client.ui;

import com.google.gwt.user.client.ui.Panel;
import com.google.gwt.user.client.ui.PopupPanel.PositionCallback;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.lorepo.icplayer.client.page.FlowPageView;
import com.lorepo.icplayer.client.page.PageController.IDisplay;
import com.lorepo.icplayer.client.page.PageView;
import com.lorepo.icplayer.client.utils.widget.WaitDialog;

public class PlayerView extends VerticalPanel{

	private Panel pageView;
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
		add(pageView);
	}
	
	
	public void showHeader(){
		
		headerView = new PageView();
		insert(headerView, 0);
	}
	
	public void showFooter(){
		
		footerView = new PageView();
		add(footerView);
	}
	
	public PageView getAbsolutePageView(){
		replaceView(new PageView());
		return (PageView) pageView;
	}
	
	
	public IDisplay getFlowPageView() {
		replaceView(new FlowPageView());
		return (IDisplay) pageView;
	}


	private void replaceView(Panel view) {
		int index = getWidgetIndex(pageView);
		insert(view, index);
		remove(pageView);
		pageView = view;
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
