package com.lorepo.icplayer.client.module.text;

public class AudioInfo {

    private final String id;
    private AudioButtonWidget button;
    private AudioWidget audio;

    public AudioInfo(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public AudioButtonWidget getButton() {
        return button;
    }

    public void setButton(AudioButtonWidget button) {
        this.button = button;
    }

    public AudioWidget getAudio() {
        return audio;
    }

    public void setAudio(AudioWidget audio) {
        this.audio = audio;
    }
}
