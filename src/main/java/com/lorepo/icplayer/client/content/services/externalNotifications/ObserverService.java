package com.lorepo.icplayer.client.content.services.externalNotifications;

import com.google.gwt.core.client.JavaScriptObject;
import java.util.HashMap;


public class ObserverService implements IObserverService {
    private final HashMap<String, ObserverList> observers;

    public ObserverService() {
        this.observers = new HashMap<String, ObserverList>();

        for (ObservableValue value : ObservableValue.values()) {
            this.observers.put(value.getType(), ObserverList.create());
        }
    }

    public void addObserver(ObservableValue value, JavaScriptObject object) {
        this.addObserver(value.getType(), object);
    }

    private void addObserver(String value, JavaScriptObject object) {
        ObserverList observers = this.observers.get(value);
        observers.addObserver(object);
    }

    private void notifyObservers(ObservableValue value) {
        ObserverList observers = this.observers.get(value.getType());
        observers.callObservers();
    }

    public void notifySave() {
        this.notifyObservers(ObservableValue.SAVE);
    }

    public static native JavaScriptObject getAsJS(IObserverService s) /*-{
        var commands = function() {};
        commands.addObserver = function(type, callback) {
            return s.@com.lorepo.icplayer.client.content.services.externalNotifications.ObserverService::addObserver(Ljava/lang/String;Lcom/google/gwt/core/client/JavaScriptObject;)(type, callback);
        };

        commands.notifySave = function() {
            return s.@com.lorepo.icplayer.client.content.services.externalNotifications.ObserverService::notifySave()();
        }

        return commands;
    }-*/;

}
