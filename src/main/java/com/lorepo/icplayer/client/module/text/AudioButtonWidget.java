package com.lorepo.icplayer.client.module.text;

import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.ui.Button;
import com.lorepo.icplayer.client.module.text.TextPresenter.TextElementDisplay;

public class AudioButtonWidget extends Button implements TextElementDisplay {

    public static final String BUTTON_ID_PREFIX = "ic_text_audio_button-";
    public static final String BUTTON_CLASS = "ic_text_audio_button";
    public static final String BUTTON_CLASS_PLAY_STYLE = "text-audio-button-play";
    public static final String BUTTON_CLASS_STOP_STYLE = "text-audio-button-stop";

    public AudioButtonWidget(Element buttonElement) {
        super(buttonElement);
        onAttach();
    }

    public void setStopPlayingStyleClass() {
        removeStyleName(BUTTON_CLASS_PLAY_STYLE);
        addStyleName(BUTTON_CLASS_STOP_STYLE);
    }

    public void setStartPlayingStyleClass() {
        removeStyleName(BUTTON_CLASS_STOP_STYLE);
        addStyleName(BUTTON_CLASS_PLAY_STYLE);
    }

    @Override
    public boolean hasId(String id) {
        // TODO not implement
        return false;
    }

    @Override
    public void setShowErrorsMode(boolean isActivity) {
        // TODO not implement
    }

    @Override
    public void setWorkMode() {
        // TODO not implement
    }

    @Override
    public void reset() {
        // TODO not implement
    }

    @Override
    public String getTextValue() {
        // TODO not implement
        return null;
    }

    @Override
    public String getWCAGTextValue() {
        // TODO not implement
        return null;
    }

    @Override
    public void markGapAsCorrect() {
        // TODO not implement
    }

    @Override
    public void markGapAsWrong() {
        // TODO not implement
    }

    @Override
    public void markGapAsEmpty() {
        // TODO not implement
    }

    @Override
    public boolean isAttempted() {
        // TODO not implement
        return false;
    }

    @Override
    public boolean isActivity() {
        return false;
    }

    @Override
    public void setDisabled(boolean disabled) {
        // TODO not implement
    }

    @Override
    public boolean isDisabled() {
        // TODO not implement
        return false;
    }

    @Override
    public void setStyleShowAnswers() {
        // TODO not implement
    }

    @Override
    public void removeStyleHideAnswers() {
        // TODO not implement
    }

    @Override
    public void setEnableGap(boolean enable) {
        // TODO not implement
    }

    @Override
    public void removeDefaultStyle() {
        // TODO not implement
    }

    @Override
    public void setDroppedElement(String element) {
        // TODO not implement
    }

    @Override
    public String getDroppedElement() {
        // TODO not implement
        return null;
    }

    @Override
    public String getId() {
        // TODO not implement
        return null;
    }

    @Override
    public boolean getResetStatus() {
	    // TODO not implement
        return false;
	}

	@Override
	public void setResetStatus(boolean wasReset) {
	    // TODO not implement
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
        return "audio";
    }

    @Override
    public void select() {
        addStyleName("keyboard_navigation_active_element");
    }

    @Override
    public void deselect() {
        removeStyleName("keyboard_navigation_active_element");
    }

    @Override
    public boolean isWorkingMode() {
        // TODO not implement
        return false;
    }

    @Override
    public int getGapState() {
        // TODO not implement
        return 0;
    }

    @Override
    public String getLangTag() {
        // TODO not implement
        return null;
    }

    @Override
    public void showAnswers() {

    }
}
