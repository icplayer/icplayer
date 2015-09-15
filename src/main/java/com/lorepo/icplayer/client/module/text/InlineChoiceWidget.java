package com.lorepo.icplayer.client.module.text;

import com.google.gwt.event.dom.client.ChangeEvent;
import com.google.gwt.event.dom.client.ChangeHandler;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.TouchEndEvent;
import com.google.gwt.event.dom.client.TouchEndHandler;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.ui.ListBox;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icplayer.client.module.text.TextPresenter.TextElementDisplay;

public class InlineChoiceWidget extends ListBox implements TextElementDisplay{

	private InlineChoiceInfo choiceInfo;
	private boolean isDisabled = false;
	private String value = "";
	private boolean clicked = false;
	
	public InlineChoiceWidget(InlineChoiceInfo gi, final ITextViewListener listener){
		
		super(DOM.getElementById(gi.getId()));
		
		choiceInfo = gi;
		setStylePrimaryName("ic_inlineChoice");
		addStyleName("ic_inlineChoice-default");
		
		onAttach();
		
		if(listener != null){
			
			addChangeHandler(new ChangeHandler() {
				
				@Override
				public void onChange(ChangeEvent event) {
					int index = getSelectedIndex();
					if(index > 0){
						value = StringUtils.unescapeXML(getValue(index));
						removeStyleName("ic_inlineChoice-default");
					}
					else{
						value = "---";
						addStyleName("ic_inlineChoice-default");
					}
					listener.onValueChanged(choiceInfo.getId(), value);
				}
			});
			
			addClickHandler(new ClickHandler() {
				public void onClick(ClickEvent event) {
					event.stopPropagation();
				}
			});
			
			addTouchEndHandler(new TouchEndHandler() {
				public void onTouchEnd(TouchEndEvent event) {
					event.stopPropagation();
					if (!clicked) {
						listener.onDropdownClicked(choiceInfo.getId());
						clicked = true;
					}
				}
			});
		}
	}

	public boolean hasId(String id){
		return (choiceInfo.getId().compareTo(id) == 0);
	}

	@Override
	public void setShowErrorsMode(boolean isActivity) {

		if(isActivity) {
			int index = getSelectedIndex();

			if(index > 0) {
				if(getItemText(index).compareTo(choiceInfo.getAnswer()) == 0){
					addStyleDependentName("correct");
				} else {
					addStyleDependentName("wrong");
				}
			} else {
				addStyleDependentName("empty");
			}
		}
		
		setEnabled(false);
			
	}
	
	@Override
	public void setStyleShowAnswers() {
		addStyleDependentName("correct-answer");
		setEnabled(false);
	}

	@Override
	public void removeStyleHideAnswers() {
		removeStyleDependentName("correct-answer");
		setEnabled(true);
	}

	public void setWorkMode() {

		removeStyleDependentName("correct");
		removeStyleDependentName("wrong");
		removeStyleDependentName("empty");
		setEnabled(!isDisabled);
	}

	public void reset() {

		setSelectedIndex(0);
		removeStyleDependentName("correct");
		removeStyleDependentName("wrong");
		removeStyleDependentName("empty");
		addStyleName("ic_inlineChoice-default");
		setEnabled(!isDisabled);
	}
	
	public void setText(String value) {
		
		for(int i = 0; i < getItemCount(); i++){
			String item = getItemText(i);
			if(item.compareTo(value) == 0){
				setItemSelected(i, true);
				break;
			}
		}
	}

	@Override
	public String getTextValue() {
	
		int index = getSelectedIndex();
		return getItemText(index);
	}

	@Override
	public void markGapAsCorrect() {
		removeStyleDependentName("wrong");
		removeStyleDependentName("empty");
		addStyleDependentName("correct");
	}

	@Override
	public void markGapAsWrong() {
		if(!getTextValue().equals("---")){
			removeStyleDependentName("correct");
			removeStyleDependentName("empty");
			addStyleDependentName("wrong");
		}
	}

	public void setDisabled(boolean disabled) {

		isDisabled = disabled;
		setEnabled(!disabled);
	}

	@Override
	public void markGapAsEmpty() {
	}

	public boolean isAttempted() {
		int index = getSelectedIndex();
		return (index > 0);
	}

	@Override
	public boolean isDisabled() {
		return isDisabled;
	}

	@Override
	public void setEnableGap(boolean enable) {
		setEnabled(enable);		
	}

	@Override
	public void removeDefaultStyle() {
		removeStyleName("ic_inlineChoice-default");		
	}

	@Override
	public void setDroppedElement(String element) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public String getDroppedElement() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String getId() {
		return choiceInfo.getId();
	}
}
