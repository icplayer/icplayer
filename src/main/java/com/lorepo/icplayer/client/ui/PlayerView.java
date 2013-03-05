package com.lorepo.icplayer.client.ui;

import com.google.gwt.user.client.ui.Panel;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.lorepo.icplayer.client.page.FlowPageView;
import com.lorepo.icplayer.client.page.PageController.IDisplay;
import com.lorepo.icplayer.client.page.PageView;

public class PlayerView extends VerticalPanel{

	Panel pageView;
	PageView headerView;
	PageView footerView;
	
	
	public PlayerView(){
		initUI();
	}


	private void initUI() {
		
		setStyleName("ic_player");
		
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
}
