package com.lorepo.icplayer.client.module.report;

import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.player.IContent;
import com.lorepo.icplayer.client.module.api.player.IPage;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.api.player.IScoreService;
import com.lorepo.icplayer.client.module.api.player.PageScore;


public class ReportPresenter implements IPresenter{

	public interface IDisplay extends IModuleView{
		void clear();
		void addRow(String name, PageScore pageScore);
		void addRow(String name);
		void addSummaryRow(int totalScore, int totalChecks, int totalErrors, int totalMistakes);
		void addListener(IViewListener l);
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

				PageScore pageScore = scoreService.getPageScore(page.getName());
				counter ++;
				
				if(pageScore != null){
					view.addRow(page.getName(), pageScore);
	
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
			public void onClicked(String name) {
				pageClicked(name);
			}
		});
	}


	protected void pageClicked(String name) {
		playerServices.getCommands().gotoPage(name);
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
}
