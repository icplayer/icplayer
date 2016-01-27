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

	private final GapInfo gapInfo;
	private boolean isDisabled = false;


	public GapWidget(GapInfo gi, final ITextViewListener listener){

		super(DOM.getElementById(gi.getId()));

		gapInfo = gi;
		setStylePrimaryName("ic_gap");

		if (gi.getMaxLength()>0) {
			int max_length = gi.getMaxLength();
			max_length = Math.max(max_length, gi.getPlaceHolder().length());
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
				@Override
				public void onKeyUp(KeyUpEvent event) {
					listener.onValueEdited(gapInfo.getId(), getText());
				}
			});
			
			addBlurHandler(new BlurHandler() {
				public void onBlur(BlurEvent event) {
					listener.onKeyAction(gapInfo.getId(), event.getRelativeElement());
				}
			});

			addBlurHandler(new BlurHandler() {
				@Override
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
			@Override
			public void onClick(ClickEvent event) {
				event.stopPropagation();
			}
		});

	}

	public GapInfo getGapInfo() {
		return gapInfo;
	}

	@Override
	public boolean hasId(String id){
		return (gapInfo.getId().compareTo(id) == 0);
	}

	@Override
	public void setShowErrorsMode(boolean isActivity) {
		if (isActivity) {
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

	@Override
	public void setWorkMode() {
		removeStyleDependentName("correct");
		removeStyleDependentName("wrong");
		removeStyleDependentName("empty");
		setEnabled(!isDisabled);
	}

	@Override
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

	@Override
	public boolean isAttempted() {
		return (getText().trim().length() > 0);
	}

	@Override
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

	@Override
	public void setEnableGap(boolean enable) {
		setEnabled(enable);		
	}

	@Override
	public void removeDefaultStyle() {	
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
		return gapInfo.getId();
	}

	@Override
	public void setFocusGap(boolean focus) {
		setFocus(focus);
	}
}
