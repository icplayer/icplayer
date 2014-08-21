package com.lorepo.icplayer.client.module.text;

import java.util.Iterator;

import com.google.gwt.core.client.Scheduler;
import com.google.gwt.core.client.Scheduler.ScheduledCommand;
import com.google.gwt.event.dom.client.BlurEvent;
import com.google.gwt.event.dom.client.BlurHandler;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.DropEvent;
import com.google.gwt.event.dom.client.DropHandler;
import com.google.gwt.event.dom.client.KeyUpEvent;
import com.google.gwt.event.dom.client.KeyUpHandler;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.ui.TextBox;
import com.lorepo.icplayer.client.module.text.TextPresenter.TextElementDisplay;

public class GapWidget extends TextBox implements TextElementDisplay{

	private GapInfo gapInfo;
	private boolean isDisabled = false;
	
	
	public GapWidget(GapInfo gi, final ITextViewListener listener){
		
		super(DOM.getElementById(gi.getId()));
		
		gapInfo = gi;
		setStylePrimaryName("ic_gap");
		
		if (gi.getMaxLength()>0) {
			int max_length = gi.getMaxLength();
			String answer;
			Iterator<String> get_answers = gi.getAnswers();
			while (get_answers.hasNext()) {
				answer = get_answers.next();
				if (answer.length() > max_length) {
					max_length = answer.length();
				}
			}
			setMaxLength(max_length);
		}
		
		onAttach();
		
		if (listener != null) {
			
			addKeyUpHandler(new KeyUpHandler() {
				public void onKeyUp(KeyUpEvent event) {
					listener.onValueEdited(gapInfo.getId(), getText());
				}
			});
			
			addBlurHandler(new BlurHandler() {
				public void onBlur(BlurEvent event) {
					listener.onValueChanged(gapInfo.getId(), getText());
				}
			});

			addDropHandler(new DropHandler() {
				
				@Override
				public void onDrop(DropEvent event) {
					if(!event.getDataTransfer().getData("text/plain").isEmpty()) {
						Scheduler.get().scheduleDeferred(new ScheduledCommand() {
							
							@Override
							public void execute() {
								listener.onValueChanged(gapInfo.getId(), getText());
							}
						});
					}
					
				}
			});
		}
		addClickHandler(new ClickHandler() {
			public void onClick(ClickEvent event) {
				event.stopPropagation();
			}
		});
		
	}
	
	public boolean hasId(String id){
		return (gapInfo.getId().compareTo(id) == 0);
	}

	@Override
	public void setShowErrorsMode(boolean isActivity) {

		if(isActivity) {
			String text = getText().trim();
			if (text.length() > 0) {
				if (gapInfo.isCorrect(text)) {
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
	
	public void setWorkMode() {
		removeStyleDependentName("correct");
		removeStyleDependentName("wrong");
		removeStyleDependentName("empty");
		setEnabled(!isDisabled);
	}

	
	public void reset() {
		setText("");
		removeStyleDependentName("correct");
		removeStyleDependentName("wrong");
		removeStyleDependentName("empty");
		setEnabled(!isDisabled);
	}

	@Override
	public String getTextValue() {
		return getText();
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

	@Override
	public void markGapAsEmpty() {
		removeStyleDependentName("correct");
		removeStyleDependentName("wrong");
		addStyleDependentName("empty");
	}

	public boolean isAttempted() {
		return (getText().trim().length() > 0);
	}

	public void setDisabled(boolean disabled) {
		isDisabled = disabled;
		setEnabled(!disabled);
	}

	@Override
	public boolean isDisabled() {
		return isDisabled;
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

}
