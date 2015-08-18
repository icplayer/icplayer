package com.lorepo.icplayer.client.module.button;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.ui.PushButton;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;

class GotoPageButton extends PushButton{
	
	private IPlayerServices playerServices;
	
	public static boolean isNumeric(String str){
	  return str.matches("-?\\d+(\\.\\d+)?");
	}

	
	public GotoPageButton(final String pageName, final String pageIndex, IPlayerServices services){
		this.playerServices = services;
		
		setStyleName("ic_button_gotopage");
		
		if(pageName != "" && pageIndex != ""){
			getElement().setInnerText("Fill in only one Property: Page Title or Page Index");
			return;
		}
		
		if(pageIndex != "" && (!isNumeric(pageIndex) || Integer.parseInt(pageIndex) < 1)){
			getElement().setInnerText("Page Index must be a positive number");
			return;
		}

		if(services != null){
			final int pageCount = services.getModel().getPageCount();
			final int currentPageIndex = services.getCurrentPageIndex()+1;
			final IPlayerCommands playerCommands = services.getCommands();
			addClickHandler(new ClickHandler() {
				public void onClick(ClickEvent event) {
	
					event.stopPropagation();
					event.preventDefault();
					if(pageName != "" && pageName != null){
						if(isPageNameCorrect(pageName)){
							playerCommands.gotoPage(pageName);
						}
					}
					
					if(pageIndex != "" && pageIndex != null){
						int index = Integer.parseInt(pageIndex);
						if(index <= pageCount && index != currentPageIndex){
							playerCommands.gotoPageIndex(index-1);
						}
					}
				}
			});
		}
		
	}
	
	public boolean isPageNameCorrect(String pageName) {
		int pageCount = playerServices.getModel().getPageCount();
		
		for(int i = 0; i < pageCount; i++){
			String name = playerServices.getModel().getPage(i).getName();
			name = name.replaceAll("\\s+","");
			pageName = pageName.replaceAll("\\s+","");
			if(name.equals(pageName)){
				return true;
			}
		}
		
		return false;		
	} 
}
