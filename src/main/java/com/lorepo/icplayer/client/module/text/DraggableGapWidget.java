package com.lorepo.icplayer.client.module.text;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.ui.HTML;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icplayer.client.module.text.TextPresenter.TextElementDisplay;
import com.lorepo.icplayer.client.utils.MathJax;

public class DraggableGapWidget extends HTML implements TextElementDisplay{

	private static final String EMPTY_GAP_STYLE = "ic_draggableGapEmpty";
	private static final String FILLED_GAP_STYLE = "ic_draggableGapFilled";
	private static final String EMPTY_TEXT = "&nbsp;";
	private GapInfo gapInfo;
	private boolean disabled = false;
	private String answerText = "";
	
	
	public DraggableGapWidget(GapInfo gi, final ITextViewListener listener){
		
		super(DOM.getElementById(gi.getId()));
		
		gapInfo = gi;
		setStylePrimaryName(EMPTY_GAP_STYLE);
		
		onAttach();
		setText("");
		
		if(listener != null){
			
			addClickHandler(new ClickHandler() {
				public void onClick(ClickEvent event) {
					if(listener != null && !disabled){
						listener.onGapClicked(gapInfo.getId());
					}
				}
			});
		}
	}
	
	public boolean hasId(String id){
		return (gapInfo.getId().compareTo(id) == 0);
	}

	@Override
	public void setShowErrorsMode(boolean isActivity) {

		if(isActivity){
			if(answerText.length() > 0){
				if(gapInfo.isCorrect(answerText)){
					addStyleDependentName("correct");
				}
				else{
					addStyleDependentName("wrong");
				}
			}
			else{
				addStyleDependentName("empty");
			}
		}
		
		disabled = true;
	}

	
	public void setWorkMode() {

		removeStyleDependentName("correct");
		removeStyleDependentName("wrong");
		removeStyleDependentName("empty");
		disabled = false;
	}

	
	public void reset() {
		
		setText("");
		removeStyleDependentName("correct");
		removeStyleDependentName("wrong");
		removeStyleDependentName("empty");
		disabled = false;
	}

	
	public void setText(String text) {
		
		if(text.isEmpty()){
			super.setHTML(EMPTY_TEXT);
			setStylePrimaryName(EMPTY_GAP_STYLE);
			answerText = "";
		}
		else{
			super.setHTML(text);
			answerText = StringUtils.removeAllFormatting(text);
			setStylePrimaryName(FILLED_GAP_STYLE);
			MathJax.refreshMathJax(getElement());
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
		if(disabled){
			addStyleDependentName("disabled");
		}
		else{
			removeStyleDependentName("disabled");
		}
	}

	@Override
	public void markGapAsEmpty() {
		removeStyleDependentName("correct");
		removeStyleDependentName("wrong");
		addStyleDependentName("empty");
	}

	@Override
	public boolean isDisabled() {
		return disabled;
	}
}
