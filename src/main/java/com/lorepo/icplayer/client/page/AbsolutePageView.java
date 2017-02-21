package com.lorepo.icplayer.client.page;

import java.util.HashMap;
import java.util.List;

import com.google.gwt.user.client.ui.AbsolutePanel;
import com.google.gwt.user.client.ui.Widget;
import com.lorepo.icplayer.client.dimensions.CalculateModuleDimensions;
import com.lorepo.icplayer.client.dimensions.ModuleDimensions;
import com.lorepo.icplayer.client.dimensions.PageDimensionsForCalculations;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.page.PageController.IPageDisplay;
import com.lorepo.icplayer.client.page.WidgetsPositionsStore.WidgetPositionStruct;
import com.lorepo.icplayer.client.utils.DOMUtils;
import com.lorepo.icplayer.client.utils.MathJax;

public class AbsolutePageView extends AbsolutePanel implements IPageDisplay {

	private int height;
	
	private Page currentPage;
	private HashMap<String, Widget> widgets = new HashMap<String, Widget>();
	private PageDimensionsForCalculations pageDimensions;
	CalculateModuleDimensions calculateModuleDimensions = new CalculateModuleDimensions();
	private WidgetsPositionsStore widgetsPositions = new WidgetsPositionsStore(); 
	
	
	public AbsolutePageView(){
		this.addStyleName("ic_page");
	}
	
	@Override
	public void setPage(Page newPage) {
	
		this.currentPage = newPage;
		String styles = "position:relative;overflow:hidden;";
		if(this.currentPage.getInlineStyle() != null){
			styles += this.currentPage.getInlineStyle(); 
			
		}
		DOMUtils.applyInlineStyle(this.getElement(), styles);
		if(!this.currentPage.getStyleClass().isEmpty()){
			this.addStyleName(this.currentPage.getStyleClass());
		}
		this.getElement().setId(this.currentPage.getId());
		this.removeAllModules();
		this.createPageDimensions();
	}
	
	private void createPageDimensions() {
		this.pageDimensions = PageDimensionsForCalculations.getAbsolutePageViewDimensions(this);
	}


	@Override
	public void refreshMathJax() {
		MathJax.refreshMathJax(this.getElement());
	}
	
	@Override
	public void addModuleView(IModuleView view, IModuleModel module) {
		if(view instanceof Widget){
			Widget moduleView = (Widget) view;

			
			ModuleDimensions moduleDimensions = this.calculateModuleDimensions.setPageDimensions(this.pageDimensions)
					.setModule(module)
					.compute(this.widgets);
			
			moduleView.setPixelSize(moduleDimensions.width, moduleDimensions.height);
		    this.add(moduleView, moduleDimensions.left, moduleDimensions.top);
		    this.widgets.put(module.getId(), moduleView);
		    this.widgetsPositions.add(moduleView, moduleDimensions);
		}
	}

	@Override
	public void setWidth(int width) {
		this.setWidth(width + "px");
		this.createPageDimensions();
	}


	@Override
	public void setHeight(int height) {
		this.height = height;
		this.setHeight(height + "px");
		this.createPageDimensions();
	}

	@Override
	public void removeAllModules() {
		this.widgets.clear();
		this.widgetsPositions.clear();
		this.clear();
		this.createPageDimensions();
	}
	
	@Override
	public HashMap<String, Widget> getWidgets() {
		return this.widgets;
	}
	
	public void outstretchHeight(int y, int difference) {
		List<WidgetPositionStruct> widgetsList = this.widgetsPositions.getAllWidgetsFromPoint(y);
		for (WidgetPositionStruct widgetData: widgetsList) {
			widgetData.addTopDimensionDifference(difference);
			this.widgetsPositions.setWidgetNewData(widgetData);
			this.setWidgetPosition(widgetData.widget, widgetData.getLeft(), widgetData.getTop());
		}
		
		this.setHeight(this.height + difference);
	}
}
