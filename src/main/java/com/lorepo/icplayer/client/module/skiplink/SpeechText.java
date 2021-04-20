package com.lorepo.icplayer.client.module.skiplink;

public enum SpeechText {
    SELECTED("selected"),
    DESELECTED("deselected");

    private String value;

    SpeechText(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
