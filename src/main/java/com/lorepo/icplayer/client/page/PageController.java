package com.lorepo.icplayer.client.page;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.google.gwt.event.shared.HandlerRegistration;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.Widget;
import com.lorepo.icf.scripting.ICommandReceiver;
import com.lorepo.icf.scripting.ScriptParserException;
import com.lorepo.icf.scripting.ScriptingEngine;
import com.lorepo.icplayer.client.IPlayerController;
import com.lorepo.icplayer.client.content.services.PlayerServices;
import com.lorepo.icplayer.client.model.Group;
import com.lorepo.icplayer.client.model.Group.ScoringGroupType;
import com.lorepo.icplayer.client.model.page.properties.OutstretchHeightData;
import com.lorepo.icplayer.client.model.Page;
import com.lorepo.icplayer.client.module.IModuleFactory;
import com.lorepo.icplayer.client.module.ModuleFactory;
import com.lorepo.icplayer.client.module.api.IActivity;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.IStateful;
import com.lorepo.icplayer.client.module.api.event.CustomEvent;
import com.lorepo.icplayer.client.module.api.event.PageLoadedEvent;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.event.ShowErrorsEvent;
import com.lorepo.icplayer.client.module.api.event.ValueChangedEvent;
import com.lorepo.icplayer.client.module.api.event.WorkModeEvent;
import com.lorepo.icplayer.client.module.api.player.IPage;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.api.player.PageScore;
import com.lorepo.icplayer.client.page.Score.Result;

public class PageController {

	public interface IPageDisplay {
		void addModuleView(IModuleView view, IModuleModel module);
		void setPage(Page page);
		void refreshMathJax();
		void setWidth(int width);
		void setHeight(int height);
		void removeAllModules();
		void outstretchHeight(int y, int difference, boolean isRestore, boolean dontChangeModules);
		HashMap<String, Widget> getWidgets();
	}
	
	private String PAGE_HEIGHT_MODIFICATIONS_KEY = "ICPLAYER_PAGE_HEIGHT_MODIFICATIONS";

	private IPageDisplay pageView;
	private Page currentPage;
	private PlayerServices playerServiceImpl;
	private IPlayerServices playerService;
	private IModuleFactory moduleFactory;
	private ArrayList<IPresenter> presenters;
	private final ScriptingEngine scriptingEngine = new ScriptingEngine();
	private IPlayerController playerController;
	private HandlerRegistration valueChangedHandler;
	private KeyboardNavigationController keyboardController;
	
	public PageController(IPlayerController playerController) {
		this.playerController = playerController;
		playerServiceImpl = new PlayerServices(playerController, this);
		init(playerServiceImpl);
	}

	public PageController(IPlayerServices playerServices) {
		init(playerServices);
	}

	private void init(IPlayerServices playerServices) {
		presenters = new ArrayList<IPresenter>();
		this.playerService = playerServices;
		moduleFactory = new ModuleFactory(playerService);
	}

	public void setView(IPageDisplay view) {
		pageView = view;
	}

	protected void setModuleFactory(IModuleFactory factory) {
		this.moduleFactory = factory;
	}

	public void sendPageAllOkOnValueChanged(boolean sendEvent) {
		if (sendEvent) {
			valueChangedHandler = playerService.getEventBus().addHandler(ValueChangedEvent.TYPE, new ValueChangedEvent.Handler() {
				@Override
				public void onScoreChanged(ValueChangedEvent event) {
					valueChanged(event);
				}
			});
		} else if (valueChangedHandler != null) {
			valueChangedHandler.removeHandler();
			valueChangedHandler = null;
		}
	}

	public void setPage(Page page) {
		if (playerServiceImpl != null) {
			playerServiceImpl.resetEventBus();
		}
		currentPage = page;

		pageView.setPage(page);
		setViewSize(page);
		initModules();

		if (playerService.getStateService() != null) {
			HashMap<String, String> state = playerService.getStateService().getStates();
			setPageState(state);
		}
		pageView.refreshMathJax();

		this.restoreOutstretchHeights();
		playerService.getEventBus().fireEvent(new PageLoadedEvent(page.getName()));
	}
	
	private void restoreOutstretchHeights() {
		for (OutstretchHeightData data : this.currentPage.heightModifications.getOutStretchHeights()) {
			this.outstretchHeightWithoutAddingToModifications(data.y, data.height, true, data.dontChange);
		}
	}

	protected void valueChanged(ValueChangedEvent event) {
		Score.Result result = getCurrentScore();
		if (result.errorCount == 0 && result.maxScore > 0 && result.score == result.maxScore) {
			playerService.getEventBus().fireEvent(new CustomEvent("PageAllOk", new HashMap<String, String>()));
		}
	}

	private void setViewSize(Page page) {
		if (page.getWidth() > 0) {
			pageView.setWidth(page.getWidth());
		}
		if (page.getHeight() > 0) {
			pageView.setHeight(page.getHeight());
		}
	}

	private void initModules() {
		presenters.clear();
		pageView.removeAllModules();
		scriptingEngine.reset();

		for(IModuleModel module : currentPage.getModules()){
			String newInlineStyle = deletePositionImportantStyles(module.getInlineStyle());
			module.setInlineStyle(newInlineStyle);
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

	public String deletePositionImportantStyles (String inlineStyle) {
		String[] attributes = inlineStyle.split(";");
		StringBuilder strBuilder = new StringBuilder();
		for (String attribute: attributes) {
			if((attribute.contains("left") || attribute.contains("top")
					|| attribute.contains("right") || attribute.contains("bottom")) && (!attribute.contains("-left") && !attribute.contains("-top")
					&& !attribute.contains("-right") && !attribute.contains("-bottom")
					&& !attribute.contains("text-align") && !attribute.contains("vertical-align") && !attribute.contains("background") && !attribute.contains("gradient"))){
				continue;
			}
			strBuilder.append(attribute);
			strBuilder.append(";");
		}

		String newAttributes = strBuilder.toString();
		return newAttributes;
	}

	public Group findGroup(IModuleModel module) {
		List<Group> groups = currentPage.getGroupedModules();
		if(groups != null){
			for (Group group : groups) {
				if (group.contains(module)) {
					return group;
				}
			}
		}

		return null;
	}

	protected ArrayList<IPresenter> createGroupPresenters(Group group) {
		ArrayList<IPresenter> groupPresenters = new ArrayList<IPresenter>();

		for (IModuleModel module : group) {
			for (int i = 0; i < presenters.size(); i++) {
				if (presenters.get(i).getModel().equals(module)) {
					groupPresenters.add(presenters.get(i));
				}
			}
		}

		return groupPresenters;
	}

	protected Result calculateScoreForEachGroup(Group group, ArrayList<IPresenter> groupPresenters, int groupMaxScore) {
		Result groupResult = new Result();

		for(IPresenter presenter : groupPresenters){
			if(presenter instanceof IActivity){
				IActivity activity = (IActivity) presenter;
				if (group.getScoringType() == ScoringGroupType.zeroMaxScore) {
					groupResult = Score.calculateZeroMaxScore(groupResult, activity);
				} else if (group.getScoringType() == ScoringGroupType.graduallyToMaxScore) {
					groupResult = Score.calculateGraduallyScore(groupResult, activity);
				} else {
					groupResult = Score.calculateDefaultScore(groupResult, activity, currentPage.getScoringType());
				}
			}
		}

		return groupResult;
	}

	protected Result calculateScoreModulesOutGroup(Result groupsResult) {
		for (IPresenter presenter : presenters) {
			if (findGroup(presenter.getModel()) == null && presenter instanceof IActivity) {
				IActivity activity = (IActivity) presenter;
				groupsResult = Score.calculateDefaultScore(groupsResult, activity, currentPage.getScoringType());
			}
		}

		return groupsResult;
	}

	protected Result calculateScoreModulesInGroups() {
		Result groupsResult = new Result();
		if(currentPage.getGroupedModules() != null){
			for (Group group : currentPage.getGroupedModules()) {
				int groupMaxScore = group.getMaxScore();

				ArrayList<IPresenter> groupPresenters = createGroupPresenters(group);

				Result groupResult = calculateScoreForEachGroup(group, groupPresenters, groupMaxScore);

				if (group.getScoringType() == ScoringGroupType.defaultScore) {
					groupsResult = Score.updateDefaultGroupResult(groupsResult, groupResult);
				} else if (group.getScoringType() == ScoringGroupType.zeroMaxScore) {
					groupsResult = Score.updateZeroMaxGroupResult(groupsResult, groupResult, groupMaxScore);
				} else if (group.getScoringType() == ScoringGroupType.graduallyToMaxScore) {
					groupsResult = Score.updateGraduallyToMaxGroupResult(groupsResult, groupResult, groupMaxScore);
				}
			}
		}

		return groupsResult;
	}

	public void checkAnswers() {
		updateScore(true);
		playerService.getEventBus().fireEvent(new ShowErrorsEvent());
	}

	public void incrementCheckCounter() {
		updateScoreCheckCounter();
	}

	public void increaseMistakeCounter() {
		updateScoreMistakeCounter();

		ValueChangedEvent valueEvent = new ValueChangedEvent("", "", "increaseMistakeCounter", "");
		playerService.getEventBus().fireEvent(valueEvent);
	}

	public void updateScoreMistakeCounter() {
		if (currentPage != null && currentPage.isReportable()) {
			Score.Result result = getCurrentScore();
			PageScore pageScore = playerService.getScoreService().getPageScore(currentPage.getId());
			PageScore score = pageScore.updateScore(result.score, result.maxScore, result.errorCount);
			playerService.getScoreService().setPageScore(currentPage, score.increaseMistakeCounter());
		}
	}

	public void updateScore(boolean updateCounters) {
		if (currentPage != null && currentPage.isReportable()) {
			Score.Result result = getCurrentScore();
			PageScore pageScore = playerService.getScoreService().getPageScore(currentPage.getId());
			PageScore score = pageScore.updateScore(result.score, result.maxScore, result.errorCount);
			playerService.getScoreService().setPageScore(currentPage, updateCounters ? score.incrementCounters() : score);
		}
	}

	public void updateScoreCheckCounter() {
		if (currentPage != null && currentPage.isReportable()) {
			Score.Result result = getCurrentScore();
			PageScore pageScore = playerService.getScoreService().getPageScore(currentPage.getId());
			PageScore score = pageScore.updateScore(result.score, result.maxScore, result.errorCount);
			playerService.getScoreService().setPageScore(currentPage, score.incrementCheckCounter());
		}
	}

	private Result getCurrentScore() {
		Result groupsResult = calculateScoreModulesInGroups();

		if(groupsResult == null){
			Result result = new Result();
			result.score = 0;
			result.maxScore = 0;
			result.errorCount = 0;

			groupsResult = calculateScoreModulesOutGroup(result);
		}else{
			groupsResult = calculateScoreModulesOutGroup(groupsResult);
		}

		return groupsResult;
	}

	public void uncheckAnswers() {
		playerService.getEventBus().fireEvent(new WorkModeEvent());
	}

	public void resetPageScore() {
		if(currentPage.isReportable()){
			PageScore pageScore = playerService.getScoreService().getPageScore(currentPage.getId());
			if(pageScore.hasScore()){
				PageScore score = pageScore.reset();
				playerService.getScoreService().setPageScore(currentPage, score);
			}
		}
	}

	public void sendResetEvent() {
		playerService.getEventBus().fireEvent(new ResetPageEvent());
	}

	public PageScore getPageScore() {
		if (currentPage == null || !currentPage.isReportable()) {
			return null;
		}

		return playerService.getScoreService().getPageScore(currentPage.getId());
	}

	public void setPageState(HashMap<String, String> state) {
		for (IPresenter presenter : presenters) {
			if (presenter instanceof IStateful) {
				IStateful statefulObj = (IStateful)presenter;
				String key = currentPage.getId() + statefulObj.getSerialId();
				String moduleState = state.get(key);
				if (moduleState != null) {
					statefulObj.setState(moduleState);
				}
			}
		}
		
		String heightModificationsState = state.get(this.getOutstretchUniqueHeightKey());
		if (heightModificationsState != null) {
			this.currentPage.heightModifications.setState(heightModificationsState);	
		}
	}

	public HashMap<String, String> getState() {

		HashMap<String, String>	pageState = new HashMap<String, String>();
		if(this.currentPage != null) {
			for(IPresenter presenter : presenters){
				if(presenter instanceof IStateful){
					IStateful statefulObj = (IStateful)presenter;
					String state = statefulObj.getState();
					String key = this.currentPage.getId() + statefulObj.getSerialId();
					pageState.put(key, state);
				}
			}
			
			pageState.put(this.getOutstretchUniqueHeightKey(), this.currentPage.heightModifications.getState());
		}
		
		
		return pageState;
	}
	
	private String getOutstretchUniqueHeightKey() {
		return this.currentPage.getId() + this.PAGE_HEIGHT_MODIFICATIONS_KEY;
	}

	public void runScript(String script) {
		try {
			scriptingEngine.execute(script);
		} catch (ScriptParserException e) {
			Window.alert(e.getMessage());
		}
	}

	public IPresenter findModule(String id) {
		for (IPresenter presenter : presenters) {
			if (presenter.getModel().getId().compareTo(id) == 0) {
				return presenter;
			}
		}

		return null;
	}

	public IPage getPage() {
		return currentPage;
	}

	public void closePage() {
		// kc in popup window is null
		if (keyboardController != null) {
			keyboardController.resetStatus();
		}

		if (playerServiceImpl != null) {
			playerServiceImpl.resetEventBus();
		}
		if (currentPage != null) {
			currentPage.release();
			currentPage = null;
		}

		pageView.removeAllModules();
		presenters.clear();
	}

	public IPlayerServices getPlayerServices() {
		return playerService;
	}

	public IPlayerController getPlayerController() {
		return playerController;
	}

	public List<IPresenter> getPresenters() {
		return presenters;
	}

	public HashMap<String, Widget> getWidgets() {
		if (pageView != null) {
			return pageView.getWidgets();
		}

		return null;
	}

	public void outstretchHeight(int y, int height, boolean dontChangeModules) {
		this.outstretchHeightWithoutAddingToModifications(y, height, false, dontChangeModules);
		this.currentPage.heightModifications.addOutstretchHeight(y, height, dontChangeModules);
		this.playerController.fireOutstretchHeightEvent();
		
	}

	public void outstretchHeightWithoutAddingToModifications(int y, int height, boolean isRestore, boolean dontChangeModules) {
		this.pageView.outstretchHeight(y, height, isRestore, dontChangeModules);
	}
}
