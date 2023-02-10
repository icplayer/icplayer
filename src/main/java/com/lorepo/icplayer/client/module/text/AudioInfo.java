package com.lorepo.icplayer.client.module.text;

public class AudioInfo {

    private final String id;
    private AudioButtonWidget button;
    private AudioWidget audio;
    private int index;
    private String currentTime = "00:00";

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

    public void setIndex(int index) {
        this.index = index;
    }

    public int getIndex() {
        return index;
    }

    public void setCurrentTime(String currentTime) {
        this.currentTime = currentTime;
    }

    public String getCurrentTime() {
        return currentTime;
    }
}
