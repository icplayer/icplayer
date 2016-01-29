package com.lorepo.icplayer.client.page;

import java.util.HashMap;

import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.ui.AbsolutePanel;
import com.google.gwt.user.client.ui.Widget;
import com.lorepo.icplayer.client.model.Page;
import com.lorepo.icplayer.client.module.api.ILayoutDefinition;
import com.lorepo.icplayer.client.module.api.ILayoutDefinition.Property;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.page.PageController.IPageDisplay;
import com.lorepo.icplayer.client.utils.DOMUtils;
import com.lorepo.icplayer.client.utils.MathJax;

public class AbsolutePageView extends AbsolutePanel implements IPageDisplay{

	private Page currentPage;
	private HashMap<String, Widget> widgets = new HashMap<String, Widget>();
	private KeyboardNavigationController navigation = new KeyboardNavigationController();
	
	public AbsolutePageView(){
		addStyleName("ic_page");
	}
	
	@Override
	public void setPage(Page newPage) {
	
		currentPage = newPage;
		String styles = "position:relative;overflow:hidden;";
		if(currentPage.getInlineStyle() != null){
			styles += currentPage.getInlineStyle(); 
			
		}
		DOMUtils.applyInlineStyle(getElement(), styles);
		if(!currentPage.getStyleClass().isEmpty()){
			addStyleName(currentPage.getStyleClass());
		}
		getElement().setId(currentPage.getId());
		removeAllModules();
	}


	@Override
	public void refreshMathJax() {
		MathJax.refreshMathJax(getElement());
	}
	
	@Override
	public void addModuleView(IModuleView view, IModuleModel module){

		int left, right, width, top, bottom, height;
		
		if(view instanceof Widget){
			Widget moduleView = (Widget) view;
			ILayoutDefinition layout = module.getLayout();
			
			if(layout.hasLeft()){
				left = calculatePosition(layout.getLeftRelativeTo(), 
						layout.getLeftRelativeToProperty(), module.getLeft());
				if(layout.hasRight()){
					right = calculatePosition(layout.getRightRelativeTo(), 
							layout.getRightRelativeToProperty(), -module.getRight());
					width = right-left;
				}
				else{
					width = module.getWidth();
				}
			}
			else{
				right = calculatePosition(layout.getRightRelativeTo(), 
						layout.getRightRelativeToProperty(), -module.getRight());
				width = module.getWidth();
				left = right-width;
			}
			
			if(layout.hasTop()){
				top = calculatePosition(layout.getTopRelativeTo(), 
						layout.getTopRelativeToProperty(), module.getTop());
				if(layout.hasBottom()){
					bottom = calculatePosition(layout.getBottomRelativeTo(), 
							layout.getBottomRelativeToProperty(), -module.getBottom());
					height = bottom-top;
				}
				else{
					height = module.getHeight();
				}
			}
			else{
				bottom = calculatePosition(layout.getBottomRelativeTo(), 
						layout.getBottomRelativeToProperty(), -module.getBottom());
				height = module.getHeight();
				top = bottom-height;
			}
			
			moduleView.setPixelSize(width, height);
		    add(moduleView, left, top);
		    widgets.put(module.getId(), moduleView);
		    navigation.addToNavigation(module, moduleView);
		}
	}

	private int calculatePosition(String widgetName, Property property, int modulePos) {
		int pageWidth = DOM.getElementPropertyInt(getElement(), "clientWidth");
		int pageHeight = DOM.getElementPropertyInt(getElement(), "clientHeight");
		int pos = 0;
		Widget widget = widgets.get(widgetName);
		
		if(property == Property.left){
			if(widget != null){
				pos = widget.getAbsoluteLeft()-getAbsoluteLeft()+modulePos;
			}
			else{
				pos = modulePos;
			}
		}
		else if(property == Property.right){
			if(widget != null){
				pos = widget.getAbsoluteLeft()+widget.getOffsetWidth()-getAbsoluteLeft()+modulePos;
			}
			else{
				pos = pageWidth+modulePos;
			}
		}
		else if(property == Property.top){
			if(widget != null){
				pos = widget.getAbsoluteTop()-getAbsoluteTop()+modulePos;
			}
			else{
				pos = modulePos;
			}
		}
		else if(property == Property.bottom){
			if(widget != null){
				pos = widget.getAbsoluteTop()+widget.getOffsetHeight()-getAbsoluteTop()+modulePos;
			}
			else{
				pos = pageHeight+modulePos;
			}
		}
		
		return pos;
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
		widgets.clear();
		clear();
	}
	
	@Override
	public void runKeyboardNavigation() {
		navigation.run();
	}
}
