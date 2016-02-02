package com.lorepo.icplayer.client.page;

import java.util.ArrayList;
import java.util.HashMap;

import com.google.gwt.user.client.ui.SimplePanel;
import com.google.gwt.user.client.ui.Widget;
import com.lorepo.icplayer.client.model.Page;
import com.lorepo.icplayer.client.model.Page.LayoutType;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.page.PageController.IPageDisplay;

public class PageView extends SimplePanel implements IPageDisplay{

	private IPageDisplay display;
	private String styleName;
	
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
		setWidget(innerPanel);
		display.setPage(page);
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
	public void runKeyboardNavigation(ArrayList<IPresenter> presenters) {
		if (styleName.equals("ic_page")) {
			display.runKeyboardNavigation(presenters);
		}

	}
}
