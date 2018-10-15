package com.lorepo.icplayer.client.page.mockup;

import java.util.ArrayList;
import java.util.HashMap;

import com.google.gwt.user.client.ui.Widget;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.model.page.group.GroupView;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.page.PageController.IPageDisplay;

public class PageViewMockup implements IPageDisplay {

	private Page page;
	private ArrayList<IModuleView> views = new ArrayList<IModuleView>();
	private int width = -1;
	private int height = -1;
	
	
	@Override
	public void setPage(Page page) {
		
		this.page = page; 
		views.clear();
	}

	
	public Page getPage(){
		return page;
	}
	
	public ArrayList<IModuleView> getViews(){
		return views;
	}


	@Override
	public void setWidth(int width) {
		this.width = width;
	}


	@Override
	public void setHeight(int height) {
		this.height = height;
	}
	
	
	public int getWidth(){
		return width;
	}
	
	public int getHeight(){
		return height;
	}


	@Override
	public void addModuleView(IModuleView view, IModuleModel module) {
		views.add(view);
	}


	@Override
	public void refreshMathJax() {
		// TODO Auto-generated method stub
		
	}


	@Override
	public void removeAllModules() {
		views.clear();
	}


	@Override
	public HashMap<String, Widget> getWidgets() {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public void outstretchHeight(int y, int difference, boolean isRestore, boolean dontMoveModules) {
		// TODO Auto-generated method stub
		
	}


	@Override
	public void recalculatePageDimensions() {
		// TODO Auto-generated method stub
		
	}


	@Override
	public void addModuleViewIntoGroup(IModuleView view, IModuleModel module, String groupId) {
		// TODO Auto-generated method stub
		
	}


	@Override
	public void addGroupView(GroupView groupView) {
		// TODO Auto-generated method stub
		
	}
}
