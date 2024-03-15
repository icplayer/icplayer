package com.lorepo.icplayer.client.module.pageprogress;

import java.util.HashMap;
import java.util.List;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Element;
import com.lorepo.icf.scripting.ICommandReceiver;
import com.lorepo.icf.scripting.IType;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.module.IButton;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.IWCAGPresenter;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.IStateful;
import com.lorepo.icplayer.client.module.api.event.CustomEvent;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.event.ShowErrorsEvent;
import com.lorepo.icplayer.client.module.api.event.ValueChangedEvent;
import com.lorepo.icplayer.client.module.api.player.IJsonServices;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.api.player.PageScore;
import com.lorepo.icplayer.client.module.choice.ChoicePresenter.IOptionDisplay;
import com.lorepo.icplayer.client.module.limitedcheck.LimitedCheckPresenter;
import com.lorepo.icplayer.client.page.KeyboardNavigationController;

public class PageProgressPresenter implements IPresenter, IStateful, ICommandReceiver, IWCAGPresenter, IButton {

	public interface IDisplay extends IModuleView{
		public void show();
		public void hide();
		public List<IOptionDisplay> getOptions();
		public Element getElement();
		void setData(int value, int maxScore);
	}
	
	private PageProgressModule module;
	private IDisplay view;
	private IPlayerServices playerServices;
	private int score = 0;
	private boolean isVisible;
	private JavaScriptObject jsObject;
	private int limitedChecksScore = 0;
	private int limitedChecksMaxScore = 0;
	private List<String> limitedModules = null;
	
	public PageProgressPresenter(PageProgressModule module, IPlayerServices services){
	
		this.module = module;
		this.playerServices = services;
		isVisible = module.isVisible();
		
		connectHandlers();
	}

	public static native int getLimitedScore(JavaScriptObject limitedScore) /*-{
		return limitedScore.score;
	}-*/;
	
	public static native int getLimitedMaxScore(JavaScriptObject limitedScore) /*-{
		return limitedScore.maxScore;
	}-*/;
	
	private void getLimitedChecksScore () {
		limitedModules = module.getModules();
		
		limitedChecksMaxScore = 0;
		score = 0;
		
		for (String moduleName : limitedModules) {
			LimitedCheckPresenter limitedCheckModule = (LimitedCheckPresenter) playerServices.getModule(moduleName);
			if (limitedCheckModule != null) {
				JavaScriptObject limitedScore = limitedCheckModule.getModulesScore();

				score += getLimitedScore(limitedScore);
				limitedChecksMaxScore += getLimitedMaxScore(limitedScore);
			}
		}
	}
	
	private void updateDisplay() {
		if(limitedChecksMaxScore > 0) {
			view.setData(score, limitedChecksMaxScore);
		} else {
			view.setData(score, -1);
		}
	}
	
	private Element getView(){
		return view.getElement();
	}
	
	private void connectHandlers() {
		
		if(playerServices != null){
		
			playerServices.getEventBus().addHandler(ShowErrorsEvent.TYPE, 
					new ShowErrorsEvent.Handler() {
						
						@Override
						public void onShowErrors(ShowErrorsEvent event) {
							updateScore();
						}
					});

			playerServices.getEventBus().addHandler(ResetPageEvent.TYPE, 
					new ResetPageEvent.Handler() {
						
						@Override
						public void onResetPage(ResetPageEvent event) {
							reset(event.getIsOnlyWrongAnswers());
						}
					});
			
			playerServices.getEventBus().addHandler(CustomEvent.TYPE,
				new CustomEvent.Handler() {
					@Override
					public void onCustomEventOccurred(CustomEvent event) {
						onEventReceived(event.eventName, event.getData());
					}
				});
			
			playerServices.getEventBus().addHandler(ValueChangedEvent.TYPE,
					new ValueChangedEvent.Handler() {
						@Override
						public void onScoreChanged(ValueChangedEvent event) {
							if (event.getModuleID().toLowerCase().contains("Limited_Reset".toLowerCase()) && module.getRawWorksWith().length() > 0) {
								updateScore();
							}
						}
					});
			
		}
	}
	
	
	private void updateScore() {
		if(module.getRawWorksWith().length() > 0) {
			getLimitedChecksScore();
		} else{
			PageScore pageScore = playerServices.getCommands().getCurrentPageScore();
			if(pageScore != null){
				score = pageScore.getPercentageScore();
			}
		}
		
		updateDisplay();
	}
	
	@Override
	public void reset(boolean onlyWrongAnswers) {
		
		if(module.isVisible()) show();
		else view.hide();
		
		score = 0;
		updateDisplay();
	}
	

	
	@Override
	public String getSerialId() {
		return module.getId();
	}


	@Override
	public String getState() {
		IJsonServices json = playerServices.getJsonServices();
		HashMap<String, String> state = new HashMap<String, String>();
		
		state.put("score", Integer.toString(score));
		state.put("limitedChecksMaxScore", Integer.toString(limitedChecksMaxScore));
		state.put("isVisible", Boolean.toString(isVisible));
		
		return json.toJSONString(state);
	}


	@Override
	public void setState(String stateObj) {
		IJsonServices json = playerServices.getJsonServices();
		HashMap<String, String> state = json.decodeHashMap(stateObj);

		if(state.containsKey("isVisible")){
			isVisible = Boolean.parseBoolean(state.get("isVisible"));
			if(isVisible) view.show();
			else view.hide();
		}
		
		if(state.containsKey("limitedChecksMaxScore")) {
			limitedChecksMaxScore = Integer.parseInt(state.get("limitedChecksMaxScore"));
		}
		
		if (state.containsKey("score")) {
			score = Integer.parseInt(state.get("score"));
			updateDisplay();
		}
		
	}


	@Override
	public void addView(IModuleView display) {
		
		if(display instanceof IDisplay){
			this.view = (IDisplay) display;
			updateDisplay();
			for(IOptionDisplay optionView : view.getOptions()){
				optionView.setEventBus(playerServices.getEventBus());
			}
		}
	}


	@Override
	public IModuleModel getModel() {
		return module;
	}
	
	@Override
	public String executeCommand(String commandName, List<IType> args) {
		
		if(commandName.compareTo("show") == 0){
			show();
		}
		else if(commandName.compareTo("hide") == 0){
			hide();
		}
		else if(commandName.compareTo("reset") == 0){
			reset(false);
		}
		
		return "";
	}
	
	@Override
	public String getName() {
		return module.getId();
	}
	
	private void show(){
		
		isVisible = true;
		if(view != null){
			view.show();
		}
	}
	
	
	private void hide(){
		
		isVisible = false;
		if(view != null){
			view.hide();
		}
	}
	
	public JavaScriptObject getAsJavaScript(){
		
		if(jsObject == null){
			jsObject = initJSObject(this);
		}

		return jsObject;
	}

	private void jsOnEventReceived (String eventName, String jsonData) {
		this.onEventReceived(eventName, jsonData == null ? new HashMap<String, String>() : (HashMap<String, String>)JavaScriptUtils.jsonToMap(jsonData));
	}
	
	private native JavaScriptObject initJSObject(PageProgressPresenter x) /*-{
	
		var presenter = function(){}
			
		presenter.show = function(){ 
			x.@com.lorepo.icplayer.client.module.pageprogress.PageProgressPresenter::show()();
		}
		
		presenter.hide = function(){ 
			x.@com.lorepo.icplayer.client.module.pageprogress.PageProgressPresenter::hide()();
		}
		
		presenter.reset = function(){ 
			x.@com.lorepo.icplayer.client.module.pageprogress.PageProgressPresenter::reset(Z)(false);
		}
		
		presenter.getView = function() { 
			return x.@com.lorepo.icplayer.client.module.pageprogress.PageProgressPresenter::getView()();
		}
		
		presenter.onEventReceived = function (eventName, data) {
			x.@com.lorepo.icplayer.client.module.pageprogress.PageProgressPresenter::jsOnEventReceived(Ljava/lang/String;Ljava/lang/String;)(eventName, JSON.stringify(data));
		};
		
		return presenter;
	}-*/;


	@Override
	public void setShowErrorsMode() {
		// Module is not an activity
	}

	@Override
	public void setWorkMode() {
		// Module is not an activity
	}

	@Override
	public void setDisabled(boolean value) {
		// Module is not an activity
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
		if(className != "ic_active_module") {
			this.view.getElement().addClassName(className);
		}
	}

	@Override
	public void deselectAsActive(String className) {
		this.view.getElement().removeClassName(className);	
	}

	@Override
	public boolean isSelectable(boolean isTextToSpeechOn) {
		boolean isVisible = !this.getView().getStyle().getVisibility().equals("hidden") 
				&& !this.getView().getStyle().getDisplay().equals("none")
				&& !KeyboardNavigationController.isParentGroupDivHidden(view.getElement());
		return (isTextToSpeechOn || haveStandaloneKeyboardNavigationSupport()) && isVisible;
	}
	
	@Override
	public boolean haveStandaloneKeyboardNavigationSupport() {
		return false;
	}

	@Override
	public void onEventReceived(String eventName, HashMap<String, String> data) {
		if (module.getModules().contains(data.get("source"))) {
			updateScore();
		}
	}
}
