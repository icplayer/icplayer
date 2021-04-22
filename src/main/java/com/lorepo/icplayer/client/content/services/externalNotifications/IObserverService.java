package com.lorepo.icplayer.client.content.services.externalNotifications;

public interface IObserverService {
    void addObserver(ObservableValue value, IObserver object);
    void addObserver(String value, IObserver object);
    void notifySave();
    ObserverJSService getAsJS();
}
