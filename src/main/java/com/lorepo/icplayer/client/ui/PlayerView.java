package com.lorepo.icplayer.client.ui;

import com.google.gwt.user.client.ui.VerticalPanel;
import com.lorepo.icplayer.client.page.PageView;

public class PlayerView extends VerticalPanel {

	PageView pageView;
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
	
	public PageView getPageView(){
		return pageView;
	}
	
	
	public PageView getHeaderView(){
		return headerView;
	}
	
	
	public PageView getFooterView(){
		return footerView;
	}
}
