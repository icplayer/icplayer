package com.lorepo.icplayer.client.module.text;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Element;
import com.google.gwt.dom.client.InputElement;
import com.google.gwt.dom.client.SelectElement;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.regexp.shared.MatchResult;
import com.google.gwt.regexp.shared.RegExp;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Window;
import com.lorepo.icf.scripting.ICommandReceiver;
import com.lorepo.icf.scripting.IStringType;
import com.lorepo.icf.scripting.IType;
import com.lorepo.icf.utils.JSONUtils;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icplayer.client.metadata.IScoreWithMetadataPresenter;
import com.lorepo.icplayer.client.metadata.ScoreWithMetadata;
import com.lorepo.icplayer.client.module.IEnterable;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.IWCAGPresenter;
import com.lorepo.icplayer.client.module.api.*;
import com.lorepo.icplayer.client.module.api.event.*;
import com.lorepo.icplayer.client.module.api.event.dnd.*;
import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.api.player.IScoreService;
import com.lorepo.icplayer.client.module.text.LinkInfo.LinkType;
import com.lorepo.icplayer.client.page.KeyboardNavigationController;

import java.util.*;

public class TextPresenter implements IPresenter, IStateful, IActivity, ICommandReceiver, IWCAGPresenter, IEnterable, IGradualShowAnswersPresenter, IScoreWithMetadataPresenter {

	public interface TextElementDisplay {
		boolean hasId(String id);
		void setShowErrorsMode(boolean isActivity);
		void setWorkMode();
		void reset();
		void setText(String text);
		String getTextValue();
		String getWCAGTextValue();
		void markGapAsCorrect();
		void markGapAsWrong();
		void markGapAsEmpty();
		boolean isAttempted();
		boolean isActivity();
		void setDisabled(boolean disabled);
		boolean isDisabled();
		void setStyleShowAnswers();
		void removeStyleHideAnswers();
		void setEnableGap(boolean enable);
		void removeDefaultStyle();
		void setDroppedElement(String element);
		String getDroppedElement();
		String getId();
		boolean getResetStatus();
		void setResetStatus(boolean wasReset);
		void setFocusGap(boolean focus);
		String getGapType();
		void select();
		void deselect();
		boolean isWorkingMode();
		int getGapState();
		String getLangTag();
		void showAnswers();
	}

	public interface IDisplay extends IModuleView {
		void addListener(ITextViewListener l);
		void setHTML(String html);
		String getHTML();
		void connectGaps(Iterator<GapInfo> giIterator);
		void connectFilledGaps(Iterator<GapInfo> giIterator);
		void connectDraggableGaps(Iterator<GapInfo> giIterator);
		void connectInlineChoices(List<InlineChoiceInfo> list);
		void connectLinks(Iterator<LinkInfo> giIterator);
		void connectAudios(Iterator<AudioInfo> iterator);
		int getChildrenCount();
		int getGapCount();
		TextElementDisplay getChild(int index);
		TextElementDisplay getActivity(int index);
		void setValue(String id, String value);
		void refreshMath();
		void refreshGapMath(String id);
		void hide();
		void show(boolean b);
		Element getElement();
		void connectMathGap(Iterator<GapInfo> giIterator, String id, ArrayList<Boolean> savedDisabledState);
		HashMap<String, String> getDroppedElements();
		void setDroppedElements(String id, String element);
		void connectDOMNodeRemovedEvent(String id);
		void sortGapsOrder();
		boolean isWCAGon();
		void setWorkMode();
		void setShowErrorsMode();
		void setValue(String text);
		List<ScoreWithMetadata> getScoreWithMetadata();
		boolean isBlockedDraggableGapsExtension();
		void enableDraggableGapExtension(String gapId);
		void disableDraggableGapExtension(String gapId);
	}

	public interface NavigationTextElement {
		void setElementFocus(boolean focus);
		void deselect();
		String getId();
		String getElementType();
		String getLangTag();
		int getGapState();
	}

	private final TextModel module;
	private final IPlayerServices playerServices;
	private IDisplay view;
	private final HashMap<String, String> values = new HashMap<String, String>();
	private HashMap<String, DraggableItem> consumedItems = new HashMap<String, DraggableItem>();
	private DraggableItem draggableItem;
	private JavaScriptObject jsObject;
	private String enteredText = null;
	private boolean isVisible;
	private ArrayList<Boolean> savedDisabledState = new ArrayList<Boolean>();
	private boolean isShowAnswersActive = false;
	private boolean isShowErrorsMode = false;
	private String currentState = "";
	private final HashMap<String, GapInfo> gapInfos = new HashMap<String, GapInfo>();
	private HashMap<String, String> currentEventData;
	private boolean isConnectedToMath = false;
	private boolean isMathShowAnswersActive = false;
	private int currentScore = 0;
	private int currentErrorCount = 0;
	private int currentMaxScore = 0;
	private boolean isTextSetByCommand = false;
	private boolean isDisabled = false;
	private boolean isGradualShowAnswers = false;

	public TextPresenter(TextModel module, IPlayerServices services) {
		this.module = module;
		this.playerServices = services;
		isVisible = module.isVisible();
		isDisabled = module.isDisabled();
		try {
			// in editor services are null
			if (this.playerServices != null) {
				connectHandlers();
			}
		} catch(Exception e) {
			JavaScriptUtils.error(e.getMessage());
		}
	}

	private void connectHandlers() {
		EventBus eventBus = playerServices.getEventBusService().getEventBus();

		eventBus.addHandler(ShowErrorsEvent.TYPE, new ShowErrorsEvent.Handler() {
			@Override
			public void onShowErrors(ShowErrorsEvent event) {
				setShowErrorsMode();
			}
		});

		eventBus.addHandler(WorkModeEvent.TYPE, new WorkModeEvent.Handler() {
			@Override
			public void onWorkMode(WorkModeEvent event) {
				setWorkMode();
			}
		});

		eventBus.addHandler(ResetPageEvent.TYPE, new ResetPageEvent.Handler() {
			@Override
			public void onResetPage(ResetPageEvent event) {
				reset(event.getIsOnlyWrongAnswers());
			}
		});

		eventBus.addHandler(ItemSelectedEvent.TYPE, new ItemSelectedEvent.Handler() {
			@Override
			public void onItemSelected(ItemSelectedEvent event) {
				if (event.getItem() instanceof DraggableText) {
					if (event.getItem().getId() == null) {
						draggableItem = null;
					} else {
						draggableItem = event.getItem();
					}
				}
			}
		});

		eventBus.addHandler(ItemConsumedEvent.TYPE, new ItemConsumedEvent.Handler() {
			@Override
			public void onItemConsumed(ItemConsumedEvent event) {
				draggableItem = null;
			}
		});

		eventBus.addHandler(CustomEvent.TYPE, new CustomEvent.Handler() {
			@Override
			public void onCustomEventOccurred(CustomEvent event) {
				onEventReceived(event.eventName, event.getData());
			}
		});

		eventBus.addHandler(GradualShowAnswerEvent.TYPE, new GradualShowAnswerEvent.Handler() {
			@Override
			public void onGradualShowAnswers(GradualShowAnswerEvent event) {
				if (!isGradualShowAnswers) {
					setCurrentViewState();
					isGradualShowAnswers = true;
				}

				if (event.getModuleID().equals(module.getId())) {
					int itemIndex = event.getItem();
					handleGradualShowAnswers(itemIndex);
				}
			}
		});

		eventBus.addHandler(GradualHideAnswerEvent.TYPE, new GradualHideAnswerEvent.Handler() {
			@Override
			public void onGradualHideAnswers(GradualHideAnswerEvent event) {
				handleGradualHideAnswers();
			}
		});
	}
	
	private boolean isShowAnswers() {
		return module.isActivity() && this.isShowAnswersActive;
	}

	public void handleGradualShowAnswers(int itemIndex) {
		TextElementDisplay gap = view.getActivity(itemIndex);
		if (gap != null) {
			gap.showAnswers();
			view.refreshMath();
		}
	}

	public void handleGradualHideAnswers() {
		this.isGradualShowAnswers = false;
		boolean isVisibleBeforeSetState = isVisible;

		for (int i = 0; i < view.getChildrenCount(); i++) {
			TextElementDisplay child = view.getChild(i);
			child.reset();
		}

		isShowAnswersActive = true;
		setState(this.currentState);
		isShowAnswersActive = false;

		isVisible = isVisibleBeforeSetState;
		if (isVisibleBeforeSetState) {
			view.show(false);
		} else {
			view.hide();
		}
	}

	private void blockAllGaps() {
		for (int i=0; i<view.getChildrenCount(); i++) {
			TextElementDisplay gap = view.getChild(i);
			gap.setEnableGap(false);
		}
	}

	private void setShowAnswersTextInGaps() {
		List<GapInfo> gapsInfos = module.getGapInfos();
		Map<String, TextElementDisplay> gapsViewsElements = new HashMap<String, TextElementDisplay>();
		
		for (int index = 0; index < view.getChildrenCount(); index++) {
			TextElementDisplay gap = view.getChild(index);
			gapsViewsElements.put(gap.getId(), gap);
		}

		for (int index = 0; index < gapsInfos.size(); index++) {
			GapInfo gi = gapsInfos.get(index);

			// show 1st answer
			String answer = gi.getFirstCorrectAnswer();
			String parsedAnswer = getParsedAnswer(answer);

			gapsViewsElements.get(gi.getId()).setText(parsedAnswer);
		}

		for (InlineChoiceInfo choice : module.getChoiceInfos()) {
			Element elem = DOM.getElementById(choice.getId());
			SelectElement sElem = (SelectElement) elem;

			int correctIndex = choice.getAnswerIndex();
			if (correctIndex != -1) {
				sElem.setSelectedIndex(correctIndex + 1);
			}
		}
	}

	private String getParsedAnswer(String answer) {
		if (isMathFormula(answer) && !answer.matches("<[^ ].*>")) {
			return answer.replace("<", "< ");
		}

		return answer;
	}

	private void showAnswers() {
		resetAudio();

		if (!module.isActivity()) {
			if (this.isShowErrorsMode) {
				setWorkMode();

				if (isConnectedToMath && isMathShowAnswersActive) {
					blockAllGaps();
				}
			}

			return;
		}
		setCurrentViewState();

		this.isShowAnswersActive = true;

		for (int i = 0; i < view.getChildrenCount(); i++) {
			TextElementDisplay child = view.getChild(i);
			child.reset();
			child.setStyleShowAnswers();
		}

		this.setShowAnswersTextInGaps();

		view.refreshMath();
	}

	private void hideAnswers () {
		if (!this.isShowAnswersActive) {
			return;
		}

		if (!module.isActivity()) {
			for (int i = 0; i < view.getChildrenCount(); i++) {
				TextElementDisplay child = view.getChild(i);
				child.setDisabled(child.isDisabled());
			}

			return;
		}

		for (int i = 0; i < view.getChildrenCount(); i++) {
			TextElementDisplay child = view.getChild(i);
			child.reset();
			child.removeStyleHideAnswers();
			child.setWorkMode();
			child.setDisabled(child.isDisabled());
		}

		setState(this.currentState);
		this.isShowAnswersActive = false;

		view.refreshMath();
	}

	@Override
	public void setWorkMode() {
		if (isShowAnswers()) {
			hideAnswers();
		}

		for (int i = 0; i < view.getChildrenCount(); i++) {
			view.getChild(i).setWorkMode();
		}
		this.view.setWorkMode();
		this.isShowErrorsMode = false;
	}

	@Override
	public void setShowErrorsMode() {
		if (isShowAnswers()) {
			hideAnswers();
		}

		for (int i = 0; i < view.getChildrenCount(); i++) {
				view.getChild(i).setShowErrorsMode(module.isActivity()); // isConnectedToMath ||
		}
		resetAudio();
		this.view.setShowErrorsMode();
		this.isShowErrorsMode = true;
	}

	@Override
	public String getSerialId() {
		return module.getId();
	}

	@Override
	public String getState() {
		HashMap<String, String> state = new HashMap<String, String>();
		state.put("gapUniqueId", module.getGapUniqueId());
		state.put("values", JSONUtils.toJSONString(values));

		if (enteredText != null) {
			state.put("enteredText", enteredText);
		}

		HashMap<String, String> itemsState = new HashMap<String, String>();
		for (String key : consumedItems.keySet()) {
			if (consumedItems.get(key) != null) {
				itemsState.put(key, consumedItems.get(key).toString());
			}
		}
		state.put("consumed", JSONUtils.toJSONString(itemsState));

		ArrayList<Boolean> stateDisabled = new ArrayList<Boolean>();
		for (int i = 0; i < view.getChildrenCount(); i++) {
			stateDisabled.add(view.getChild(i).isDisabled());
		}
		state.put("disabled", JSONUtils.toJSONString(stateDisabled));
		state.put("isVisible", Boolean.toString(isVisible));

		if (JSONUtils.toJSONString(view.getDroppedElements()) != null) {
			state.put("droppedElements", JSONUtils.toJSONString(view.getDroppedElements()));
		}

		HashMap<String, String> hasBeenAccessed = new HashMap<String, String>();
		for (int i=0; i < view.getChildrenCount(); i++) {
			if (view.getChild(i) instanceof GapWidget) {
				GapWidget gw = (GapWidget) view.getChild(i);
				if (gw.hasGapBeenAccessed()) {
					hasBeenAccessed.put(gw.getId(), "true");
				}
			}
		}
		state.put("hasBeenAccessed", JSONUtils.toJSONString(hasBeenAccessed));

		return JSONUtils.toJSONString(state);
	}

	/**
	 * Gap will have different id since it is randomly generated.
	 */
	@Override
	public void setState(String stateObj) {
		HashMap<String, String> state = JSONUtils.decodeHashMap(stateObj);

		String oldGapId = state.get("gapUniqueId") + "-";
		values.clear();
		HashMap<String, String> oldValues = JSONUtils.decodeHashMap(state.get("values"));
		for (String key : oldValues.keySet()) {
			String newKey = key.replace(oldGapId, module.getGapUniqueId()+"-");
			values.put(newKey, oldValues.get(key));
		}
		if (state.containsKey("enteredText")) {
			enteredText = state.get("enteredText");
			view.setHTML(enteredText);
		}
		consumedItems = new HashMap<String, DraggableItem>();
		HashMap<String, String> itemsState = JSONUtils.decodeHashMap(state.get("consumed"));
		for (String key: itemsState.keySet()) {
			String value = itemsState.get(key);
			String newKey = key.replace(oldGapId, module.getGapUniqueId()+"-");
			consumedItems.put(newKey,  DraggableItem.createFromString(value));
		}

		for (String id : values.keySet()) {
			String value = values.get(id);
			String parsedValue = getParsedAnswer(value);

			if (module.hasMathGaps() && !isShowAnswersActive) {
				module.parsedText = module.parsedText.replace("{{value:" + id + "}}", parsedValue);
			} else if (module.hasMathGaps()) {
				InputElement elem = DOM.getElementById(id).cast();
				elem.setValue(parsedValue);
			} else {
				view.setValue(id, parsedValue);
			}
		}

		ArrayList<Boolean> stateDisabled = JSONUtils.decodeArray(state.get("disabled"));
		for (int i = 0; i < view.getChildrenCount() && i < stateDisabled.size(); i++) {
			view.getChild(i).setDisabled(stateDisabled.get(i));
		}

		savedDisabledState = stateDisabled;

		if (module.hasMathGaps() && !isShowAnswersActive) {
			view.setHTML(module.parsedText);
			view.refreshMath();
			((TextView) view).reconnectHandlers();
		}

		HashMap<String, String> droppedElements = null;

		if (state.containsKey("droppedElements")){
			droppedElements = JSONUtils.decodeHashMap(state.get("droppedElements"));
			if(droppedElements != null){
				for (String key: droppedElements.keySet()) {
					String value = droppedElements.get(key);
					if (value != null) {
						view.setDroppedElements(key, value);
					}
				}
			}
		}

		isVisible = Boolean.parseBoolean(state.get("isVisible"));

		if (isVisible) {
			view.show(false);
		} else {
			view.hide();
		}

		HashMap<String, String> hasBeenAccessed = null;
		if (state.containsKey("hasBeenAccessed")) {
			hasBeenAccessed = JSONUtils.decodeHashMap(state.get("hasBeenAccessed"));
			if(hasBeenAccessed != null){
				for (String key: hasBeenAccessed.keySet()) {
					String newKey = key.replace(oldGapId, module.getGapUniqueId()+"-");
					GapWidget gw = getGapWidgetFromGapId(newKey);
					gw.markGapAsAccessed();
					restoreGapVisitedState(newKey);
				}
			}
		}
	}

	@Override
	public int getErrorCount() {
		if (!module.isActivity()) {
			return 0;
		}

		if (isShowAnswers() || isGradualShowAnswers) {
			return currentErrorCount;
		}

		String enteredValue;
		int errorCount = 0;

		for (GapInfo gap : module.getGapInfos()) {
			enteredValue = getElementText(gap).trim();
			if (isGapCheckable(gap) && !enteredValue.isEmpty() && !gap.isCorrect(enteredValue)) {
				errorCount++;
			}
		}
		
		for (InlineChoiceInfo choice : module.getChoiceInfos()) {
			enteredValue = getElementText(choice.getId());

			boolean wasValueSelected = !enteredValue.isEmpty() && !enteredValue.equals("---");
			boolean isValidAnswer = choice.getAnswer().compareTo(enteredValue) == 0;

			if (!isValidAnswer && wasValueSelected) {
				errorCount++;
			}
		}

		return errorCount;
	}

	@Override
	public void reset(boolean isOnlyWrongAnswers) {
		if (isTextSetByCommand) {
			setText(this.module.getDefaultModuleText());
		}

		if (module.isActivity() && isShowAnswers()) {
			hideAnswers();
		}

		if (module.isVisible()) {
			view.show(true);
			isVisible = true;
		} else {
			view.hide();
			isVisible = false;
		}

		for (int i = 0; i < view.getChildrenCount(); i++) {
			TextElementDisplay child = view.getChild(i);
			child.reset();
			child.removeStyleHideAnswers();
			child.setDisabled(module.isDisabled());
		}

		resetAudio();

		if (enteredText != null) {
			updateViewText();
		}

		view.refreshMath();
		enteredText = null;
		draggableItem = null;
		consumedItems.clear();
		values.clear();
		updateScore();

		this.currentState = "";
	}

	private void resetAudio() {
		List<AudioInfo> audioInfos = module.getAudioInfos();
		for (int i = 0; i < audioInfos.size(); i++) {
			AudioInfo audioInfo = audioInfos.get(i);
			AudioButtonWidget button = audioInfo.getButton();
			AudioWidget audio = audioInfo.getAudio();
			boolean isElementExists = button != null && audio != null;

			if (isElementExists && !audio.isPaused()) {
				audio.reset();
				button.setStartPlayingStyleClass();
			}
		}
	}

	@Override
	public int getMaxScore() {
		if (!module.isActivity()) {
			return 0;
		}

		if (isShowAnswers() || isGradualShowAnswers) {
			return currentMaxScore;
		}

		for (GroupGapsListItem groupGapsItem: module.getGroupGaps()) {
			if (groupGapsItem.getErrorCode() != null) {
				return 0;
			}
		}
		
		int maxScore = 0;
		
		HashMap<Integer, Integer> maxScoresDict = new HashMap<Integer, Integer>();
		for (int i = 0; i < module.getGapInfos().size(); i++) {
			GapInfo gap = module.getGapInfos().get(i);
			maxScoresDict.put(i + 1, gap.getValue());
		}
		for (int i = 0; i < module.getChoiceInfos().size(); i++) {
			InlineChoiceInfo choice = module.getChoiceInfos().get(i);
			maxScoresDict.put(i + 1 + module.getGapInfos().size(), choice.getValue());
		}
		
		HashSet<Integer> gapsWithScoresIndexes = new HashSet<Integer>();
		for (Integer gapIndex: maxScoresDict.keySet()) {
			gapsWithScoresIndexes.add(gapIndex);
		}
		for (GroupGapsListItem groupGapsItem: module.getGroupGaps()) {
			maxScore += calculateScoreForGroupGaps(gapsWithScoresIndexes, groupGapsItem);
			
			ArrayList<Integer> gapsIndexes = groupGapsItem.getParsedGapsIndexes();
			for (Integer gapIndex: gapsIndexes) {
				maxScoresDict.remove(gapIndex);
			}
		}
		for (Integer gapScore: maxScoresDict.values()) {
			maxScore += gapScore;
		}
		
		return maxScore;
	}

	@Override
	public int getScore() {
		if (!module.isActivity()) {
			return 0;
		}

		if (isShowAnswers() || isGradualShowAnswers) {
			return currentScore;
		}

		for (GroupGapsListItem groupGapsItem: module.getGroupGaps()) {
			if (groupGapsItem.getErrorCode() != null) {
				return 0;
			}
		}

		int score = 0;
		String enteredValue;
		
		HashMap<Integer, Integer> scoresDict = new HashMap<Integer, Integer>();
		for (int i = 0; i < module.getGapInfos().size(); i++) {
			GapInfo gap = module.getGapInfos().get(i);
			enteredValue = getElementText(gap);
			
			if (isGapCheckable(gap) && gap.isCorrect(enteredValue)) {
				scoresDict.put(i + 1, gap.getValue());
			}
		}
		
		for (int i = 0; i < module.getChoiceInfos().size(); i++) {
			InlineChoiceInfo choice = module.getChoiceInfos().get(i);
			enteredValue = getElementText(choice.getId());
			
			boolean isCorrectAnswer = choice.getAnswer().compareTo(enteredValue) == 0;
			if (isCorrectAnswer) {
				scoresDict.put(i + 1 + module.getGapInfos().size(), choice.getValue());
			}
		}
		
		HashSet<Integer> gapsWithScoresIndexes = new HashSet<Integer>();
		for (Integer gapIndex: scoresDict.keySet()) {
			gapsWithScoresIndexes.add(gapIndex);
		}
		for (GroupGapsListItem groupGapsItem: module.getGroupGaps()) {
			score += calculateScoreForGroupGaps(gapsWithScoresIndexes, groupGapsItem);
			
			ArrayList<Integer> gapsIndexes = groupGapsItem.getParsedGapsIndexes();
			for (Integer gapIndex: gapsIndexes) {
				scoresDict.remove(gapIndex);
			}
		}
		
		for (Integer gapScore: scoresDict.values()) {
			score += gapScore;
		}

		return score;
	}
	
	private int calculateScoreForGroupGaps(HashSet<Integer> gapsWithScoresIndexes, GroupGapsListItem groupGapsItem) {
		ArrayList<Integer> gapsIndexes = groupGapsItem.getParsedGapsIndexes();
		if (gapsWithScoresIndexes.containsAll(gapsIndexes) && gapsIndexes.size() != 0) {
			return 1;
		}
		return 0;
	}

	private String getElementText(String id) {
		return values.get(id) == null ? "" : values.get(id).trim();
	}

	 private String getElementText(GapInfo gap) {
		String userAnswer =  getElementText(gap.getId());
		if (userAnswer.isEmpty() && !gap.getPlaceHolder().isEmpty()) {
			userAnswer = gap.getPlaceHolder();
		}
		return userAnswer;
	}
	
	@Override
	public void addView(IModuleView display) {
		if (display instanceof IDisplay) {
			view = (IDisplay) display;
			connectViewListener();
			updateViewText();
		}

		if (display instanceof TextView && module.hasMathGaps()) {
			String gapUniqueId = module.getGapUniqueId();
			for (int i = 1; i <= module.getGapInfos().size(); i++) {
				connectGapWhenMathJaxReady(this, gapUniqueId + '-' + Integer.toString(i));
			}
		}

		view.connectDOMNodeRemovedEvent(module.getId());
	}

	private void updateViewText() {
		view.setHTML(module.getParsedText());
		if (module.hasDraggableGaps()) {
			view.connectDraggableGaps(module.getGapInfos().iterator());
		} else if (!module.hasMathGaps()) {
			view.connectGaps(module.getGapInfos().iterator());
			view.connectFilledGaps(module.getGapInfos().iterator());
		}
		view.connectInlineChoices(module.getChoiceInfos());
		view.connectLinks(module.getLinkInfos().iterator());
		view.connectAudios(module.getAudioInfos().iterator());
		view.sortGapsOrder();
	}

	private void connectViewListener() {
		view.addListener(new ITextViewListener() {
			@Override
			public void onAudioButtonClicked(AudioInfo audioInfo) {
				AudioWidget audio = audioInfo.getAudio();
				AudioButtonWidget button = audioInfo.getButton();

				if (audio.isPaused()) {
					// in future if audio can be paused and replayed from stopped moment 
					// reset would need to omit audio which was currently pressed
					resetAudio();

					audio.play();
					button.setStopPlayingStyleClass();
				} else {
					audio.reset();
					button.setStartPlayingStyleClass();
				}
			}

			@Override
			public void onAudioEnded(AudioInfo audioInfo) {
				AudioWidget audio = audioInfo.getAudio();
				AudioButtonWidget button = audioInfo.getButton();

				audio.reset();
				button.setStartPlayingStyleClass();
				sendOnAudioEndEvent(audioInfo.getIndex());
			}

			@Override
			public void onAudioTimeUpdate(AudioInfo audioInfo) {
				AudioWidget audioWidget = audioInfo.getAudio();
				String currentTime = audioWidget.getCurrentTimeInMMSSFormat();
				if (currentTime != audioInfo.getCurrentTime()) {
					audioInfo.setCurrentTime(currentTime);
					
					sendOnAudioCurrentTimeChangingEvent(audioInfo.getIndex(), currentTime);
				}
			}

			@Override
			public void onAudioPlaying(AudioInfo audioInfo) {
				sendOnAudioPlayingEvent(audioInfo.getIndex());
			}

			@Override
			public void onAudioPause(AudioInfo audioInfo) {
				sendOnAudioPauseEvent(audioInfo.getIndex());
			}

			@Override
			public void onUserAction(String id, String newValue) {
				valueChangedOnUserAction(id, newValue);
			}

			@Override
			public void onValueChanged(String id, String newValue) {
				valueChanged(id, newValue);
			}

			@Override
			public void onInlineValueChanged(String id, String newValue) {
				inlineValueChanged(id, newValue);
			}

			@Override
			public void onValueEdited(String id, String newValue) {
				valueEdited(id, newValue);
			}
			
			@Override
			public void onLinkClicked(LinkType type, String link, String target) {
				if (type == LinkType.PAGE) {
					gotoPage(link);
				} else if (type == LinkType.DEFINITION) {
					showDefinition(link);
				} else { //for external links
					Window.open(link, target, null);
				}
			}

			@Override
			public void onGapClicked(String gapId) {
				gapClicked(gapId);
			}

			@Override
			public void onGapFocused(String gapId, Element element) {
				markGapAsAccessed(gapId);
				gapFocused(gapId, element);
			}

			@Override
			public void onKeyAction(String gapId, Element element) {
				keyAction(gapId, element);
			}

			@Override
			public void onGapBlured(String gapId, Element element) {
				gapBlured(gapId, element);
			}

			@Override
			public void onDropdownClicked(String id) {
				dropdownClicked(id);

			}

			private HashMap<String, String> prepareEventData(String gapId) {
				DraggableItem previouslyConsumedItem = consumedItems.get(gapId);
				if (previouslyConsumedItem != null) {
					HashMap<String, String> eventData = new HashMap<String, String>();
					eventData.put("item", previouslyConsumedItem.getId());
					eventData.put("type", "string");
					eventData.put("value", previouslyConsumedItem.getValue());
					currentEventData = eventData;
				}
				return currentEventData;
			}

			@Override
			public void onGapDragged(String gapId) {
				CustomEvent dragEvent = new CustomEvent("itemDragged", prepareEventData(gapId));
				removeFromGap(gapId, true);
				playerServices.getEventBus().fireEvent(dragEvent);
			}

			@Override
			public void onGapStopped(String gapId) {
				CustomEvent stopEvent = new CustomEvent("itemStopped", prepareEventData(gapId));
				playerServices.getEventBus().fireEvent(stopEvent);
			}

			@Override
			public void onGapDropped(String id) {
				if(draggableItem != null){
					if (consumedItems.get(id) != null) {
						removeFromGap(id, true);
					}
					insertToGap(id);
				}
			}
		});
	}
	
	protected void dropdownClicked(String id) {
		this.sendValueChangedEvent("", "dropdownClicked", "");
	}

	protected void valueChangeLogic(String id, String newValue) {
		GapInfo gap = getGapInfoById(id);

		values.put(id, newValue);
		updateScore();

		String score = Integer.toString(getItemScore(id));
		String itemID = id.substring(id.lastIndexOf("-")+1);

		if (score.equals("0") && module.shouldBlockWrongAnswers()) {
			try {
				view.getChild(Integer.parseInt(itemID) - 1).setText("");
				values.remove(id);
			} catch(NumberFormatException nfe) {
				JavaScriptUtils.log(nfe);
			}
		}
		
		Integer groupIndex = -1;
		try {
			groupIndex = this.module.findGapGroupIndex(Integer.valueOf(itemID));
		} catch(NumberFormatException nfe) {
			JavaScriptUtils.log(nfe);
		}
		if (groupIndex == -1) {
			this.sendValueChangedEvent(itemID, newValue, score);
		} else {
			this.sendGapInGroupValueChangedEvent(itemID, newValue, score);
			
			GroupGapsListItem group = this.module.getGroupGaps().get(groupIndex);
			String groupScore = Integer.toString(getGroupScore(group));
			if (groupScore != "-1") {
				String groupID = Integer.toString(groupIndex + 1);
				this.sendGroupValueChangedEvent(groupID, groupScore);
			}
		}
	}
	
	protected void valueChangedOnUserAction(String id, String newValue) {
		if(module.isUserActionEvents()){
			valueChangeLogic(id, newValue);
		}
	}
	
	protected void valueChanged(String id, String newValue) {
		if(!module.isUserActionEvents()){
			valueChangeLogic(id, newValue);
		}
	}

	protected void inlineValueChanged(String id, String newValue) {
		valueChangeLogic(id, newValue);
	}

	protected void valueEdited(String id, String newValue) {
		values.put(id, newValue);
		updateScore();
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

		if (previouslyConsumedItem != null) {
			removeFromGap(gapId, true);
		} else if (draggableItem != null) {
			insertToGap(gapId);
		}

	}

	protected void insertToGap(String gapId) {
		String itemID = gapId.substring(gapId.lastIndexOf("-") + 1);
		String value = getDraggableValue();
		String parsedValue = getParsedValue();

		view.setValue(gapId, parsedValue);
		view.refreshMath();
		
		consumedItems.put(gapId, draggableItem);
		values.put(gapId, value);
		
		fireItemConsumedEvent();
		String score = Integer.toString(getItemScore(gapId));
		
		Integer groupIndex = -1;
		try {
			groupIndex = this.module.findGapGroupIndex(Integer.valueOf(itemID));
		} catch(NumberFormatException nfe) {
			JavaScriptUtils.log(nfe);
		}
		if (groupIndex == -1) {
			this.sendValueChangedEvent(itemID, value, score);
		} else {
			this.sendGapInGroupValueChangedEvent(itemID, value, score);
			
			GroupGapsListItem group = this.module.getGroupGaps().get(groupIndex);
			String groupScore = Integer.toString(getGroupScore(group));
			if (groupScore != "-1") {
				String groupID = Integer.toString(groupIndex + 1);
				this.sendGroupValueChangedEvent(groupID, groupScore);
			}
		}
		
		if (Integer.parseInt(score) == 0 && module.shouldBlockWrongAnswers()) {
			removeFromGap(gapId, false);
		}
	}

	private String getDraggableValue() {
		String value = draggableItem.getValue();
		if (hasTextStyle(value) || isMathFormula(value)) {
			return value;
		}
		
		return TextParser.removeHtmlFormatting(draggableItem.getValue());
	}

	private boolean hasTextStyle(String value) {
		String[] textFormatingTags = {"<b>", "<i>", "<s>", "<u>", "<mark>"};
		for (String tag : textFormatingTags) {
			if (value.contains(tag)) {
				return true;
			}
		}

		return false;
	}

	private boolean isMathFormula(String value) {
		String pattern = ".*[a-zA-Z0-9\\s]+<[a-zA-Z0-9\\s]+.*";

		return value.matches(pattern);
	}

	private String getParsedValue() {
		String value = draggableItem.getValue();
		if (!value.matches("<[^ ].*>")) {
			value = value.replace("<", "< ");
		}

		return value;
	}

	protected void removeFromGap(String gapId, boolean shouldFireEvent) {
		DraggableItem previouslyConsumedItem = consumedItems.get(gapId);

		removeFromItems(gapId);
		fireItemReturnedEvent(previouslyConsumedItem);

		if (shouldFireEvent) {
			sendRemoveFromGapValueChangedEvent(gapId);
		}

		view.refreshGapMath(gapId);
	}

	protected void gapFocused(String gapId, Element element) {
		InputElement input = InputElement.as(element);
		GapInfo gap = getGapInfoById(gapId);
		String enteredValue = input.getValue();

		if (module.isClearPlaceholderOnFocus() && !module.hasDraggableGaps()) {
			input.setAttribute("placeholder", "");

			if (enteredValue == "") {
				input.setValue("");
			}
		} else {
			if (enteredValue == "") {
				input.setValue(gap.getPlaceHolder());
			}
		}
		values.put(gapId, input.getValue());
	}

	protected void markGapAsAccessed(String gapId) {
		GapWidget gw = getGapWidgetFromGapId(gapId);
		if (!gw.hasGapBeenAccessed()) {
			gw.markGapAsAccessed();
		}
	}

	private native String replaceNumbersOnly(String value) /*-{
		return value.replace(/[^0-9]/g, "");
	}-*/;

	private String replaceAlphanumeric(String value){
		StringBuilder sb = new StringBuilder();

		for (int i = 0; i < value.length(); i++) {
			char c = value.charAt(i);
			if (GapInfo.isLetter(c) || GapInfo.isDigit(c)) {
				sb.append(c);
			}
		}

		return sb.toString();
	}

	private String replaceLettersOnly(String value){
		StringBuilder sb = new StringBuilder();

		for (int i = 0; i < value.length(); i++) {
			char c = value.charAt(i);
			if (GapInfo.isLetter(c)) {
				sb.append(c);
			}
		}

		return sb.toString();
	}

	protected void keyAction(String gapId, Element element){
		InputElement input = InputElement.as(element);
		String value = input.getValue();

		if(module.getValueType().equals("Number only")){
			input.setValue(replaceNumbersOnly(value));
		}else if(module.getValueType().equals("Letters only")){
			input.setValue(replaceLettersOnly(value));
		}else if(module.getValueType().equals("Alphanumeric")){
			input.setValue(replaceAlphanumeric(value));
		}
	}

	protected void gapBlured(String gapId, Element element) {
		InputElement input = InputElement.as(element);
		GapInfo gap = getGapInfoById(gapId);
		String enteredValue = input.getValue();

		if (module.isClearPlaceholderOnFocus() && !module.hasDraggableGaps()) {
			input.setAttribute("placeholder", gap.getPlaceHolder());
		}

		if (!module.ignoreDefaultPlaceholderWhenCheck() && enteredValue.equals(gap.getPlaceHolder())) {
			input.setValue("");
		}
	}

	private void restoreGapVisitedState(String gapId) {
	   InputElement input = DOM.getElementById(gapId).cast();
	   String enteredValue = input.getValue();
	   GapInfo gap = getGapInfoById(gapId);
	   String placeholder = gap.getPlaceHolder();

	   if (!enteredValue.equals(placeholder)) {
		   return;
	   }

	   if (module.ignoreDefaultPlaceholderWhenCheck()) {
		   input.setValue(placeholder);
	   } else {
		   input.setValue("");
	   }
	}

	private GapInfo getGapInfoById(String gapId) {
		GapInfo gap = gapInfos.get(gapId);
		if (gap == null) {
			gap = new GapInfo("stub", 0, false, false, 0, false);
			for (GapInfo gap1 : module.getGapInfos()) {
				if (gap1.getId().compareTo(gapId) == 0) {
					gap = gap1;
					break;
				}
			}
			gapInfos.put(gapId, gap);
		}
		return gap;
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
	public String executeCommand(String commandName, List<IType> params) {

		IStringType param = null;

		if (commandName.compareTo("settext") == 0 && params.size() > 0) {
			if (params.size() > 0 && params.get(0) instanceof IStringType) {
				param = (IStringType) params.get(0);
				setTextCommand(param.getValue());
			}
		} else if (commandName.compareTo("gettext") == 0 && params.size() > 0) {
			return view.getHTML();
		} else if (commandName.compareTo("enablegap") == 0 && params.size() == 1) {
			if (params.size() > 0 && params.get(0) instanceof IStringType) {
				param = (IStringType) params.get(0);
				int gapIndex = Integer.parseInt(param.getValue());
				enableGap(gapIndex);
			}
		} else if (commandName.compareTo("enableallgaps") == 0) {
			enableAllGaps();
		} else if (commandName.compareTo("disablegap") == 0 && params.size() == 1) {
			if (params.size() > 0 && params.get(0) instanceof IStringType) {
				param = (IStringType) params.get(0);
				int gapIndex = Integer.parseInt(param.getValue());
				disableGap(gapIndex);
			}
		} else if (commandName.compareTo("disableallgaps") == 0) {
			disableAllGaps();
		} else if (commandName.compareTo("show") == 0) {
			show();
		} else if (commandName.compareTo("hide") == 0) {
			hide();
		} else if (commandName.compareTo("reset") == 0) {
			reset(false);
		} else if (commandName.compareTo("isallok") == 0) {
			return String.valueOf(isAllOK());
		} else if (commandName.compareTo("markgapascorrect") == 0 && params.size() == 1) {
			if (params.size() > 0 && params.get(0) instanceof IStringType) {
				param = (IStringType) params.get(0);
				int gapIndex = Integer.parseInt(param.getValue());

				markGapAsCorrect(gapIndex);
			}
		} else if (commandName.compareTo("markgapaswrong") == 0 && params.size() == 1) {
			if (params.size() > 0 && params.get(0) instanceof IStringType) {
				param = (IStringType) params.get(0);
				int gapIndex = Integer.parseInt(param.getValue());

				markGapAsWrong(gapIndex);
			}
		} else if (commandName.compareTo("markgapasempty") == 0 && params.size() == 1) {
			if (params.size() > 0 && params.get(0) instanceof IStringType) {
				param = (IStringType) params.get(0);
				int gapIndex = Integer.parseInt(param.getValue());

				markGapAsEmpty(gapIndex);
			}
		} else if (commandName.compareTo("getscore") == 0) {
			return String.valueOf(getScore());
		} else if (commandName.compareTo("geterrorcount") == 0) {
			return String.valueOf(getErrorCount());
		} else if (commandName.compareTo("getmaxscore") == 0) {
			return String.valueOf(getMaxScore());
		} else if (commandName.compareTo("setshowerrorsmode") == 0) {
			setShowErrorsMode();
		} else if (commandName.compareTo("setworkmode") == 0) {
			setWorkMode();
		} else if (commandName.compareTo("showanswers") == 0) {
			showAnswers();
		} else if (commandName.compareTo("hideanswers") == 0) {
			hideAnswers();
		}

		return "";
	}
	
	/**
	 * Get group score using gap id
	 *
	 * @param currentItemID
	 * @return 1 if all items in group are correct,
	 *         0 if all items in group filled in and at least one item is wrong,
	 *        -1 if at least one item in group is empty and this is not a correct answer
	 **/
	private int getGroupScore(GroupGapsListItem group) {
		int gapInfosSize = this.module.getGapInfos().size();
		for (Integer gapIndex: group.getParsedGapsIndexes()) {
			String gapId = getGapIdByGapIndex(gapIndex - 1);
			GapInfo gapInfo = getGapInfoById(gapId);
			String enteredValue = getElementText(gapInfo);
			int gapScore = getItemScore(gapId);
			if (enteredValue.isEmpty() && gapScore == 0) {
				return -1;
			}
			if (gapScore == 0) {
				return 0;
			}
		}
		
		return 1;
	}
	
	private String getGapIdByGapIndex(Integer gapIndex) {
		Integer gapInfosSize = module.getGapInfos().size();
		if (gapIndex < gapInfosSize) {
			return module.getGapInfos().get(gapIndex).getId();
		}
		return module.getChoiceInfos().get(gapIndex - gapInfosSize).getId();
	}

	private int getItemScore(String itemID) {
		int score = 0;

		GapInfo gap = getGapInfoById(itemID);
		String enteredValue = getElementText(gap);
		if (enteredValue.equals(gap.getPlaceHolder()) && !gap.isCorrect(gap.getPlaceHolder())) {
			enteredValue = "";
		}
		if (gap.isCorrect(enteredValue)) {
			score = gap.getValue();
		}

		for (InlineChoiceInfo choice : module.getChoiceInfos()) {
			if (choice.getId().compareTo(itemID) == 0) {
				String enteredChoiceValue = getElementText(choice.getId());
				if (module.isCaseSensitive()) {
					if (choice.getAnswer().compareTo(enteredChoiceValue) == 0) {
						score = choice.getValue();
					}
				} else {
					if (choice.getAnswer().compareToIgnoreCase(enteredChoiceValue) == 0) {
						score = choice.getValue();
					}
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

	public JavaScriptObject getAsJavaScript() {
		if (jsObject == null) {
			jsObject = initJSObject(this);
		}

		return jsObject;
	}

	@Override
	public void setDisabled(boolean value) {
		isDisabled = value;
		if (value) {
			disableAllGaps();
		} else {
			enableAllGaps();
		}
	}

	// module also has isDisabled - but I think it should not be changed and used as it is set in editor by lesson creator
	// so it doesn't have anything to do with lesson state
	@Override
	public boolean isDisabled() {
		return isDisabled;
	}

	@Override
	public int getActivitiesCount() {
		return view.getGapCount();
	}

	private void jsOnEventReceived (String eventName, String jsonData) {
		this.onEventReceived(eventName, jsonData == null ? new HashMap<String, String>() : (HashMap<String, String>)JavaScriptUtils.jsonToMap(jsonData));
	}

	private native JavaScriptObject initJSObject(TextPresenter x) /*-{
		var presenter = function() {};

		presenter.isActivity = function() {
			return x.@com.lorepo.icplayer.client.module.text.TextPresenter::isActivity()();
		}

		presenter.getValue = function(gapId) {
			return x.@com.lorepo.icplayer.client.module.text.TextPresenter::getValue(I)(gapId);
		};

		presenter.setUserValue = function(gapId, val) {
			x.@com.lorepo.icplayer.client.module.text.TextPresenter::setUserValue(ILjava/lang/String;)(gapId, val);
		}

		presenter.getGapText = function(gapId) {
			return x.@com.lorepo.icplayer.client.module.text.TextPresenter::getGapText(I)(gapId);
		};

		presenter.setGapAnswer = function(gapId, answer) {
			x.@com.lorepo.icplayer.client.module.text.TextPresenter::setGapAnswer(ILjava/lang/String;)(gapId, answer);
		}

		presenter.setGapText = function(gapIndex, text) {
			x.@com.lorepo.icplayer.client.module.text.TextPresenter::setGapText(ILjava/lang/String;)(gapIndex, text);
		}

		presenter.getGapValue = function(gapId) {
			return x.@com.lorepo.icplayer.client.module.text.TextPresenter::getGapText(I)(gapId);
		};

		presenter.isGapAttempted = function(gapId) {
			return x.@com.lorepo.icplayer.client.module.text.TextPresenter::isGapAttempted(I)(gapId);
		};

		presenter.markGapAsCorrect = function(gapId) {
			x.@com.lorepo.icplayer.client.module.text.TextPresenter::markGapAsCorrect(I)(gapId);
		};

		presenter.markGapAsWrong = function(gapId) {
			x.@com.lorepo.icplayer.client.module.text.TextPresenter::markGapAsWrong(I)(gapId);
		};

		presenter.markGapAsEmpty = function(gapId) {
			x.@com.lorepo.icplayer.client.module.text.TextPresenter::markGapAsEmpty(I)(gapId);
		};

		presenter.enableGap = function(gapId) {
			x.@com.lorepo.icplayer.client.module.text.TextPresenter::enableGap(I)(gapId);
		};

		presenter.enableAllGaps = function() {
			x.@com.lorepo.icplayer.client.module.text.TextPresenter::enableAllGaps()();
		};

		presenter.disableGap = function(gapId) {
			x.@com.lorepo.icplayer.client.module.text.TextPresenter::disableGap(I)(gapId);
		};

		presenter.disableAllGaps = function() {
			x.@com.lorepo.icplayer.client.module.text.TextPresenter::disableAllGaps()();
		};

		presenter.setText = function(text) {
			x.@com.lorepo.icplayer.client.module.text.TextPresenter::setTextCommand(Ljava/lang/String;)(text.toString());
		};

		presenter.show = function() {
			x.@com.lorepo.icplayer.client.module.text.TextPresenter::show()();
		};

		presenter.hide = function() {
			x.@com.lorepo.icplayer.client.module.text.TextPresenter::hide()();
		};

		presenter.reset = function() {
			x.@com.lorepo.icplayer.client.module.text.TextPresenter::reset(Z)(false);
		};

		if (presenter.isActivity()) {
			presenter.isAttempted = function() {
				return x.@com.lorepo.icplayer.client.module.text.TextPresenter::isAttempted()();
			};
		}

		presenter.getView = function() {
			return x.@com.lorepo.icplayer.client.module.text.TextPresenter::getView()();
		};

		presenter.isAllOK = function() {
			return x.@com.lorepo.icplayer.client.module.text.TextPresenter::isAllOK()();
		};

		presenter.markConnectionWithMath = function() {
			x.@com.lorepo.icplayer.client.module.text.TextPresenter::markConnectionWithMath()();
		};
		
		presenter.onEventReceived = function (eventName, data) {
			x.@com.lorepo.icplayer.client.module.text.TextPresenter::jsOnEventReceived(Ljava/lang/String;Ljava/lang/String;)(eventName, JSON.stringify(data));
		};

		presenter.getScore = function() {
			return x.@com.lorepo.icplayer.client.module.text.TextPresenter::getScore()();
		};

		presenter.getErrorCount = function() {
			return x.@com.lorepo.icplayer.client.module.text.TextPresenter::getErrorCount()();
		};

		presenter.getMaxScore = function() {
			return x.@com.lorepo.icplayer.client.module.text.TextPresenter::getMaxScore()();
		};

		presenter.setShowErrorsMode = function() {
			x.@com.lorepo.icplayer.client.module.text.TextPresenter::setShowErrorsMode()();
		};

		presenter.setWorkMode = function() {
			x.@com.lorepo.icplayer.client.module.text.TextPresenter::setWorkMode()();
		};

		presenter.showAnswers = function() {
			x.@com.lorepo.icplayer.client.module.text.TextPresenter::showAnswers()();
		};

		presenter.hideAnswers = function() {
			x.@com.lorepo.icplayer.client.module.text.TextPresenter::hideAnswers()();
		};

		return presenter;
	}-*/;

	private native void connectGapWhenMathJaxReady(TextPresenter x, String id) /*-{
		try {
			var hook = $wnd.MathJax.Hub.Register.MessageHook("End Process", function () {
				var dfd = $wnd.$.Deferred(),
					element = $wnd.$("[id='" + id + "']");
				var pageStamp = x.@com.lorepo.icplayer.client.module.text.TextPresenter::getPageStamp()();
				var checkSelector = setInterval(function () {
					if (element.length) {
						dfd.resolve(element);
						clearInterval(checkSelector);
					}
				}, 100);

				dfd.promise().done(function (_element) {
					// promise can be executed after page change, check if page wasn't changed
					var currentPageStamp = x.@com.lorepo.icplayer.client.module.text.TextPresenter::getPageStamp()();
					if (pageStamp === currentPageStamp) {
						setTimeout(function() {
							x.@com.lorepo.icplayer.client.module.text.TextPresenter::connectMathGap(Ljava/lang/String;)(id);
							x.@com.lorepo.icplayer.client.module.text.TextPresenter::restoreGapMode()();
						}, 200);
					}
					$wnd.MathJax.Hub.signal.hooks["End Process"].Remove(hook);
				});
			});
		} catch(err) {
			console.log("Error : " + err);
		}
	}-*/;

	private void restoreGapMode() {
		if (this.isShowErrorsMode) {
			this.setShowErrorsMode();
		}
	}
	
	private String getPageStamp() {
		return this.playerServices.getCommands().getPageStamp();
	}

	private void connectMathGap(String id) {
		view.connectMathGap(module.getGapInfos().iterator(), id, savedDisabledState);
	}

	private Element getView() {
		if (isShowAnswers()) {
//			hideAnswers();
		}

		return view.getElement();
	}

	private String getValue(int index) {
		return view.getChild(index-1).getTextValue();
	}

	private String getGapText(int index) {
		if (isShowAnswers()) {
			hideAnswers();
		}

		if (view != null && index <= view.getChildrenCount()) {
			return getValue(index);
		}

		return "[error]";
	}

	private void setGapAnswer(int index, String answer) {
		if (view != null && index <= view.getChildrenCount()) {
			TextElementDisplay gap = view.getChild(index-1);
			gap.setStyleShowAnswers();
			gap.setText(answer);
		}

		blockAllGaps();
		isMathShowAnswersActive = true;
	}

	private void setUserValue(int index, String value) {
		if (view != null && index <= view.getChildrenCount()) {
			TextElementDisplay gap = view.getChild(index-1);
			gap.setText(value);
			gap.removeStyleHideAnswers();
		}

		isMathShowAnswersActive = false;
	}

	private void setGapText(int gapIndex, String text) {
		if (view != null && gapIndex <= view.getChildrenCount() && gapIndex > 0) {
			TextElementDisplay gap = view.getChild(gapIndex-1);
			String gapID = gap.getId();
			view.setValue(gapID, text);
			view.refreshMath();
			values.put(gapID, text);
		}
	}

	private boolean isGapAttempted(int index) {
		if (isShowAnswers()) {
			hideAnswers();
		}

		if (view != null && index <= view.getChildrenCount()) {
			return view.getChild(index-1).isAttempted();
		}

		return false;
	}

	private void markGapAsCorrect(int index) {
		if (isShowAnswers()) {
			hideAnswers();
		}

		if (view != null && index <= view.getChildrenCount()) {
			view.getChild(index-1).markGapAsCorrect();
		}
	}

	private void markGapAsWrong(int index) {
		if (isShowAnswers()) {
			hideAnswers();
		}

		if (view != null && index <= view.getChildrenCount()) {
			view.getChild(index-1).markGapAsWrong();
		}
	}

	private void markGapAsEmpty(int index) {
		if (isShowAnswers()) {
			hideAnswers();
		}

		if (view != null && index <= view.getChildrenCount()) {
			view.getChild(index-1).markGapAsEmpty();
		}
	}

	private void enableGap(int index) {
		if (isShowAnswers()) {
			hideAnswers();
		}

		if (view != null && index <= view.getChildrenCount()){
			view.getChild(index-1).setDisabled(false);
		}
	}

	private void enableAllGaps() {
		if (isShowAnswers()) {
			hideAnswers();
		}

		for (int index = 0; index < view.getChildrenCount(); index++) {
			view.getChild(index).setDisabled(false);
		}
	}

	private void disableGap(int index) {
		if (isShowAnswers()) {
			hideAnswers();
		}

		if (view != null && index <= view.getChildrenCount()){
			view.getChild(index-1).setDisabled(true);
		}
	}

	private void disableAllGaps() {
		if (isShowAnswers()) {
			hideAnswers();
		}

		for (int index = 0; index < view.getChildrenCount(); index++) {
			view.getChild(index).setDisabled(true);
		}
	}

	@Override
	public boolean isActivity() {
		return module.isActivity();
	}

	private boolean isAttempted() {
		if (isShowAnswers()) {
			hideAnswers();
		}

		for (int index = 0; index < view.getChildrenCount(); index++) {
			if (!view.getChild(index).isAttempted()) {
				return false;
			}
		}

		return true;
	}

	private void setTextCommand(String text) {
		setText(text);
		view.refreshMath();
	}

	private void setText(String text) {
		isTextSetByCommand = true;
		if (isShowAnswers()) {
			hideAnswers();
		}

		enteredText = text;
		view.setValue(text);
	}

	private void show() {
		isVisible = true;
		if (view != null) {
			view.show(true);
		}

		if (isShowAnswers()) {
			for (int i = 0; i < view.getChildrenCount(); i++) {
				TextElementDisplay child = view.getChild(i);
				child.reset();
				child.setStyleShowAnswers();
			}

			this.setShowAnswersTextInGaps();

			view.refreshMath();
		}
	}

	private void hide() {
		isVisible = false;
		if (view != null) {
			view.hide();
		}
	}

	public boolean isAllOK() {
		return getScore() == getMaxScore() && getErrorCount() == 0;
	}

	public void markConnectionWithMath() {
		isConnectedToMath = true;
	}
	
	@Override
	public boolean isSelectable (boolean isTextToSpeechOn) {
		final boolean isVisible = !this.getView().getStyle().getVisibility().equals("hidden") && !this.getView().getStyle().getDisplay().equals("none");
		final boolean isGroupDivHidden = KeyboardNavigationController.isParentGroupDivHidden(view.getElement());
		return (isTextToSpeechOn || haveStandaloneKeyboardNavigationSupport()) && isVisible && !isGroupDivHidden;
	}
	
	@Override
	public boolean haveStandaloneKeyboardNavigationSupport() {
		boolean isWithGaps = view.getChildrenCount() > 0;
		boolean hasLinks = module.getLinkInfos().iterator().hasNext();
		boolean isEnabled = !this.module.isDisabled();
		return (isWithGaps || hasLinks) && isEnabled && !module.shouldOmitInKeyboardNavigation();
	}

	@Override
	public IWCAG getWCAGController() {
		return (IWCAG) this.view;
	}

	@Override
	public void selectAsActive(String className) {
		this.getView().addClassName(className);
	}

	@Override
	public void deselectAsActive(String className) {
		this.getView().removeClassName(className);
	}
	
	public String getGapType () {
		return "Text";
	}

	@Override
	public boolean isEnterable() {
		return WCAGUtils.hasGaps(this.module) || WCAGUtils.hasLinks(this.module);
	}

	@Override
	public void onEventReceived(String eventName, HashMap<String, String> data) {
		if (eventName.equals("ShowAnswers")) {
			showAnswers();
		} else if (eventName.equals("HideAnswers")) {
			hideAnswers();
		}
	}

	public void sendValueChangedEvent(String itemID, String value, String score) {
		String moduleType = module.getModuleTypeName();
		String id = module.getId();

		this.playerServices.getEventBusService().sendValueChangedEvent(moduleType, id, itemID, value, score);
	}

	private void sendRemoveFromGapValueChangedEvent(String gapId) {
		String value = "";
		String score = "0";
		String itemID = gapId.substring(gapId.lastIndexOf("-") + 1);

		this.sendValueChangedEvent(itemID, value, score);
	}

	private void sendOnAudioPlayingEvent(int audioId) {
		String itemID = "" + audioId;
		String value = "playing";
		String score = "";

		this.sendValueChangedEvent(itemID, value, score);
	}

	private void sendOnAudioCurrentTimeChangingEvent(int audioId, String currentTime) {
		String itemID = "" + audioId;
		String score = "";

		this.sendValueChangedEvent(itemID, currentTime, score);
	}

	private void sendOnAudioPauseEvent(int audioId) {
		String itemID = "" + audioId;
		String value = "pause";
		String score = "";

		this.sendValueChangedEvent(itemID, value, score);
	}

	private void sendOnAudioEndEvent(int audioId) {
		String itemID = "" + audioId;
		String value = "end";
		String score = "";

		this.sendValueChangedEvent(itemID, value, score);
	}

	public void sendGapInGroupValueChangedEvent(String itemID, String value, String score) {
		String newScore = "correct";
		if (score == "0") {
			newScore = "wrong";
		}
		
		this.sendValueChangedEvent(itemID, value, newScore);
	}

	public void sendGroupValueChangedEvent(String groupID, String score) {
		String itemID = "Group" + groupID;
		String value = "";
		
		this.sendValueChangedEvent(itemID, value, score);
	}

	private void removeFromItems(String gapId) {
		consumedItems.remove(gapId);
		values.remove(gapId);
		view.setValue(gapId, "");
	}

	private void setCurrentViewState() {
		this.currentScore = getScore();
		this.currentErrorCount = getErrorCount();
		this.currentMaxScore = getMaxScore();
		this.currentState = getState();
	}

	@Override
	public List<ScoreWithMetadata> getScoreWithMetadata() {
		return view.getScoreWithMetadata();
	}

	private GapWidget getGapWidgetFromGapId(String gapId) {
		GapWidget gw = null;
		for (int i=0; i < view.getChildrenCount(); i++) {
			TextElementDisplay child = view.getChild(i);
			if (gapId.equalsIgnoreCase(child.getId()) && child instanceof GapWidget ) {
				gw = (GapWidget) view.getChild(i);
				break;
			}
		}

		return gw;
	}

	private boolean isGapCheckable(GapInfo gap) {
		GapWidget gw = getGapWidgetFromGapId(gap.getId());
		if (gw == null) {
			return true;
		}
		return gap.isValueCheckable(module.ignoreDefaultPlaceholderWhenCheck(), gw.hasGapBeenAccessed());
	}
}
