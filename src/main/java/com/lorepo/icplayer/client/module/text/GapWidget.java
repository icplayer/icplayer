package com.lorepo.icplayer.client.module.text;

import java.util.ArrayList;
import java.util.Iterator;

import com.google.gwt.core.client.Scheduler;
import com.google.gwt.core.client.Scheduler.ScheduledCommand;
import com.google.gwt.event.dom.client.BlurEvent;
import com.google.gwt.event.dom.client.BlurHandler;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.DropEvent;
import com.google.gwt.event.dom.client.DropHandler;
import com.google.gwt.event.dom.client.KeyPressEvent;
import com.google.gwt.event.dom.client.KeyPressHandler;
import com.google.gwt.event.dom.client.KeyUpEvent;
import com.google.gwt.event.dom.client.KeyUpHandler;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.event.shared.HandlerRegistration;
import com.google.gwt.regexp.shared.MatchResult;
import com.google.gwt.regexp.shared.RegExp;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.ui.TextBox;
import com.lorepo.icplayer.client.module.text.TextPresenter.TextElementDisplay;
import com.lorepo.icplayer.client.module.text.TextPresenter.NavigationTextElement;



public class GapWidget extends TextBox implements TextElementDisplay, NavigationTextElement {
	private boolean isDisabled = false;
	private String gapId = "";
	private String text = "";
	private boolean firstSend = true;
	private boolean isSelected = false;
	private boolean isWorkingMode = true;
	private int gapState = 0;
	private ArrayList<HandlerRegistration> handlers = new ArrayList<HandlerRegistration>();
	private boolean ignorePlaceholder = false;
	private boolean gapHasBeenAccessed = false;
	private final String expNotationPattern = "^[+-]?[,.\\d]*([eE][+-]?[,.\\d]*)?$";
	
	protected final GapInfo gapInfo;
	
	public GapWidget(GapInfo gi, ITextViewListener listener){
		super(DOM.getElementById(gi.getId()));
		gapInfo = gi;
		
		this.initialize(listener);
	}
	
	public void reconnectHandlers (ITextViewListener listener) {
		/**
		 * When gap is rerendered by MathJax then will lost connection to DOM element (handlers doesn't work). 
		 * In this case we need to drop old gap, find new one and set listeners to him.
		 */
		String value = super.getText();
		boolean isDisabled = this.isDisabled();
		this.removeHandlers();
		this.onDetach();
		this.setElement(DOM.getElementById(this.gapInfo.getId()));
		
		this.initialize(listener);
		this.setText(value);
		this.setDisabled(isDisabled);
	}
	
	public void setSizeAttribute(int size) {
		this.getElement().setAttribute("size", Integer.toString(size));
	}

	public void setIgnorePlaceholder(boolean ignore) {
	    this.ignorePlaceholder = ignore;
	}

	public void markGapAsAccessed() {
	    this.gapHasBeenAccessed = true;
	}

	public boolean hasGapBeenAccessed() {
	    return this.gapHasBeenAccessed;
	}

	private final void initialize (ITextViewListener listener) {

		setStylePrimaryName("ic_gap");

		if (this.gapInfo.getMaxLength() > 0) {
			int max_length = this.gapInfo.getMaxLength();
			max_length = Math.max(max_length, this.gapInfo.getPlaceHolder().length());
			String answer;
			Iterator<String> get_answers = this.gapInfo.getAnswers();
			while (get_answers.hasNext()) {
				answer = get_answers.next();
				if (answer.length() > max_length) {
					max_length = answer.length();
				}
			}
			setMaxLength(max_length);
		}
		if (this.gapInfo.isNumericOnly()) {
			this.getElement().setPropertyString("type","tel");
			this.getElement().setPropertyString("step","any");
		}
		this.getElement().setPropertyString("autocomplete","off");

		onAttach();

		this.connectHandlers(listener);		
	}
	
	protected void removeHandlers () {
		for (HandlerRegistration handler: this.handlers) {
			handler.removeHandler();
		}
		
		this.handlers.clear();
	}

	protected void connectHandlers (final ITextViewListener listener) {
		if (listener != null) {
			this.handlers.add(addKeyUpHandler(new KeyUpHandler() {
				@Override
				public void onKeyUp(KeyUpEvent event) {
					if (gapInfo.isNumericOnly()) {
						String newText = getText();
						if (newText.length() > 0 && !newText.matches(expNotationPattern)) {
							String patternWithoutLastCharacter
									= expNotationPattern.substring(0, expNotationPattern.length() - 1);
							RegExp regExp = RegExp.compile(patternWithoutLastCharacter);
							MatchResult matcher = regExp.exec(newText);

							if (matcher != null) {
								setText(matcher.getGroup(0));
							} else {
								setText("");
							}
						}
					}
					if(shouldSendEvent()) {
						listener.onValueEdited(gapInfo.getId(), getText());
						listener.onUserAction(gapInfo.getId(), getText());
					}
				}
			}));

			this.handlers.add(addKeyPressHandler(new KeyPressHandler() {
				@Override
				public void onKeyPress(KeyPressEvent event) {
					if (gapInfo.isNumericOnly()) {
						String newText = "";
						String oldText = GapWidget.super.getText();
						if (getSelectionLength() > 0) {
							newText = oldText.substring(0, getCursorPos())
									+ event.getCharCode()
									+ oldText.substring(getCursorPos() + getSelectionLength());
						} else {
							newText = oldText.substring(0, getCursorPos())
									+ event.getCharCode()
									+ oldText.substring(getCursorPos());
						}
						if (!newText.matches(expNotationPattern)) {
							((TextBox)event.getSource()).cancelKey();
						}
					}
				}
			}));
			
			this.handlers.add(addValueChangeHandler(new ValueChangeHandler<String>() {

				@Override
				public void onValueChange(ValueChangeEvent<String> event) {
					if(shouldSendEvent()) {
						listener.onValueEdited(gapInfo.getId(), getText());
						listener.onUserAction(gapInfo.getId(), getText());
					}
				}
			}));
			
			this.handlers.add(addBlurHandler(new BlurHandler() {
				public void onBlur(BlurEvent event) {
					listener.onKeyAction(gapInfo.getId(), event.getRelativeElement());
				}
			}));

			this.handlers.add(addBlurHandler(new BlurHandler() {
				@Override
				public void onBlur(BlurEvent event) {
					listener.onValueChanged(gapInfo.getId(), getText());
				}
			}));

			this.handlers.add(addDropHandler(new DropHandler() {

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
			}));
		} 
		
		this.handlers.add(addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				event.stopPropagation();
			}
		}));
	}

	private boolean shouldSendEvent() {
		String value = getText();
		String gapID = gapInfo.getId();
		boolean wasReset = gapInfo.getResetStatus();

		if (value != this.text || gapID != this.gapId || this.firstSend || wasReset) {
			this.text = value;
			this.gapId = gapID;
			this.firstSend = false;
			gapInfo.setResetStatus(false);
			return true;
		}
		
		return false;
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
    	setEnabled(false);
    	if (isActivity) {
			String text = TextParser.parseAnswer(getText().trim());
			boolean ignoreCheckingIfCorrect = !this.gapInfo.isValueCheckable(this.ignorePlaceholder, this.gapHasBeenAccessed);
			this.isWorkingMode = false;

			if (text.length() <= 0 || ignoreCheckingIfCorrect) {
				addStyleDependentName("empty");
				this.gapState = 3;
				return;
			}
			if (gapInfo.isCorrect(text)) {
				addStyleDependentName("correct");
				this.gapState = 1;
			} else {
				addStyleDependentName("wrong");
				this.gapState = 2;
			}

		}
	}

	@Override
	public void setWorkMode() {
		this.gapState = 0;
		this.isWorkingMode = true;
		removeStyleDependentName("correct");
		removeStyleDependentName("wrong");
		removeStyleDependentName("empty");
		setEnabled(!isDisabled);
	}

	@Override
	public void reset() {
		setText("");
		gapInfo.setResetStatus(true);
		this.setWorkMode();
		this.gapHasBeenAccessed = false;
		removeStyleDependentName("correct-answer");
	}

	@Override
	public String getTextValue() {
		return getText();
	}
	
	@Override
	public String getWCAGTextValue() {
		return getText();
	}

	@Override
	public void markGapAsCorrect () {
		this.gapState = 1;
		this.isWorkingMode = false;
		removeStyleDependentName("wrong");
		removeStyleDependentName("empty");
		addStyleDependentName("correct");
	}

	@Override
	public void markGapAsWrong () {
		this.gapState = 2;
		this.isWorkingMode = false;
		removeStyleDependentName("correct");
		removeStyleDependentName("empty");
		addStyleDependentName("wrong");
	}

	@Override
	public void markGapAsEmpty() {
		this.gapState = 3;
		this.isWorkingMode = false;
		removeStyleDependentName("correct");
		removeStyleDependentName("wrong");
		addStyleDependentName("empty");
	}

	@Override
	public boolean isAttempted() {
	    if (this.ignorePlaceholder && this.gapInfo.getPlaceHolder().length() > 0) {
	        return this.gapHasBeenAccessed;
	    }
		return (getText().trim().length() > 0);
	}

	@Override
	public boolean isActivity() {
		return true;
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
	public void removeDefaultStyle() {}

	@Override
	public void setDroppedElement(String element) {}

	@Override
	public String getDroppedElement() {
		return null;
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
	public void setFocusGap(boolean focus) {
		if (focus) {
			this.select();
		} else {
			this.deselect();
		}
		setFocus(focus);
	}

	@Override
	public String getGapType() {
		return "gap";
	}
	
	@Override
	public String getLangTag() {
		return gapInfo.getLangTag();
	}

	@Override
	public void showAnswers() {
		setText(gapInfo.getFirstCorrectAnswer());
		addStyleDependentName("correct-answer");
	}

	@Override
	public void setElementFocus(boolean focus) {
		if (focus) {
			this.select();
		} else {
			this.deselect();
		}
		setFocus(focus);
	}

	@Override
	public String getElementType() {
		return "gap";
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
	
	public boolean isSelected () {
		return this.isSelected;
	}
	
	public boolean isWorkingMode () {
		return this.isWorkingMode;
	}
	
	public int getGapState () {
		return this.gapState;
	}
	
	public String getText() {
		String t = super.getText();

		if(t.isEmpty()){
			t = DOM.getElementProperty(getElement(), "placeholder");
		}

		return t; 
	}
}
