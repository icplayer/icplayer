package com.lorepo.icplayer.client.content.services.externalNotifications;

import java.util.HashMap;


public class ObserverService implements IObserverService {
    private final HashMap<ObservableValue, ObserverList> observers;

    public ObserverService() {
        this.observers = new HashMap<ObservableValue, ObserverList>();

        for (ObservableValue value : ObservableValue.values()) {
            this.observers.put(value, ObserverList.create());
        }
    }

    public void addObserver(ObservableValue value, Observer object) {
        ObserverList list = observers.get(value);
        list.addObserver(object);
    }

    public void notifySave() {
        this.notifyObservers(ObservableValue.SAVE);
    }

    public ObserverJSService getAsJS() {
        return ObserverJSService.create(this);
    }

    public void addObserverJS(String value, Observer object) {
        ObservableValue v = ObservableValue.valueOf(value);
        addObserver(v, object);
    }

    private void notifyObservers(ObservableValue value) {
        ObserverList observers = this.observers.get(value.getType());
        observers.callObservers();
    }

}
