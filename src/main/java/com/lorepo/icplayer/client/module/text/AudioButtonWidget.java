package com.lorepo.icplayer.client.module.text;

import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.ui.Button;

public class AudioButtonWidget extends Button {

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
}
