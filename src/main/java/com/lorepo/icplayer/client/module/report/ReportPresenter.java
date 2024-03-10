package com.lorepo.icplayer.client.module.report;

import java.util.HashMap;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Element;
import com.lorepo.icplayer.client.model.page.Page;
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
import com.lorepo.icplayer.client.page.KeyboardNavigationController;


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
		float totalScaledScore = 0;
		float totalWeight = 0;
		
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
					float scaledScore = pageScore.getScaledScore();
					int weight = pageScore.getWeight();
					if (page instanceof Page) {
						Page pageInstance = (Page) page;
						if (weight == 0) {
							weight = pageInstance.getPageWeight();
						}
						if (pageScore.getMaxScore() == 0) {
							scaledScore = pageInstance.isVisited() ? 1 : 0;
						}
					}
					totalScaledScore += scaledScore * weight;
					totalWeight += weight;
				}
				else{
					view.addRow(page.getName());
				}
			}
		}
		
		totalScore = 1;
		if (totalWeight > 0) totalScore = Math.round((totalScaledScore / totalWeight) * 100);
		
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
	public void reset(boolean isOnlyWrongAnswers) {
		// Module is not an activity
	}

	@Override
	public void setDisabled(boolean value) {

	}

	@Override
	public boolean isDisabled() {
		return false;
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
		boolean isVisible = !this.view.getElement().getStyle().getVisibility().equals("hidden")
			&& !this.view.getElement().getStyle().getDisplay().equals("none")
			&& !KeyboardNavigationController.isParentGroupDivHidden(view.getElement());
		return (isTextToSpeechOn || haveStandaloneKeyboardNavigationSupport()) && isVisible;
	}
	
	@Override
	public boolean haveStandaloneKeyboardNavigationSupport() {
		return !module.shouldOmitInKeyboardNavigation();
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
