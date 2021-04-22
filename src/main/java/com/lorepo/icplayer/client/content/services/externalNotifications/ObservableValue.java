package com.lorepo.icplayer.client.content.services.externalNotifications;

public enum ObservableValue {
    SAVE ("save");

    private final String type;
    ObservableValue(String type) {
        this.type = type;
    }

    public String getType() {
        return this.type;
    }
}