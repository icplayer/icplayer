package com.lorepo.icplayer.client.page;

import com.google.gwt.user.client.ui.SimplePanel;
import com.lorepo.icplayer.client.model.Page;
import com.lorepo.icplayer.client.model.Page.LayoutType;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.page.PageController.IPageDisplay;


/**
 * Base class for different page layouts
 * 
 * @author Krzysztof Langner
 *
 */
public class PageView extends SimplePanel implements IPageDisplay{

	private IPageDisplay display;

	
	public PageView(){
		addStyleName("ic_page_panel");
	}

	@Override
	public void setPage(Page page) {
	
		if(page.getLayout() == LayoutType.flow){
			FlowPageView panel = new FlowPageView();
			setWidget(panel);
			display = panel;
		}
		else{
			AbsolutePageView panel = new AbsolutePageView();
			setWidget(panel);
			display = panel;
		}
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

}
