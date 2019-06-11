package com.lorepo.icplayer.client.module.report;

import java.util.HashMap;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Element;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.player.IContent;
import com.lorepo.icplayer.client.module.api.player.IPage;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.api.player.IScoreService;
import com.lorepo.icplayer.client.module.api.player.PageScore;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.IWCAGPresenter;


public class ReportPresenter implements IPresenter, IWCAGPresenter{

	public interface IDisplay extends IModuleView{
		void clear();
		void addRow(String name, Integer pageId, PageScore pageScore);
		void addRow(String name);
		void addSummaryRow(int totalScore, int totalChecks, int totalErrors, int totalMistakes);
		void addListener(IViewListener l);
		public Element getElement();
	}
	
	private IDisplay view;
	private IPlayerServices playerServices;
	private ReportModule module;
	
	
	public ReportPresenter(ReportModule module, IPlayerServices services){

		this.module = module;
		this.playerServices = services;
	}
	
	
	private void addRowsToView(){
		
		IScoreService scoreService = playerServices.getScoreService();
		IContent contentModel = playerServices.getModel();
		int totalChecks = 0;
		int totalErrors = 0;
		int totalScore = 0;
		int totalMistakes = 0;
		
		view.clear();
		int total = 0;
		int counter = 0;
		
		for(int i = 0; i < contentModel.getPageCount(); i++){
			
			IPage page = contentModel.getPage(i);
			if(page.isReportable()){

				PageScore pageScore = scoreService.getPageScoreById(page.getId());
				counter ++;
				
				if(pageScore != null){
					view.addRow(page.getName(), i, pageScore);
	
					totalChecks += pageScore.getCheckCount();
					totalErrors += pageScore.getErrorCount();
					totalMistakes += pageScore.getMistakeCount();
					total += pageScore.getPercentageScore();
				}
				else{
					view.addRow(page.getName());
				}
			}
		}
		
		totalScore = counter > 0? total/counter: 0;
		
		view.addSummaryRow(totalScore, totalChecks, totalErrors, totalMistakes);
		
		view .addListener(new IViewListener() {
			public void onClicked(int pageId) {
				pageClicked(pageId);
			}
		});
	}


	protected void pageClicked(int pageId) {
		playerServices.getCommands().gotoPageIndex(pageId);
	}


	@Override
	public void addView(IModuleView display) {
		
		if(display instanceof IDisplay){
			this.view = (IDisplay) display;
			addRowsToView();
		}
	}


	@Override
	public IModuleModel getModel() {
		return module;
	}


	@Override
	public void setShowErrorsMode() {
		// Module is not an activity
	}


	@Override
	public void setWorkMode() {
		// Module is not an activity
	}
	
	@Override
	public void reset() {
		// Module is not an activity
	}


	@Override
	public IWCAG getWCAGController() {
		return (IWCAG) this.view;
	}


	@Override
	public void selectAsActive(String className) {
		this.view.getElement().addClassName(className);
		
	}


	@Override
	public void deselectAsActive(String className) {
		this.view.getElement().removeClassName(className);
		
	}


	@Override
	public boolean isSelectable(boolean isTextToSpeechOn) {
		return !this.view.getElement().getStyle().getVisibility().equals("hidden") && !this.view.getElement().getStyle().getDisplay().equals("none");
	}


	@Override
	public void onEventReceived(String eventName, HashMap<String, String> data) {
		// TODO Auto-generated method stub
		
	}


	@Override
	public JavaScriptObject getAsJavaScript() {
		// TODO Auto-generated method stub
		return JavaScriptObject.createObject();
	}
}
