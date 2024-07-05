package com.lorepo.icplayer.client.page;

import java.util.HashMap;

import com.google.gwt.user.client.ui.FlowPanel;
import com.google.gwt.user.client.ui.Widget;
import com.lorepo.icf.utils.URLUtils;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.model.page.group.Group;
import com.lorepo.icplayer.client.model.page.group.GroupView;
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
	private HashMap<String, Widget> widgets = new HashMap<String, Widget>();
	
	public ResponsivePageView(){
		addStyleName("ic_flowPage");
	}
	

	@Override
	public void setPage(Page newPage) {
	
		currentPage = newPage;
		String styles = "";
		if (currentPage.getInlineStyle() != null){
			styles += URLUtils.resolveCSSURL(currentPage.getBaseURL(), currentPage.getInlineStyle(), currentPage.getContentBaseURL());
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
		    widgets.put(module.getId(), moduleView);
		}
	}
	
	@Override
	public void addModuleViewIntoGroup(IModuleView view, IModuleModel module, String groupId) {
		// TODO Auto-generated method stub
	}
	
	@Override
	public void addGroupView(GroupView groupView) {
		// TODO Auto-generated method stub
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
	public HashMap<String, Widget> getWidgets() {
		return widgets;
	}


	@Override
	public void outstretchHeight(int y, int difference, boolean isRestore,
			boolean dontMoveModules) {
		// TODO Auto-generated method stub
		
	}


	@Override
	public void recalculatePageDimensions() {
		// TODO Auto-generated method stub
		
	}
}
