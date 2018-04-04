package com.lorepo.icplayer.client.module.text;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.event.dom.client.ChangeEvent;
import com.google.gwt.event.dom.client.ChangeHandler;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.TouchEndEvent;
import com.google.gwt.event.dom.client.TouchEndHandler;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.ui.ListBox;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.TextToSpeechVoice;
import com.lorepo.icplayer.client.module.text.TextPresenter.TextElementDisplay;
import com.lorepo.icplayer.client.page.PageController;


public class InlineChoiceWidget extends ListBox implements TextElementDisplay {
	private InlineChoiceInfo choiceInfo;
	private boolean isDisabled = false;
	private String value = "";
	private boolean clicked = false;
	private PageController pageController;
	private boolean isSelected = false;
	private String langTag = "";
	private boolean isWorkingMode = true;
	private int gapState = 0;
	private TextView view;

	public InlineChoiceWidget (InlineChoiceInfo gi, final ITextViewListener listener, TextView view) {

		super(DOM.getElementById(gi.getId()));

		this.view = view;
		this.choiceInfo = gi;
		setStylePrimaryName("ic_inlineChoice");
		addStyleName("ic_inlineChoice-default");

		onAttach();

		if (listener != null) {
			addChangeHandler(new ChangeHandler() {

				@Override
				public void onChange (ChangeEvent event) {
					int index = getSelectedIndex();
					if (index > 0) {
						value = StringUtils.unescapeXML(getValue(index));
						removeStyleName("ic_inlineChoice-default");
					} else {
						value = "---";
						addStyleName("ic_inlineChoice-default");
					}
					listener.onValueChanged(choiceInfo.getId(), value);
					if(getView().isWCAGon()){
						List<TextToSpeechVoice> textVoices = new ArrayList<TextToSpeechVoice>();
						textVoices.add(TextToSpeechVoice.create(value, getView().getLang()));
						getPageController().speak(textVoices);
					}
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

	public boolean hasId(String id) {
		return (choiceInfo.getId().compareTo(id) == 0);
	}

	@Override
	public void setShowErrorsMode(boolean isActivity) {

		if (isActivity) {
			this.isWorkingMode = false;
			int selectedIndex = getSelectedIndex();
			boolean isFilledGap = selectedIndex > 0;

			if (isFilledGap) {
				boolean isCorrectAnswer = getItemText(selectedIndex).compareTo(choiceInfo.getAnswer()) == 0;
				addStyleDependentName(isCorrectAnswer ? "correct" : "wrong");
				this.gapState = (isCorrectAnswer ? 1 : 2);
			} else {
				addStyleDependentName("empty");
				this.gapState = 3;
			}
		}

		setEnabled(false);
	}

	@Override
	public void setStyleShowAnswers() {
		this.gapState = 1;
		addStyleDependentName("correct-answer");
		setEnabled(false);
	}

	@Override
	public void removeStyleHideAnswers() {
		this.gapState = 0;
		removeStyleDependentName("correct-answer");
		setEnabled(true);
	}

	public void setWorkMode() {
		this.isWorkingMode = true;
		removeStyleDependentName("correct");
		removeStyleDependentName("wrong");
		removeStyleDependentName("empty");
		setEnabled(!isDisabled);
	}

	public void reset() {
		setSelectedIndex(0);
		addStyleName("ic_inlineChoice-default");
		setWorkMode();
	}

	public void setText(String value) {
		for (int i = 0; i < getItemCount(); i++) {
			String item = getItemText(i);
			if (item.compareTo(value) == 0) {
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
	public String getWCAGTextValue() {
		int index = getSelectedIndex();
		return getValue(index);
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
		if (!getTextValue().equals("---")) {
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
		this.gapState = 3;
		removeStyleDependentName("wrong");
		removeStyleDependentName("correct");
		addStyleDependentName("empty");
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

	}

	@Override
	public String getDroppedElement() {
		return null;
	}

	@Override
	public String getId() {
		return choiceInfo.getId();
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
		return "dropdown";
	}
	
	private PageController getPageController () {
		return this.pageController;
	}
	
	public void setPageController (PageController pc) {
		this.pageController = pc;
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

	public void setLang(String langTag) {
		this.langTag = langTag;
	}

	@Override
	public boolean isWorkingMode() {
		return this.isWorkingMode;
	}

	@Override
	public int getGapState() {
		return this.gapState;
	}
	
	private TextView getView(){
		return this.view;
	}
}
