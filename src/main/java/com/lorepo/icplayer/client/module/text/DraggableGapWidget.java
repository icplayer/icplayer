package com.lorepo.icplayer.client.module.text;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.ui.HTML;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.TextToSpeechVoice;
import com.lorepo.icplayer.client.model.alternativeText.AlternativeTextService;
import com.lorepo.icplayer.client.model.alternativeText.IToken;
import com.lorepo.icplayer.client.module.text.TextPresenter.TextElementDisplay;
import com.lorepo.icplayer.client.module.text.TextPresenter.NavigationTextElement;

import java.util.ArrayList;
import java.util.List;

public class DraggableGapWidget extends HTML implements TextElementDisplay, AltTextGap, NavigationTextElement {

	private static final String EMPTY_GAP_STYLE = "ic_draggableGapEmpty";
	private static final String FILLED_GAP_STYLE = "ic_draggableGapFilled";
	private static final String EMPTY_TEXT = "&nbsp;";
	private final GapInfo gapInfo;
	private boolean disabled = false;	// As outside state, we need to separate internal state of DnD gap from external state e.g when show answers is called.
	private boolean _disabled = false;	// For internal usage
	private boolean isWorkMode = true;
	private String answerText = "";
	private String rawAnswerText = "";
	private List<TextToSpeechVoice> wcagText = new ArrayList<TextToSpeechVoice>();
	private boolean isFilledGap = false;
	private JavaScriptObject jsObject = null;
	private final ITextViewListener listener;
	private boolean isDragMode = false;
	private String droppedElementHelper = "";
	private boolean isShowAnswersMode = false;
	private boolean isSelected = false;
	private int gapState = 0;
	

	public DraggableGapWidget(GapInfo gi, final ITextViewListener listener) {
		super(DOM.getElementById(gi.getId()));

		this.listener = listener;
		gapInfo = gi;
		Element element = getElement();
		this.isFilledGap = element.getAttribute("class").contains("ic_filled_gap");
		removeStyleName(getStyleName());

		setStylePrimaryName(EMPTY_GAP_STYLE);
		onAttach();
		setText("");

		if (listener != null) {
			addClickHandler(new ClickHandler() {
				@Override
				public void onClick(ClickEvent event) {
					event.stopPropagation();
					event.preventDefault();
					if (listener != null && isWorkMode && !_disabled) {
						listener.onGapClicked(gapInfo.getId());
					}
				}
			});
		}

		JavaScriptUtils.makeDropable(getElement(), getAsJavaScript());
	}

	@Override
	public boolean hasId(String id) {
		return (gapInfo.getId().compareTo(id) == 0);
	}

	public JavaScriptObject getAsJavaScript() {
		if (jsObject == null) {
			jsObject = initJSObject(this);
		}
		return jsObject;
	}

	private native JavaScriptObject initJSObject(DraggableGapWidget x) /*-{
		var view = function() {};
		view.itemDragged = function() {
			return x.@com.lorepo.icplayer.client.module.text.DraggableGapWidget::itemDragged()();
		};
		view.itemStopped = function() {
			return x.@com.lorepo.icplayer.client.module.text.DraggableGapWidget::itemStopped()();
		};
		view.isDragPossible = function() {
			return x.@com.lorepo.icplayer.client.module.text.DraggableGapWidget::isDragPossible()();
		};
		view.dropHandler = function(droppedElemnt) {
			x.@com.lorepo.icplayer.client.module.text.DraggableGapWidget::dropHandler(Ljava/lang/String;)(droppedElemnt);
		}
		return view;
	}-*/;

	private void itemDragged() {
		isDragMode = true;
		if (listener != null) {
			listener.onGapDragged(gapInfo.getId());
		}
	}

	private void itemStopped() {
		isDragMode = false;
		if (listener != null) {
			listener.onGapStopped(gapInfo.getId());
		}
	}

	private boolean isDragPossible() {
		if (!isWorkMode || this._disabled) {
			return false;
		}
		return true;
	}

	private void dropHandler(String droppedElement) {
		if (listener != null && !_disabled && isWorkMode) {
			listener.onGapDropped(gapInfo.getId());
			droppedElementHelper = droppedElementToString(droppedElement);
		}
	}
	
	public native static String droppedElementToString(String text) /*-{
		var element = $wnd.$(text).addClass("ic_sourceListItem-selected");
		return $wnd.$('<div>').append(element.clone()).html();
	}-*/;

	@Override
	public void setShowErrorsMode(boolean isActivity) {
		if (isActivity) {
			if (rawAnswerText.length() > 0) {
				if (gapInfo.isCorrect(rawAnswerText)){
					addStyleDependentName("correct");
					this.gapState = 1;
				} else {
					addStyleDependentName("wrong");
					this.gapState = 2;
				}
			} else {
				addStyleDependentName("empty");
				this.gapState = 3;
			}
		}
		isWorkMode = false;
	}

	@Override
	public void setWorkMode() {
		removeStyleDependentName("correct");
		removeStyleDependentName("wrong");
		removeStyleDependentName("empty");
		isWorkMode = true;
	}

	@Override
	public void reset() {
		setText("");
		setWorkMode();
		removeStyleDependentName("correct-answer");
	}

	public native static String getElement(String text) /*-{		
		var isLatex = false;
		var element;
		var sourceListItems = $wnd.$("#_icplayer").find(".ic_sourceListItem");

		if(text.indexOf("\\(") > -1 && text.indexOf("\\)") > -1){
			var newText = text.replace("\\(", "").replace("\\)", "");
			text = newText;
			isLatex = true;
			// element with MathJax class is removed - it contains another node with item text
			// so calling text() on node would return same text twice
			element = sourceListItems.filter(function(){ return $wnd.$(this).clone().children().remove('.MathJax').end().text() == text;});
		}else{
			element = sourceListItems.filter(function(){ return $wnd.$(this).text() == text;});
		}

		var helper = $wnd.$(element[0]).clone();
		helper.css("display", "block");
        helper.css("visibility", "");
		helper.addClass("ic_sourceListItem-selected");
		return $wnd.$('<div>').append(helper.clone()).html();
	}-*/;
	
	@Override
	public void setDroppedElement(String element) {
		droppedElementHelper = StringUtils.unescapeXML(element);
		if (!droppedElementHelper.equals("")) {
			JavaScriptUtils.makeDroppedDraggableText(getElement(), getAsJavaScript(), droppedElementHelper);
		}
	}
	
	@Override
	public String getDroppedElement() {
		return droppedElementHelper;
	}
	
	@Override
	public void setText(String text) {
		if (text.isEmpty()) {
			if (!isFilledGap) {
				super.setHTML(EMPTY_TEXT);
			} else {
				super.setHTML(gapInfo.getPlaceHolder());
			}
			setStylePrimaryName(EMPTY_GAP_STYLE);
			answerText = "";
			rawAnswerText = "";
			wcagText.clear();
			droppedElementHelper = "";
			if (!isDragMode) {
				JavaScriptUtils.destroyDraggable(getElement());
			}
		} else {
			String markup = StringUtils.markup2html(text);
			List<IToken> tokens = AlternativeTextService.parseAltText(markup);
			String visibleText = AlternativeTextService.getVisibleText(tokens);
			wcagText = AlternativeTextService.getReadableText(tokens, getLangTag());

			super.setHTML(visibleText);
			answerText = TextParser.removeHtmlFormatting(visibleText);
			rawAnswerText = text;
			droppedElementHelper = getElement(answerText);
			setStylePrimaryName(FILLED_GAP_STYLE);
			if (!droppedElementHelper.isEmpty() && !isShowAnswersMode){
				JavaScriptUtils.makeDroppedDraggableText(this.getElement(), getAsJavaScript(), droppedElementHelper);
			}
		}

		if (isFilledGap) {
			addStyleName("ic_filled_gap");
		}
	}

	@Override
	public String getTextValue() {
		return answerText;
	}
	
	@Override
	public String getWCAGTextValue() {
		return answerText;
	}
	
	@Override
	public String getId() {
		return gapInfo.getId();
	}

    @Override
	public boolean getResetStatus() {
	    return gapInfo.getResetStatus();
	}

	@Override
	public void setResetStatus(boolean wasReset) {
	    gapInfo.setResetStatus(wasReset);
	}

	@Override
	public void markGapAsCorrect() {
		this.gapState = 1;
		removeStyleDependentName("wrong");
		removeStyleDependentName("empty");
		addStyleDependentName("correct");
	}

	@Override
	public void markGapAsWrong() {
		this.gapState = 2;
		removeStyleDependentName("correct");
		removeStyleDependentName("empty");
		addStyleDependentName("wrong");
	}

	@Override
	public void setDisabled(boolean disabled) {
		this.disabled = disabled;
		this.setDisabledInternally(disabled);
	}
	
	
	private void setDisabledInternally(boolean value) {
		this._disabled = value;
		
		if (value) {
			addStyleDependentName("disabled");
		} else{
			removeStyleDependentName("disabled");
		}
	}
	

	@Override
	public void markGapAsEmpty() {
		this.gapState = 3;
		removeStyleDependentName("correct");
		removeStyleDependentName("wrong");
		addStyleDependentName("empty");
	}

	@Override
	public boolean isAttempted() {
		return (answerText.length() > 0);
	}

	@Override
	public boolean isActivity() {
		return true;
	}

	@Override
	public boolean isDisabled() {
		return disabled;
	}

	@Override
	public void setStyleShowAnswers() {
		isShowAnswersMode = true;
		addStyleDependentName("correct-answer");
		setDisabledInternally(true);
	}

	@Override
	public void removeStyleHideAnswers() {
		isShowAnswersMode = false;
		removeStyleDependentName("correct-answer");
		setDisabled(this.disabled);
	}

	@Override
	public void setEnableGap(boolean enable) {
		setDisabled(!enable);
	}

	@Override
	public void removeDefaultStyle() {}
	
	private void setFocus(boolean focus) {
		if (focus) {
			this.select();
		} else {
			this.deselect();
		}
	}

	@Override
	public void setElementFocus(boolean focus) {
		setFocus(focus);
	}

	@Override
	public String getElementType() {
		return "draggable";
	}

	@Override
	public void setFocusGap(boolean focus) {
		setFocus(focus);
	}

	@Override
	public String getGapType() {
		return "draggable";
	}
	
	@Override
	public String getLangTag() {
		return gapInfo.getLangTag();
	}

	@Override
	public void showAnswers() {
		String answer = gapInfo.getFirstCorrectAnswer();
		this.setText(answer);
		addStyleDependentName("correct-answer");
	}

	public void select() {
		this.addStyleName("keyboard_navigation_active_element");
		this.addStyleName("keyboard_navigation_active_element_text");
		this.isSelected = true;
	}

	@Override
	public void deselect() {
		this.removeStyleName("keyboard_navigation_active_element");
		this.removeStyleName("keyboard_navigation_active_element_text");
		this.isSelected = false;
		DOM.getElementById(this.getId()).blur();
	}

    public boolean isSelected() {
		return this.isSelected;
	}

	@Override
	public boolean isWorkingMode() {
		return this.isWorkMode;
	}

	@Override
	public int getGapState() {
		return this.gapState;
	}

	@Override
	public List<TextToSpeechVoice> getReadableText() {
		return this.wcagText;
	}
}
