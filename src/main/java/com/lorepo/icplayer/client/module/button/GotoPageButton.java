package com.lorepo.icplayer.client.module.button;

import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;

class GotoPageButton extends ExecutableButton {
	
	private String pageName = "";
	private String pageIndex = "";
	
	private static boolean isNatural(String str) {
	  return str.matches("(\\d+)?");
	}

	
	public GotoPageButton(String pageName, String pageIndex, IPlayerServices services) {
		super(services);
		
		setStyleName("ic_button_gotopage");
		
		if(pageName != "" && pageIndex != ""){
			getElement().setInnerText("Fill in only one Property: Page Title or Page Index");
			return;
		}
		
		if(pageIndex != "" && (!isNatural(pageIndex) || Integer.parseInt(pageIndex) < 1)) {
			getElement().setInnerText("Page Index must be a positive number");
			return;
		}
		
		this.pageName = pageName;
		this.pageIndex = pageIndex;
	}
	
	public void execute() {
		if (this.playerServices == null) {
			return;
		}
		
		if (this.pageName != null && this.pageName != "" && this.pageName.startsWith("CM_")) {
			this.gotoCommonPage();
		} else {
			this.gotoPage();
		}
	}
	
	void gotoCommonPage() {
		String commonsPageName = this.pageName.replaceFirst("CM_", "");
		IPlayerCommands playerCommands = this.playerServices.getCommands();
		
		if(commonsPageName != "" && commonsPageName != null) {
			if(isCommonPageNameCorrect(commonsPageName)) {
				playerCommands.gotoCommonPage(commonsPageName);
			}
		}
	}
	
	void gotoPage() {
		int pageCount = this.playerServices.getModel().getPageCount();
		int currentPageIndex = this.playerServices.getCurrentPageIndex()+1;
		IPlayerCommands playerCommands = this.playerServices.getCommands();
		
		if(this.pageName != "" && this.pageName != null) {
			if(isPageNameCorrect(this.pageName)) {
				playerCommands.gotoPage(this.pageName);
			}
		}
		
		if(this.pageIndex != "" && this.pageIndex != null) {
			int index = Integer.parseInt(this.pageIndex);
			if(index <= pageCount && index != currentPageIndex){
				playerCommands.gotoPageIndex(index-1);
			}
		}
	}
	
	boolean isCommonPageNameCorrect(String commonPageName) {
		int pageCount = playerServices.getModel().getCommonPages().getAllPages().size();

		for (int i = 0; i < pageCount; i++) {
			String name = playerServices.getModel().getCommonPage(i).getName();
			name = name.replaceAll("\\s+","");
			commonPageName = commonPageName.replaceAll("\\s+","");
			
			if (name.equals(commonPageName)) {
				return true;
			}
		}
		
		return false;	
	}
	
	public boolean isPageNameCorrect(String pageName) {
		int pageCount = playerServices.getModel().getPageCount();
		
		for (int i = 0; i < pageCount; i++){
			String name = playerServices.getModel().getPage(i).getName();
			name = name.replaceAll("\\s+","");
			pageName = pageName.replaceAll("\\s+","");
			
			if(name.equals(pageName)) {
				return true;
			}
		}
		
		return false;		
	}
}
