package com.lorepo.icplayer.client.content.services.externalNotifications;

import java.util.HashMap;


public class ObserverService implements IObserverService {
    private final HashMap<String, ObserverList> observers;

    public ObserverService() {
        this.observers = new HashMap<String, ObserverList>();

        for (ObservableValue value : ObservableValue.values()) {
            this.observers.put(value.getType(), ObserverList.create());
        }
    }

    public void addObserver(ObservableValue value, Observer object) {
        addObserver(value.name(), object);
    }

    public void notifySave() {
        this.notifyObservers(ObservableValue.SAVE);
    }

    public ObserverJSService getAsJS() {
        return ObserverJSService.create(this);
    }

    public void addObserver(String value, Observer object) {
        ObserverList list = observers.get(value);
        list.addObserver(object);
    }

    private void notifyObservers(ObservableValue value) {
        ObserverList observers = this.observers.get(value.getType());
        observers.callObservers();
    }

}
