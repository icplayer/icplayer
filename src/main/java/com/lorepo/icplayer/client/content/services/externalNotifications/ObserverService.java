package com.lorepo.icplayer.client.content.services.externalNotifications;

import java.util.HashMap;


public class ObserverService implements IObserverService {
    private final HashMap<String, IObserverList> observers;

    public ObserverService() {
        this.observers = new HashMap<String, IObserverList>();

        for (ObservableValue value : ObservableValue.values()) {
            IObserverList list = ObserverList.create();
            this.observers.put(value.getType(), list);
        }
    }

    public void addObserver(ObservableValue value, IObserver object) {
        addObserver(value.getType(), object);
    }

    public void notifySave() {
        this.notifyObservers(ObservableValue.SAVE);
    }

    public ObserverJSService getAsJS() {
        return ObserverJSService.create(this);
    }

    public void addObserver(String value, IObserver object) {
        IObserverList list = observers.get(value);
        list.addObserver(object);
    }

    private void notifyObservers(ObservableValue value) {
        IObserverList observers = this.observers.get(value.getType());
        observers.callObservers();
    }

}
