package com.lorepo.icplayer.client.module.text;

import com.google.gwt.event.dom.client.ChangeEvent;
import com.google.gwt.event.dom.client.ChangeHandler;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.ui.ListBox;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icplayer.client.module.text.TextPresenter.TextElementDisplay;

public class InlineChoiceWidget extends ListBox implements TextElementDisplay{

	private InlineChoiceInfo choiceInfo;
	private boolean isDisabled = false;
	
	
	public InlineChoiceWidget(InlineChoiceInfo gi, final ITextViewListener listener){
		
		super(DOM.getElementById(gi.getId()));
		
		choiceInfo = gi;
		setStylePrimaryName("ic_inlineChoice");
		
		onAttach();
		
		if(listener != null){
			
			addChangeHandler(new ChangeHandler() {
				
				@Override
				public void onChange(ChangeEvent event) {
					int index = getSelectedIndex();
					String value = "";
					if(index > 0){
						value = StringUtils.unescapeXML(getValue(index));
					}
					else{
						value = "---";
					}
					listener.onValueChanged(choiceInfo.getId(), value);
				}
			});
		}
	}

	public boolean hasId(String id){
		return (choiceInfo.getId().compareTo(id) == 0);
	}

	@Override
	public void setShowErrorsMode(boolean isActivity) {

		int index = getSelectedIndex();
		if(isActivity){

			if(index > 0){
				if(getItemText(index).compareTo(choiceInfo.getAnswer()) == 0){
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
		
		setEnabled(false);
			
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
		removeStyleDependentName("correct");
		removeStyleDependentName("empty");
		addStyleDependentName("wrong");
	}

	public void setDisabled(boolean disabled) {

		isDisabled = disabled;
		setEnabled(!disabled);
	}

	@Override
	public void markGapAsEmpty() {
	}

	@Override
	public boolean isDisabled() {
		return isDisabled;
	}

}
