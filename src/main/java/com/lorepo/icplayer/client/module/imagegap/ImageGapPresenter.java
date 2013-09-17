package com.lorepo.icplayer.client.module.imagegap;

import java.util.HashMap;
import java.util.List;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.event.shared.EventBus;
import com.lorepo.icf.scripting.ICommandReceiver;
import com.lorepo.icf.scripting.IType;
import com.lorepo.icplayer.client.module.api.IActivity;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.IStateful;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.event.ShowErrorsEvent;
import com.lorepo.icplayer.client.module.api.event.ValueChangedEvent;
import com.lorepo.icplayer.client.module.api.event.WorkModeEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.DraggableImage;
import com.lorepo.icplayer.client.module.api.event.dnd.DraggableItem;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemConsumedEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemReturnedEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemSelectedEvent;
import com.lorepo.icplayer.client.module.api.player.IJsonServices;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;


public class ImageGapPresenter implements IPresenter, IActivity, IStateful, ICommandReceiver{

	public interface IDisplay extends IModuleView{
		public void addListener(IViewListener l);
		void setImageUrl(String url);
		void showAsError();
		void showAsCorrect();
		void resetStyles();
		void setDisabled(boolean disable);
		public void show();
		public void hide();
		public void markGapAsEmpty();
		public void markGapAsWrong();
	}
	
	private ImageGapModule model;
	private IDisplay view;
	private IPlayerServices playerServices;
	private DraggableItem readyToDraggableItem;
	private DraggableItem consumedItem;
	private JavaScriptObject	jsObject;
	private boolean isVisible;
	
	
	public ImageGapPresenter(ImageGapModule model, IPlayerServices services){

		this.model = model;
		this.playerServices = services;
		isVisible = model.isVisible();
		
		connectHandlers();
	}


	private void connectHandlers() {
	
		EventBus eventBus = playerServices.getEventBus();
		
		eventBus.addHandler(ShowErrorsEvent.TYPE, new ShowErrorsEvent.Handler() {
			public void onShowErrors(ShowErrorsEvent event) {
				setShowErrorsMode();
			}
		});

		eventBus.addHandler(WorkModeEvent.TYPE, new WorkModeEvent.Handler() {
			public void onWorkMode(WorkModeEvent event) {
				setWorkMode();
			}
		});

		eventBus.addHandler(ResetPageEvent.TYPE, new ResetPageEvent.Handler() {
			public void onResetPage(ResetPageEvent event) {
				reset();
			}
		});

		eventBus.addHandler(ItemSelectedEvent.TYPE, new ItemSelectedEvent.Handler() {
			public void onItemSelected(ItemSelectedEvent event) {
				if(event.getItem() instanceof DraggableImage){
					readyToDraggableItem = event.getItem();
				}
			}
		});
		
		eventBus.addHandler(ItemConsumedEvent.TYPE, new ItemConsumedEvent.Handler() {
			public void onItemConsumed(ItemConsumedEvent event) {
				readyToDraggableItem = null;
			}
		});
	}

	
	private void setShowErrorsMode() {
		
		view.setDisabled(true);
		if(model.isActivity()){
			if(getScore() > 0){
				view.showAsCorrect();
			}
			else{
				view.showAsError();
			}
		}
	}


	private void setWorkMode() {
		
		view.resetStyles();
		view.setDisabled(false);
	}


	private void reset() {
		
		readyToDraggableItem = null;
		consumedItem = null;
		view.setImageUrl("");
		view.setDisabled(false);
		if(model.isVisible()){
			view.show();
		}
		else{
			view.hide();
		}
		
	}


	@Override
	public void addView(IModuleView display) {
		
		if(display instanceof IDisplay){
			view = (IDisplay) display;
			view.addListener(new IViewListener() {
				public void onClicked() {
					viewClicked();
				}
			});
		}
	}
	
	
	private void viewClicked(){
		
		if(consumedItem != null){
			view.setImageUrl("");
			fireItemReturnedEvent(consumedItem);
			consumedItem = null;
			ValueChangedEvent valueEvent = new ValueChangedEvent(model.getId(), "", "", "0");
			playerServices.getEventBus().fireEvent(valueEvent);
		}
		else if(readyToDraggableItem != null){
			view.setImageUrl(readyToDraggableItem.getValue());
			consumedItem = readyToDraggableItem;
			fireItemConsumedEvent();
			String score = Integer.toString(getScore());
			ValueChangedEvent valueEvent = new ValueChangedEvent(model.getId(), "", consumedItem.getId(), score);
			playerServices.getEventBus().fireEvent(valueEvent);
		}
		
	}
	

	private void fireItemReturnedEvent(DraggableItem previouslyConsumedItem) {
		ItemReturnedEvent event = new ItemReturnedEvent(previouslyConsumedItem);
		playerServices.getEventBus().fireEvent(event);
		
		sendEventCode(model.getEventCode(ImageGapModule.EVENT_EMPTY));
	}


	private void sendEventCode(String eventCode) {

		if(eventCode != null && !eventCode.isEmpty()){
			playerServices.getCommands().executeEventCode(eventCode);
		}
	}


	private void fireItemConsumedEvent() {
		ItemConsumedEvent event = new ItemConsumedEvent(readyToDraggableItem);
		playerServices.getEventBus().fireEventFromSource(event, this);
		
		if(isCorrect()){
			sendEventCode(model.getEventCode(ImageGapModule.EVENT_CORRECT));
		}
		else{
			sendEventCode(model.getEventCode(ImageGapModule.EVENT_WRONG));
		}
	}


	@Override
	public String getSerialId() {
		return model.getId();
	}


	@Override
	public String getState() {

		IJsonServices json = playerServices.getJsonServices();
		HashMap<String, String> state = new HashMap<String, String>();
		if(consumedItem != null){
			state.put("consumed",  consumedItem.toString());
		}
		state.put("isVisible", Boolean.toString(isVisible));		
		return json.toJSONString(state);
	}


	@Override
	public void setState(String stateObj) {
		
		IJsonServices json = playerServices.getJsonServices();
		HashMap<String, String> state = json.decodeHashMap(stateObj);
		if(state.containsKey("consumed")){
			consumedItem = DraggableItem.createFromString(state.get("consumed"));
			view.setImageUrl(consumedItem.getValue());
		}
		if(state.containsKey("isVisible")){
			isVisible = Boolean.parseBoolean(state.get("isVisible"));
			if(!isVisible){
				hide();
			}
			else{
				show();
			}
		}
	}


	@Override
	public int getErrorCount() {
		
		if(consumedItem != null && getScore() == 0 && model.isActivity()){
			return 1;
		}
		return 0;
	}


	@Override
	public int getMaxScore() {
		
		if(model.isActivity()){
			return 1;
		}
		else{
			return 0;
		}
	}


	@Override
	public int getScore() {
		
		int score = 0;
		
		if(model.isActivity() && isCorrect()){
			score = 1;
		}
		
		return score;
	}

	
	public boolean isCorrect() {
		
		if(consumedItem != null){
			String[] answers = model.getAnswerId().split(";");
			for(int i = 0; i < answers.length; i++){
				String answer = answers[i];
				if(consumedItem.getId().compareTo(answer) == 0){
					return true;
				}
			}
		}
		
		return false;
	}

	
	@Override
	public String getName() {
		return model.getId();
	}


	@Override
	public String executeCommand(String commandName, List<IType> _) {
		
		String value = "";
		
		if(commandName.compareTo("getimageid") == 0){
			if(consumedItem != null){
				value = getImageId();
			}
		}
		else if(commandName.compareTo("show") == 0){
			show();
		}
		else if(commandName.compareTo("hide") == 0){
			hide();
		}
		else if(commandName.compareTo("markgapascorrect") == 0){
			markGapAsCorrect();
		}
		else if(commandName.compareTo("markgapaswrong") == 0){
			markGapAsWrong();
		}
		else if(commandName.compareTo("markgapasempty") == 0){
			markGapAsEmpty();
		}
		
		return value;
	}


	@Override
	public IModuleModel getModel() {
		return model;
	}
	
	public JavaScriptObject getAsJavaScript(){
		
		if(jsObject == null){
			jsObject = initJSObject(this);
		}

		return jsObject;
	}

	
	private native JavaScriptObject initJSObject(ImageGapPresenter x) /*-{
	
		var presenter = function(){}
			
		presenter.getImageId = function(){ 
			return x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::getImageId()();
		}
		presenter.getGapValue = function(){ 
			return x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::getImageId()();
		}
		presenter.show = function(){ 
			x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::show()();
		}
			
		presenter.hide = function(){ 
			x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::hide()();
		}
			
		presenter.markGapAsCorrect = function(){ 
			x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::markGapAsCorrect()();
		}
			
		presenter.markGapAsWrong = function(){ 
			x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::markGapAsWrong()();
		}
			
		presenter.markGapAsEmpty = function(){ 
			x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::markGapAsEmpty()();
		}
			
		return presenter;
	}-*/;
	
	
	protected void show(){
		
		if(view != null){
			view.show();
			isVisible = true;
		}
	}
	
	
	protected void hide(){
		
		if(view != null){
			view.hide();
			isVisible = false;
		}
	}


	private String getImageId(){
		
		String value = "";
		if(consumedItem != null){
			value = consumedItem.getId();
		}
		
		return value;
	}
	
	private void markGapAsCorrect(){
		view.showAsCorrect();
	}
	
	
	private void markGapAsWrong(){
		view.markGapAsWrong();
	}
	
	
	private void markGapAsEmpty(){
		view.markGapAsEmpty();
	}
	
	
}
