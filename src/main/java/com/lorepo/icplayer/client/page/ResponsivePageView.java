package com.lorepo.icplayer.client.page;

import java.util.HashMap;

import com.google.gwt.user.client.ui.AbsolutePanel;
import com.google.gwt.user.client.ui.FlowPanel;
import com.google.gwt.user.client.ui.Widget;
import com.lorepo.icf.utils.URLUtils;
import com.lorepo.icplayer.client.dimensions.ModuleDimensions;
import com.lorepo.icplayer.client.model.page.Group;
import com.lorepo.icplayer.client.model.page.Page;
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
	private HashMap<String, FlowPanel> groupsPanel = new HashMap<String, FlowPanel>(); 
	
	public ResponsivePageView(){
		addStyleName("ic_flowPage");
	}
	

	@Override
	public void setPage(Page newPage) {
	
		currentPage = newPage;
		String styles = "";
		if(currentPage.getInlineStyle() != null){
			styles += URLUtils.resolveCSSURL(currentPage.getBaseURL(), currentPage.getInlineStyle()); 
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
	
	
	public void addModuleViewIntoGroup(IModuleView view, IModuleModel module, String groupId) {
		if(view instanceof Widget){
			Widget moduleView = (Widget) view;
			FlowPanel groupPanel = groupsPanel.get(groupId); 		 
			groupPanel.add(moduleView);
		    this.widgets.put(module.getId(), moduleView);
		}
	}
	
	public void addGroupView(Group group) {
		FlowPanel groupWidget = new FlowPanel(); 
		groupWidget.getElement().setClassName("modules_group");
		groupWidget.getElement().setId(group.getId());
		groupWidget.setPixelSize(group.getWidth()+2, group.getHeight()+2);
		add(groupWidget); 
		groupsPanel.put(group.getId(), groupWidget);
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
