package com.lorepo.icplayer.client.content.services.externalNotifications;

public interface IObserverService {
    void addObserver(ObservableValue value, Observer object);
    void addObserverJS(String value, Observer object);
    void notifySave();
    ObserverJSService getAsJS();
}
