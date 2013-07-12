package com.lorepo.icplayer.client.page;

import java.util.ArrayList;
import java.util.HashMap;

import com.google.gwt.user.client.Window;
import com.lorepo.icf.scripting.ICommandReceiver;
import com.lorepo.icf.scripting.ScriptParserException;
import com.lorepo.icf.scripting.ScriptingEngine;
import com.lorepo.icplayer.client.model.Page;
import com.lorepo.icplayer.client.module.IModuleFactory;
import com.lorepo.icplayer.client.module.ModuleFactory;
import com.lorepo.icplayer.client.module.api.IActivity;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.IStateful;
import com.lorepo.icplayer.client.module.api.event.PageLoadedEvent;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.event.ShowErrorsEvent;
import com.lorepo.icplayer.client.module.api.event.WorkModeEvent;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.api.player.PageScore;

public class PageController {

	public interface IPageDisplay{

		void addModuleView(IModuleView view, IModuleModel module);
		void setPage(Page page);
		void refreshMathJax();
		void setWidth(int width);
		void setHeight(int height);
		void clear();
	}
	
	private IPageDisplay pageView;
	private Page	currentPage;
	private IPlayerServices playerService;
	private IModuleFactory moduleFactory;
	private ArrayList<IPresenter>	presenters;
	private ScriptingEngine scriptingEngine = new ScriptingEngine();
	
	
	public PageController() {
		presenters = new ArrayList<IPresenter>();
	}
	
	
	public void setPlayerServices(IPlayerServices playerService) {
		this.playerService = playerService;
		moduleFactory = new ModuleFactory(playerService);
	}
	
	
	public void setView(IPageDisplay view){
		pageView = view;
	}

	
	protected void setModuleFactory(IModuleFactory factory) {

		this.moduleFactory = factory;
	}

	
	public void setPage(Page page, HashMap<String, String> state){
		
		currentPage = page;
		pageView.setPage(page);
		setViewSize(page);
		initModules();
		setPageState(state);
		pageView.refreshMathJax();
		playerService.getEventBus().fireEvent(new PageLoadedEvent());
	}


	private void setViewSize(Page page) {
		
		if(page.getWidth() > 0){
			pageView.setWidth(page.getWidth());
		}
		if(page.getHeight() > 0){
			pageView.setHeight(page.getHeight());
		}
	}


	private void initModules() {
		
		presenters.clear();
		pageView.clear();
		scriptingEngine.reset();
		
		for(IModuleModel module : currentPage.getModules()){

			IModuleView moduleView = moduleFactory.createView(module);
			IPresenter presenter = moduleFactory.createPresenter(module);
			pageView.addModuleView(moduleView, module);
			if(presenter != null){
				presenter.addView(moduleView);
				presenters.add(presenter);
				if(presenter instanceof ICommandReceiver){
					scriptingEngine.addReceiver((ICommandReceiver) presenter);
				}
			}
			else if(moduleView instanceof IPresenter){
				presenters.add((IPresenter) moduleView);
			}
		}
	}


	public void checkAnswers() {
		
		updateScore();
		playerService.getEventBus().fireEvent(new ShowErrorsEvent());
		if(currentPage.isReportable()){
			PageScore pageScore = playerService.getScoreService().getPageScore(currentPage.getName());
			pageScore.incrementCheckCount();
			pageScore.incrementMistakeCount();
		}
	}


	public void updateScore() {
		float score = 0;
		float maxScore = 0;
		int errorCount = 0;
		
		for(IPresenter presenter : presenters){
			if(presenter instanceof IActivity){
				IActivity activity = (IActivity) presenter;
				score += activity.getScore();
				maxScore += activity.getMaxScore();
				errorCount += activity.getErrorCount();
			}
		}

		if(currentPage.isReportable()){
			PageScore pageScore = playerService.getScoreService().getPageScore(currentPage.getName());
			pageScore.setScore(score);
			pageScore.setMaxScore(maxScore);
			pageScore.setErrorCount(errorCount);
		}
	}

	
	public void uncheckAnswers() {
		
		playerService.getEventBus().fireEvent(new WorkModeEvent());
	}


	public void reset() {
		
		if(currentPage.isReportable()){
			PageScore pageScore = playerService.getScoreService().getPageScore(currentPage.getName());
			pageScore.setScore(0);
			pageScore.setErrorCount(0);
		}
		playerService.getEventBus().fireEvent(new ResetPageEvent());
	}

	
	public PageScore getPageScore() {

		if(currentPage == null || !currentPage.isReportable()){
			return null;
		}
		
		return playerService.getScoreService().getPageScore(currentPage.getName());
	}


	public void setPageState(HashMap<String, String> state) {
		
		for(IPresenter presenter : presenters){
			if(presenter instanceof IStateful){
				IStateful statefulObj = (IStateful)presenter;
				String key = currentPage.getHref() + statefulObj.getSerialId(); 
				String moduleState = state.get(key);
				if(moduleState != null){
					statefulObj.setState(moduleState);
				}				
			}
		}
	}


	public HashMap<String, String> getState() {
		
		HashMap<String, String>	pageState = new HashMap<String, String>();
		for(IPresenter presenter : presenters){
			if(presenter instanceof IStateful){
				IStateful statefulObj = (IStateful)presenter;
				String state = statefulObj.getState();
				String key = currentPage.getHref() + statefulObj.getSerialId();
				pageState.put(key, state);
			}
		}
		return pageState;
	}


	public void runScript(String script){

		try {
			scriptingEngine.execute(script);
		} catch (ScriptParserException e) {
			Window.alert(e.getMessage());
		}
	}
	
	
	public IPresenter findModule(String name){
		
		for(IPresenter presenter : presenters){
		
			if(presenter.getModel().getId().compareTo(name) == 0){
				return presenter;
			}
		}
		
		return null;
	}
}
