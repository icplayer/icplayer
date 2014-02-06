package com.lorepo.icplayer.client.module.pageprogress;

import java.util.HashMap;
import java.util.List;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Element;
import com.lorepo.icf.scripting.ICommandReceiver;
import com.lorepo.icf.scripting.IType;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.IStateful;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.event.ShowErrorsEvent;
import com.lorepo.icplayer.client.module.api.player.IJsonServices;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.api.player.PageScore;
import com.lorepo.icplayer.client.module.choice.ChoicePresenter.IOptionDisplay;

public class PageProgressPresenter implements IPresenter, IStateful, ICommandReceiver {

	public interface IDisplay extends IModuleView{
		public void setData(int value);
		public void show();
		public void hide();
		public List<IOptionDisplay> getOptions();
		public Element getElement();
	}
	
	private PageProgressModule module;
	private IDisplay view;
	private IPlayerServices playerServices;
	private int score = 0;
	private boolean isVisible;
	private JavaScriptObject jsObject;
	
	public PageProgressPresenter(PageProgressModule module, IPlayerServices services){
	
		this.module = module;
		this.playerServices = services;
		isVisible = module.isVisible();
		
		connectHandlers();
	}

	
	private void updateDisplay() {
		
		view.setData(score);
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
							reset();
						}
					});
		}
	}
	
	
	private void updateScore() {

		PageScore pageScore = playerServices.getCommands().getCurrentPageScore();
		if(pageScore != null){
			score = pageScore.getPercentageScore();
			updateDisplay();
		}
	}
	

	private void reset() {
		
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
	public String executeCommand(String commandName, List<IType> _) {
		
		if(commandName.compareTo("show") == 0){
			show();
		}
		else if(commandName.compareTo("hide") == 0){
			hide();
		}
		else if(commandName.compareTo("reset") == 0){
			reset();
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
	
	private native JavaScriptObject initJSObject(PageProgressPresenter x) /*-{
	
		var presenter = function(){}
			
		presenter.show = function(){ 
			x.@com.lorepo.icplayer.client.module.pageprogress.PageProgressPresenter::show()();
		}
		
		presenter.hide = function(){ 
			x.@com.lorepo.icplayer.client.module.pageprogress.PageProgressPresenter::hide()();
		}
		
		presenter.reset = function(){ 
			x.@com.lorepo.icplayer.client.module.pageprogress.PageProgressPresenter::reset()();
		}
		
		presenter.getView = function() { 
			return x.@com.lorepo.icplayer.client.module.pageprogress.PageProgressPresenter::getView()();
		}
		
		return presenter;
	}-*/;
}
