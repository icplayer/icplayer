package com.lorepo.icplayer.client.content.services.externalNotifications;

import com.google.gwt.core.client.JavaScriptObject;

public interface IObserverService {
    void addObserver(ObservableValue value, JavaScriptObject object);
    void notifySave();

    static JavaScriptObject getAsJS(IObserverService service) {
        return null;
    }
}
