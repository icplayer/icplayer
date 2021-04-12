package com.lorepo.icplayer.client.content.services.externalNotifications;

import com.google.gwt.core.client.JavaScriptObject;

public class ObserverJSService extends JavaScriptObject {
    protected ObserverJSService() { }

    public static native ObserverJSService create(IObserverService s) /*-{
        var obj = function() {};
        obj.addObserver = function(type, obj) {
            return s.@com.lorepo.icplayer.client.content.services.externalNotifications.IObserverService::addObserver(Ljava/lang/String;Lcom/lorepo/icplayer/client/content/services/externalNotifications/IObserver;)(type, obj);
        };

        obj.notifySave = function() {
            return s.@com.lorepo.icplayer.client.content.services.externalNotifications.IObserverService::notifySave()();
        }

        return obj;
    }-*/;

    public final native void addObserver(String type, JavaScriptObject observer) /*-{
        return this.addObserver(type, observer);
    }-*/;

    public final native void notifySave() /*-{
        return this.notifySave();
    }-*/;
}
