package com.lorepo.icplayer.client.module.text;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.ui.HTML;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icplayer.client.module.text.TextPresenter.TextElementDisplay;

public class DraggableGapWidget extends HTML implements TextElementDisplay {

	private static final String EMPTY_GAP_STYLE = "ic_draggableGapEmpty";
	private static final String FILLED_GAP_STYLE = "ic_draggableGapFilled";
	private static final String EMPTY_TEXT = "&nbsp;";
	private GapInfo gapInfo;
	private boolean disabled = false;
	private boolean isWorkMode = true;
	private String answerText = "";
	private boolean isFilledGap = false;
	private JavaScriptObject jsObject = null;
	private ITextViewListener listener;
	
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
				public void onClick(ClickEvent event) {
					event.stopPropagation();
					event.preventDefault();
					if (listener != null && !disabled && isWorkMode) {
						listener.onGapClicked(gapInfo.getId());
					}
				}
			});
		}
		
		JavaScriptUtils.makeDropable(getElement());
	}
	
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
		var view = function(){};
		view.itemDragged = function() {
			return x.@com.lorepo.icplayer.client.module.text.DraggableGapWidget::itemDragged()();
		};
		view.itemStopped = function() {
			return x.@com.lorepo.icplayer.client.module.text.DraggableGapWidget::itemStopped()();
		};
		view.isDragPossible = function() {
			return x.@com.lorepo.icplayer.client.module.text.DraggableGapWidget::isDragPossible()();
		};
		return view;
	}-*/;
	
	private void itemDragged() {
		if (listener != null) {
			listener.onGapDragged(gapInfo.getId());
		}
	}
	
	private void itemStopped() {
		if (listener != null) {
			listener.onGapStopped(gapInfo.getId());
		}
	}
	
	private boolean isDragPossible() {
		if (!isWorkMode || this.disabled) {
			return false;
		}
		return true;
	}
	
	@Override
	public void setShowErrorsMode(boolean isActivity) {

		if (isActivity) {
			if (answerText.length() > 0) {
				if (gapInfo.isCorrect(answerText)){
					addStyleDependentName("correct");
				} else {
					addStyleDependentName("wrong");
				}
			} else {
				addStyleDependentName("empty");
			}
		}
		isWorkMode = false;
	}
	
	public void setWorkMode() {
		removeStyleDependentName("correct");
		removeStyleDependentName("wrong");
		removeStyleDependentName("empty");
		isWorkMode = true;
	}
	
	public void reset() {
		setText("");
		removeStyleDependentName("correct");
		removeStyleDependentName("wrong");
		removeStyleDependentName("empty");
		isWorkMode = true;
	}
	
	public void setText(String text) {
		
		if (text.isEmpty()) {
			super.setHTML(EMPTY_TEXT);
			setStylePrimaryName(EMPTY_GAP_STYLE);
			answerText = "";
		} else {
			String markup = StringUtils.markup2html(StringUtils.escapeHTML(text));
			super.setHTML(markup);
			answerText = StringUtils.removeAllFormatting(text);
			setStylePrimaryName(FILLED_GAP_STYLE);
			JavaScriptUtils.makeDroppedDraggable(getElement(), getAsJavaScript());
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
	public void markGapAsCorrect() {
		removeStyleDependentName("wrong");
		removeStyleDependentName("empty");
		addStyleDependentName("correct");
	}

	@Override
	public void markGapAsWrong() {
		removeStyleDependentName("correct");
		removeStyleDependentName("empty");
		addStyleDependentName("wrong");
	}

	public void setDisabled(boolean disabled) {
		this.disabled = disabled;
		if (disabled) {
			addStyleDependentName("disabled");
		} else{
			removeStyleDependentName("disabled");
		}
	}

	@Override
	public void markGapAsEmpty() {
		removeStyleDependentName("correct");
		removeStyleDependentName("wrong");
		addStyleDependentName("empty");
	}

	public boolean isAttempted() {
		return (answerText.length() > 0);
	}

	@Override
	public boolean isDisabled() {
		return disabled;
	}

	@Override
	public void setStyleShowAnswers() {
		addStyleDependentName("correct-answer");
		setDisabled(true);
	}

	@Override
	public void removeStyleHideAnswers() {
		removeStyleDependentName("correct-answer");
		setDisabled(false);
	}
}
