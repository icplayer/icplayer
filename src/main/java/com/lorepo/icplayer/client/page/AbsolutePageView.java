package com.lorepo.icplayer.client.page;

import java.util.HashMap;
import java.util.List;

import com.google.gwt.user.client.ui.AbsolutePanel;
import com.google.gwt.user.client.ui.Widget;
import com.lorepo.icf.utils.URLUtils;
import com.lorepo.icplayer.client.PlayerApp;
import com.lorepo.icplayer.client.dimensions.CalculateModuleDimensions;
import com.lorepo.icplayer.client.dimensions.ModuleDimensions;
import com.lorepo.icplayer.client.dimensions.PageDimensionsForCalculations;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.model.page.group.Group;
import com.lorepo.icplayer.client.model.page.group.GroupView;
import com.lorepo.icplayer.client.module.NestedAddonUtils;
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
	private HashMap<String, GroupView> groupsPanel = new HashMap<String, GroupView>();
	private PageDimensionsForCalculations pageDimensions;
	private CalculateModuleDimensions calculateModuleDimensions = new CalculateModuleDimensions();
	private WidgetsPositionsStore widgetsPositions = new WidgetsPositionsStore(); 

	public AbsolutePageView(){
		this.addStyleName("ic_page");
	}
	
	@Override
	public void setPage(Page newPage) {
		this.currentPage = newPage;
		String styles = "position:relative;overflow:hidden;-webkit-text-size-adjust: 100%;";
		if (this.currentPage.getInlineStyle() != null){
			styles += URLUtils.resolveCSSURL(this.currentPage.getBaseURL(), currentPage.getInlineStyle(), this.currentPage.getContentBaseURL());
		}

		DOMUtils.applyInlineStyle(this.getElement(), styles);

		if(!this.currentPage.getStyleClass().isEmpty()){
			this.addStyleName(this.currentPage.getStyleClass());
		}
		this.getElement().setId(this.currentPage.getId());
		this.removeAllModules();
	}
	
	private void createPageDimensions() {
		this.pageDimensions = PageDimensionsForCalculations.getAbsolutePageViewDimensions(this, currentPage);
	}

	public void recalculatePageDimensions() {
		this.createPageDimensions();
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
			Boolean isAddonGap = NestedAddonUtils.insertIntoAddonGap(module.getId(), moduleView.getElement(), this.getElement());
			if (isAddonGap) {
				adopt(moduleView);
			} else {
		    	this.add(moduleView, moduleDimensions.left, moduleDimensions.top);
			}
		    this.widgets.put(module.getId(), moduleView);
		    this.widgetsPositions.add(moduleView, moduleDimensions);
		}
	}

	@Override
	public void addModuleViewIntoGroup(IModuleView view, IModuleModel module, String groupId) {
		if(view instanceof Widget){
			Widget moduleView = (Widget) view;
			GroupView groupPanel = groupsPanel.get(groupId);
		
			ModuleDimensions moduleDimensions = this.calculateModuleDimensions.setPageDimensions(this.pageDimensions)
					.setModule(module)
					.compute(this.widgets);
			
			moduleView.setPixelSize(moduleDimensions.width, moduleDimensions.height);
			Boolean isAddonGap = NestedAddonUtils.insertIntoAddonGap(module.getId(), moduleView.getElement(), this.getElement());
			if (isAddonGap) {
				adopt(moduleView);
			} else {
				groupPanel.add(moduleView, moduleDimensions.left, moduleDimensions.top);
			}
		    this.widgets.put(module.getId(), moduleView);
		    this.widgetsPositions.add(moduleView, moduleDimensions);
		}
	}

	@Override
	public void addGroupView(GroupView groupWidget) {
		if(groupWidget.getGroup().isDiv()) {
			add(groupWidget, groupWidget.getLeft(), groupWidget.getTop());
			groupsPanel.put(groupWidget.getId(), groupWidget);
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
		this.groupsPanel.clear();
		this.clear();
		this.createPageDimensions();
	}
	
	@Override
	public HashMap<String, Widget> getWidgets() {
		return this.widgets;
	}
	
	public int calculateStaticHeaderFooterHeight() {
		if (PlayerApp.isStaticHeader() && !PlayerApp.isStaticFooter()) {
			return Integer.parseInt(PlayerApp.getStaticHeaderHeight());
		} else if (!PlayerApp.isStaticHeader() && PlayerApp.isStaticFooter()) {
			return Integer.parseInt(PlayerApp.getStaticFooterHeight());
		} else if (PlayerApp.isStaticHeader() && PlayerApp.isStaticFooter()) {
			return Integer.parseInt(PlayerApp.getStaticHeaderHeight()) + Integer.parseInt(PlayerApp.getStaticFooterHeight());
		} else {
			return 0;
		}
	}

	public static native void setProperPageHeight(int difference) /*-{
		var currentHeight = $wnd.$(".ic_content").parent().css("height").replace("px", "");
		$wnd.$(".ic_content").parent().css("height", parseInt(currentHeight, 10) + difference + "px");
	}-*/;

	public static native void setProperFotterPosition () /*-{
		try {
			var icFooterHeight = $wnd.$(".ic_footer").css("height").replace("px",""),
				parentScroll = $wnd.parent.scrollY,
				offsetIframe = $wnd.get_iframe().offset().top,
				sum = parseInt(window.top.innerHeight, 10)-offsetIframe-parseInt(icFooterHeight, 10)+parentScroll;
			$wnd.$(".ic_static_footer").css("top", sum+"px");
		}catch (e){
		}
	}-*/;
	
	public void outstretchHeight(int y, int difference, boolean isRestore, boolean dontMoveModules) {
		if (!dontMoveModules) {
			List<WidgetPositionStruct> widgetsList = this.widgetsPositions.getAllWidgetsFromPoint(y);
			for (WidgetPositionStruct widgetData: widgetsList) {
				widgetData.addTopDimensionDifference(difference);
				this.widgetsPositions.setWidgetNewData(widgetData);
				this.setWidgetPosition(widgetData.widget, widgetData.getLeft(), widgetData.getTop());
			}
		}
		
		if (difference > 0 && !isRestore) {
			this.changeHeightConsideringStaticHeaderFooterHeight(difference);
			this.createPageDimensions();
			if (PlayerApp.isStaticFooter()) {
				setProperFotterPosition();
			}
		} else if (difference < 0 && !isRestore) {
			if (!PlayerApp.isStaticHeader() && PlayerApp.isStaticFooter()) {
			    this.changeHeightConsideringStaticHeaderFooterHeight(difference);
			} else {
				setHeight(this.height + difference);
			}
		} else {
			setHeight(this.height + difference);
		}

		if (!isRestore && (PlayerApp.isStaticHeader() || PlayerApp.isStaticFooter())) {
			setProperPageHeight(difference);
			int newPagePanelHeight = this.height + calculateStaticHeaderFooterHeight();
			setPagePanelHeight(newPagePanelHeight);
		}
	}

	private void changeHeightConsideringStaticHeaderFooterHeight(int difference) {
		int height = this.height + difference + calculateStaticHeaderFooterHeight();
		this.height = this.height + difference;
		this.setHeight(height + "px");
	}

	private void setPagePanelHeight(int height) {
		this.getParent().setHeight(height + "px");
	}
}
