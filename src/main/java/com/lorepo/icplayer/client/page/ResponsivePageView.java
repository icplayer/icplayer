package com.lorepo.icplayer.client.page;

import com.google.gwt.user.client.ui.FlowPanel;
import com.google.gwt.user.client.ui.Widget;
import com.lorepo.icplayer.client.model.Page;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.page.PageController.IPageDisplay;
import com.lorepo.icplayer.client.utils.DOMUtils;
import com.lorepo.icplayer.client.utils.MathJax;


/**
 * This view is used with flow layout
 * 
 * @author Krzysztof Langner
 *
 */
public class ResponsivePageView extends FlowPanel implements IPageDisplay{

	private Page currentPage;

	public ResponsivePageView(){
		addStyleName("ic_flowPage");
	}
	

	@Override
	public void setPage(Page newPage) {
	
		currentPage = newPage;
		String styles = "";
		if(currentPage.getInlineStyle() != null){
			styles += currentPage.getInlineStyle(); 
		}
		DOMUtils.applyInlineStyle(getElement(), styles);
		if(!currentPage.getStyleClass().isEmpty()){
			addStyleName(currentPage.getStyleClass());
		}
		
		removeAllModules();
	}


	@Override
	public void refreshMathJax() {
		MathJax.refreshMathJax(getElement());
	}


	@Override
	public void addModuleView(IModuleView view, IModuleModel module){
		
		if(view instanceof Widget){
			Widget moduleView = (Widget) view;
			
			moduleView.addStyleName("ic_module");
		    add(moduleView);
		}
	}


	@Override
	public void setWidth(int width) {
		setWidth(width+"px");
	}


	@Override
	public void setHeight(int height) {
		setHeight(height+"px");
	}


	@Override
	public void removeAllModules() {
		clear();
	}

	@Override
	public void runKeyboardNavigation() {
		// TODO Auto-generated method stub
		
	}
}
