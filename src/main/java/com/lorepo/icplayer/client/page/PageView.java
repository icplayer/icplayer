package com.lorepo.icplayer.client.page;

import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.ui.AbsolutePanel;
import com.google.gwt.user.client.ui.Widget;
import com.lorepo.icplayer.client.model.Page;
import com.lorepo.icplayer.client.model.Page.LayoutType;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.page.PageController.IDisplay;
import com.lorepo.icplayer.client.utils.DOMUtils;
import com.lorepo.icplayer.client.utils.MathJax;


/**
 * Na obszarze tego panelu rysowane są elementy strony
 * 
 * @author Krzysztof Langner
 *
 */
public class PageView extends AbsolutePanel implements IDisplay{

	private Page currentPage;

	
	public PageView(){

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
		
		clear();
	}


	@Override
	public void refreshMathJax() {
		MathJax.refreshMathJax(getElement());
	}


	@Override
	public void addModuleView(IModuleView view, IModuleModel module){
		
		int left;
		int top;
		int width;
		int height;
	
		float 	pageWidth = DOM.getElementPropertyInt(getElement(), "clientWidth");
		float 	pageHeight = DOM.getElementPropertyInt(getElement(), "clientHeight");

		if(view instanceof Widget){
			Widget moduleView = (Widget) view;
			
			if(currentPage.getLayout() == LayoutType.percentage){
			
				left = (int) (module.getLeft()*pageWidth)/100;
				top = (int) (module.getTop()*pageHeight)/100;
				width = (int) (module.getWidth()*pageWidth)/100;
				height = (int) (module.getHeight()*pageHeight)/100;
			}
			else{
				
				left = (int) module.getLeft();
				top = (int) module.getTop();
				width = (int) module.getWidth();
				height = (int) module.getHeight();
			}
			
			moduleView.setPixelSize(width, height);
		    add(moduleView, left, top);
			
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

}
