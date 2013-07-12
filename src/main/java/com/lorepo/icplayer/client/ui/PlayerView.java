package com.lorepo.icplayer.client.ui;

import com.google.gwt.user.client.ui.Panel;
import com.google.gwt.user.client.ui.PopupPanel.PositionCallback;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.google.gwt.user.client.ui.Widget;
import com.lorepo.icplayer.client.module.api.player.IPlayerView;
import com.lorepo.icplayer.client.page.FlowPageView;
import com.lorepo.icplayer.client.page.PageController.IPageDisplay;
import com.lorepo.icplayer.client.page.PageView;
import com.lorepo.icplayer.client.utils.widget.WaitDialog;

public class PlayerView extends VerticalPanel implements IPlayerView{

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
	
	public PageView getAbsolutePageView(){
		replaceView(new PageView());
		return (PageView) pageView;
	}
	
	
	public IPageDisplay getFlowPageView() {
		replaceView(new FlowPageView());
		return (IPageDisplay) pageView;
	}


	private void replaceView(Panel view) {
		int index = getWidgetIndex(pageView);
		if(index >= 0){
			insert(view, index);
			remove(pageView);
		}
		else{
			add(view);
		}
		pageView = view;
		pageView.addStyleName("ic_mainPage");
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


	@Override
	public Widget getAsWidget() {
		return this;
	}
}
