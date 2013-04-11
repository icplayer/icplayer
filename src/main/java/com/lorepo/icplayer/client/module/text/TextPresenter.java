package com.lorepo.icplayer.client.module.text;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.event.shared.EventBus;
import com.lorepo.icf.scripting.ICommandReceiver;
import com.lorepo.icf.utils.JSONUtils;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icplayer.client.module.api.IActivity;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.IStateful;
import com.lorepo.icplayer.client.module.api.event.DefinitionEvent;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.event.ShowErrorsEvent;
import com.lorepo.icplayer.client.module.api.event.ValueChangedEvent;
import com.lorepo.icplayer.client.module.api.event.WorkModeEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.DraggableItem;
import com.lorepo.icplayer.client.module.api.event.dnd.DraggableText;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemConsumedEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemReturnedEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemSelectedEvent;
import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.api.player.IScoreService;
import com.lorepo.icplayer.client.module.text.LinkInfo.LinkType;

public class TextPresenter implements IPresenter, IStateful, IActivity, ICommandReceiver{

	public interface TextElementDisplay{
		boolean hasId(String id);
		void setShowErrorsMode(boolean isActivity);
		void setWorkMode();
		void reset();
		void setText(String text);
		String getTextValue();
		void markGapAsCorrect();
		void markGapAsWrong();
		void markGapAsEmpty();
		void setDisabled(boolean disabled);
		boolean isDisabled();
	}
	
	public interface IDisplay extends IModuleView{
		void addListener(ITextViewListener l); 
		void setHTML(String html);
		String getHTML();
		void connectGaps(Iterator<GapInfo> giIterator);
		void connectDraggableGaps(Iterator<GapInfo> giIterator);
		void connectInlineChoices(Iterator<InlineChoiceInfo> giIterator);
		void connectLinks(Iterator<LinkInfo> giIterator);
		int getChildrenCount();
		TextElementDisplay getChild(int index);
		void setValue(String id, String value);
		void refreshMath();
		void hide();
		void show();
	}
	
	class State{
		HashMap<String, String> values;
		HashMap<String, DraggableItem> consumedItems;
		ArrayList<Boolean>	disabled;
		public String enteredText;
	}
	
	private TextModel	module;
	private IPlayerServices playerServices;
	private IDisplay view;
	private HashMap<String, String> values = new HashMap<String, String>();
	private HashMap<String, DraggableItem> consumedItems = new HashMap<String, DraggableItem>();
	private DraggableItem draggableItem;
	private JavaScriptObject	jsObject;
	private String enteredText = null;
	private boolean isVisible;
	
	
	public TextPresenter(TextModel module, IPlayerServices services){
		
		this.module = module;
		this.playerServices = services;
		isVisible = module.isVisible();

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
				if(event.getItem() instanceof DraggableText){
					draggableItem = event.getItem();
				}
			}
		});
		
		eventBus.addHandler(ItemConsumedEvent.TYPE, new ItemConsumedEvent.Handler() {
			public void onItemConsumed(ItemConsumedEvent event) {
				draggableItem = null;
			}
		});
	}
	
	
	protected void setWorkMode() {
		for(int i = 0; i < view.getChildrenCount(); i++){
			view.getChild(i).setWorkMode();
		}
	}


	protected void setShowErrorsMode() {
		
		for(int i = 0; i < view.getChildrenCount(); i++){
			view.getChild(i).setShowErrorsMode(module.isActivity());
		}
	}
	
	
	@Override
	public String getSerialId() {
		return module.getId();
	}

	
	@Override
	public String getState() {

		HashMap<String, String> state = new HashMap<String, String>();
		state.put("values", JSONUtils.toJSONString(values));
		if(enteredText != null){
			state.put("enteredText", enteredText);
		}

		HashMap<String, String> itemsState = new HashMap<String, String>();
		for(String key : consumedItems.keySet()){
			if(consumedItems.get(key) != null){
				itemsState.put(key, consumedItems.get(key).toString());
			}
		}
		state.put("consumed", JSONUtils.toJSONString(itemsState));
		
		ArrayList<Boolean> stateDisabled = new ArrayList<Boolean>();
		for(int i = 0; i < view.getChildrenCount(); i++){
			stateDisabled.add(view.getChild(i).isDisabled());
		}
		state.put("disabled", JSONUtils.toJSONString(stateDisabled));
		state.put("isVisible", Boolean.toString(isVisible));
		
		return JSONUtils.toJSONString(state);
	}


	@Override
	public void setState(String stateObj) {
		
		HashMap<String, String> state = JSONUtils.decodeHashMap(stateObj);
		values = JSONUtils.decodeHashMap(state.get("values"));
		if(state.containsKey("enteredText")){
			enteredText = state.get("enteredText");
			view.setHTML(enteredText);
		}

		consumedItems = new HashMap<String, DraggableItem>();
		HashMap<String, String> itemsState = JSONUtils.decodeHashMap(state.get("consumed"));
		for(String key: itemsState.keySet()){
			String value = itemsState.get(key);
			consumedItems.put(key,  DraggableItem.createFromString(value));
		}
		
		for(String id : values.keySet()){
			String value = values.get(id);
			view.setValue(id, value);
		}
		
		ArrayList<Boolean> stateDisabled = JSONUtils.decodeArray(state.get("disabled"));
		for(int i = 0; i < view.getChildrenCount() && i < stateDisabled.size(); i++){
			view.getChild(i).setDisabled(stateDisabled.get(i));
		}
		
		isVisible = Boolean.parseBoolean(state.get("isVisible"));
		if(!isVisible){
			hide();
		}
		else{
			show();
		}
	}
	
	
	@Override
	public int getErrorCount() {

		String enteredValue;
		int errorCount = 0;
		
		if(module.isActivity()){
		
			for(GapInfo gap : module.getGapInfos()){
				enteredValue = getElementText(gap.getId()).trim();
				if(	!enteredValue.isEmpty() && !gap.isCorrect(enteredValue))
				{
					errorCount++;
				}
			}
	
			for(InlineChoiceInfo choice : module.getChoiceInfos()){
				enteredValue = getElementText(choice.getId());
				if(	!enteredValue.isEmpty() &&
					choice.getAnswer().compareToIgnoreCase(enteredValue) != 0)
				{
					errorCount++;
				}
			}
		}
		
		return errorCount;
	}

	
	protected void reset() {

		isVisible = module.isVisible();
		if(isVisible){
			view.show();
		}
		else{
			view.hide();
		}
		for(int i = 0; i < view.getChildrenCount(); i++){
			view.getChild(i).reset();
			view.getChild(i).setDisabled(module.isDisabled());
		}

		if(enteredText != null){
			updateViewText();
		}
		view.refreshMath();
		enteredText = null;
		draggableItem = null;
		consumedItems.clear();
		values.clear();
		updateScore();
	}


	@Override
	public int getMaxScore() {

		int maxScore = 0;
		
		if(module.isActivity()){
		
			for(GapInfo gap : module.getGapInfos()){
				maxScore += gap.getValue();
			}
	
			for(InlineChoiceInfo choice : module.getChoiceInfos()){
				maxScore += choice.getValue();
			}
		}
		
		return maxScore;
	}


	@Override
	public int getScore() {
		
		int score = 0;

		if(module.isActivity()){

			String enteredValue;
		
			for(GapInfo gap : module.getGapInfos()){
				enteredValue = getElementText(gap.getId());
				if(gap.isCorrect(enteredValue)){
					score += gap.getValue();
				}
			}
	
			for(InlineChoiceInfo choice : module.getChoiceInfos()){
				enteredValue = getElementText(choice.getId());
				if(choice.getAnswer().compareToIgnoreCase(enteredValue) == 0){
					score += choice.getValue();
				}
			}
		}
		
		return score;
	}


	private String getElementText(String id) {
		
		String enteredValue;
		enteredValue = values.get(id);
		if(enteredValue == null){
			enteredValue = "";
		}
		
		return enteredValue.trim();
	}


	@Override
	public void addView(IModuleView display) {

		if(display instanceof IDisplay){
			view = (IDisplay) display;
			connectViewListener();
			updateViewText();
		}
	}


	private void updateViewText() {
		view.setHTML(module.getParsedText());
		if(module.hasDraggableGaps()){
			view.connectDraggableGaps(module.getGapInfos().iterator());
		}
		else{
			view.connectGaps(module.getGapInfos().iterator());
		}
		view.connectInlineChoices(module.getChoiceInfos().iterator());
		view.connectLinks(module.getLinkInfos().iterator());
	}


	private void connectViewListener() {
		view.addListener(new ITextViewListener() {
			public void onValueChanged(String id, String newValue) {
				valueChanged(id, newValue);
			}
			
			public void onLinkClicked(LinkType type, String link) {
				if(type == LinkType.PAGE){
					gotoPage(link);
				}
				else{
					showDefinition(link);
				}
			}
			
			public void onGapClicked(String gapId){
				gapClicked(gapId);
			}
		});
	}


	protected void valueChanged(String id, String newValue) {
		
		values.put(id, newValue);
		updateScore();
		
		String score = Integer.toString(getItemScore(id));
		String itemID = id.substring(id.lastIndexOf("-")+1);
		ValueChangedEvent valueEvent = new ValueChangedEvent(module.getId(), itemID, newValue, score);
		playerServices.getEventBus().fireEvent(valueEvent);
		
	}


	protected void gotoPage(String pageName) {
	
		IPlayerCommands commands = playerServices.getCommands();
		commands.gotoPage(pageName);
	}


	protected void showDefinition(String word) {

		DefinitionEvent event = new DefinitionEvent(word);
		playerServices.getEventBus().fireEvent(event);
	}


	protected void gapClicked(String gapId) {
		
		DraggableItem previouslyConsumedItem = consumedItems.get(gapId);
		
		String value = "";
		String score = "0";
		String itemID = gapId.substring(gapId.lastIndexOf("-")+1);
		if(previouslyConsumedItem != null){
			consumedItems.remove(gapId);
			values.remove(gapId);
			view.setValue(gapId, "");
			fireItemReturnedEvent(previouslyConsumedItem);
			ValueChangedEvent valueEvent = new ValueChangedEvent(module.getId(), itemID, value, score);
			playerServices.getEventBus().fireEvent(valueEvent);
		}
		else if(draggableItem != null){
			value = StringUtils.removeAllFormatting(draggableItem.getValue());
			view.setValue(gapId, draggableItem.getValue());
			consumedItems.put(gapId, draggableItem);
			values.put(gapId, value);
			fireItemConsumedEvent();
			score = Integer.toString(getItemScore(gapId));
			ValueChangedEvent valueEvent = new ValueChangedEvent(module.getId(), itemID, value, score);
			playerServices.getEventBus().fireEvent(valueEvent);
		}
		
	}


	private void fireItemReturnedEvent(DraggableItem previouslyConsumedItem) {
		ItemReturnedEvent event = new ItemReturnedEvent(previouslyConsumedItem);
		playerServices.getEventBus().fireEvent(event);
	}


	private void fireItemConsumedEvent() {
		ItemConsumedEvent event = new ItemConsumedEvent(draggableItem);
		playerServices.getEventBus().fireEventFromSource(event, this);
	}


	private void updateScore() {

		IScoreService scoreService = playerServices.getScoreService();
		scoreService.setScore(module.getId(), getScore(), getMaxScore());
	}


	@Override
	public String getName() {
		return module.getId();
	}


	@Override
	public String executeCommand(String commandName, List<String> params) {
		
		if(commandName.compareTo("settext") == 0 && params.size() > 0){
			setText(params.get(0));
		}
		else if(commandName.compareTo("gettext") == 0 && params.size() > 0){
			return view.getHTML();
		}
		else if(commandName.compareTo("enablegap") == 0 && params.size() == 1){
			int gapIndex = Integer.parseInt(params.get(0));
			enableGap(gapIndex);
		}
		else if(commandName.compareTo("disablegap") == 0 && params.size() == 1){
			int gapIndex = Integer.parseInt(params.get(0));
			disableGap(gapIndex);
		}
		else if(commandName.compareTo("show") == 0){
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

	
	private int getItemScore(String itemID) {
		
		int score = 0;
		
		for(GapInfo gap : module.getGapInfos()){
			if(gap.getId().compareTo(itemID) == 0){
				String enteredValue = getElementText(gap.getId());
				if(gap.isCorrect(enteredValue)){
					score = gap.getValue();
				}
				break;
			}
		}

		for(InlineChoiceInfo choice : module.getChoiceInfos()){
			if(choice.getId().compareTo(itemID) == 0){
				String enteredValue = getElementText(choice.getId());
				if(choice.getAnswer().compareToIgnoreCase(enteredValue) == 0){
					score = choice.getValue();
				}
				break;
			}
		}
		
		return score;
	}


	@Override
	public IModuleModel getModel() {
		return module;
	}
	
	
	public JavaScriptObject getAsJavaScript(){
		
		if(jsObject == null){
			jsObject = initJSObject(this);
		}

		return jsObject;
	}

	
	private native JavaScriptObject initJSObject(TextPresenter x) /*-{
	
		var presenter = function(){}
			
		presenter.getGapText = function(gapId){ 
			return x.@com.lorepo.icplayer.client.module.text.TextPresenter::getGapText(I)(gapId);
		}
			
		presenter.getGapValue = function(gapId){ 
			return x.@com.lorepo.icplayer.client.module.text.TextPresenter::getGapText(I)(gapId);
		}
			
		presenter.markGapAsCorrect = function(gapId){ 
			x.@com.lorepo.icplayer.client.module.text.TextPresenter::markGapAsCorrect(I)(gapId);
		}
			
		presenter.markGapAsWrong = function(gapId){ 
			x.@com.lorepo.icplayer.client.module.text.TextPresenter::markGapAsWrong(I)(gapId);
		}
			
		presenter.markGapAsEmpty = function(gapId){ 
			x.@com.lorepo.icplayer.client.module.text.TextPresenter::markGapAsEmpty(I)(gapId);
		}
			
		presenter.enableGap = function(gapId){ 
			x.@com.lorepo.icplayer.client.module.text.TextPresenter::enableGap(I)(gapId);
		}
			
		presenter.disableGap = function(gapId){ 
			x.@com.lorepo.icplayer.client.module.text.TextPresenter::disableGap(I)(gapId);
		}
			
		presenter.setText = function(text){ 
			x.@com.lorepo.icplayer.client.module.text.TextPresenter::setText(Ljava/lang/String;)(text.toString());
		}
			
		presenter.show = function(){ 
			x.@com.lorepo.icplayer.client.module.text.TextPresenter::show()();
		}
			
		presenter.hide = function(){ 
			x.@com.lorepo.icplayer.client.module.text.TextPresenter::hide()();
		}
		
		presenter.reset = function(){ 
			x.@com.lorepo.icplayer.client.module.text.TextPresenter::reset()();
		}
		
		return presenter;
	}-*/;
	
	
	private String getGapText(int index){
		
		if(view != null && index <= view.getChildrenCount()){
			return view.getChild(index-1).getTextValue();
		}
		
		return "[error]";
	}
	
	
	private void markGapAsCorrect(int index){
		
		if(view != null && index <= view.getChildrenCount()){
			view.getChild(index-1).markGapAsCorrect();
		}
	}
	
	
	private void markGapAsWrong(int index){
		
		if(view != null && index <= view.getChildrenCount()){
			view.getChild(index-1).markGapAsWrong();
		}
	}
	
	
	private void markGapAsEmpty(int index){
		
		if(view != null && index <= view.getChildrenCount()){
			view.getChild(index-1).markGapAsEmpty();
		}
	}
	
	
	private void enableGap(int index){
		
		if(view != null && index <= view.getChildrenCount()){
			view.getChild(index-1).setDisabled(false);
		}
	}
	
	
	private void disableGap(int index){
		
		if(view != null && index <= view.getChildrenCount()){
			view.getChild(index-1).setDisabled(true);
		}
	}
	
	
	private void setText(String text){

		enteredText = text;
		view.setHTML(text);
	}

	private void show(){
		
		isVisible = true;
		if(view != null){
			if(!module.isActivity()){
				view.setHTML(module.getParsedText());
			}
			view.show();
		}
	}
	
	
	private void hide(){
		
		isVisible = false;
		if(view != null){
			view.hide();
		}
	}


}
