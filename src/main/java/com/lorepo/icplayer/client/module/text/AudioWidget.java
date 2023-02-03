package com.lorepo.icplayer.client.module.text;

import com.google.gwt.dom.client.AudioElement;
import com.google.gwt.media.client.Audio;

public class AudioWidget extends Audio {

    public static final String AUDIO_ID_PREFIX = "ic_text_audio-";
    public static final String AUDIO_CLASS = "ic_text_audio";

    public AudioWidget(AudioElement audioElement) {
        super(audioElement);
        addStyleName(AUDIO_CLASS);
        onAttach();
    }

    public void reset(){
        pause();
        setCurrentTime(0);
    }

    public String getCurrentTimeInMMSSFormat() {
        int currentTime = (int) this.getCurrentTime();
        int minutes = currentTime / 60;
        int seconds = currentTime % 60;
        String minutesRep = "" + minutes;
        if (minutes < 10) {
            minutesRep = "0" + minutesRep;
        }
        String secondsRep = "" + seconds;
        if (seconds < 10) {
            secondsRep = "0" + secondsRep;
        }
        return minutesRep + ":" + secondsRep;
    }
}
