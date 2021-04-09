package com.lorepo.icplayer.client.content.services.externalNotifications;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArray;

/**
 * JSNI overlay type for JS list of callbacks.
 */
public class ObserverList extends JsArray<JavaScriptObject> implements IObserverList {
    protected ObserverList() { }

    public final native void addObserver(JavaScriptObject func) /*-{
        this.push(func);
    }-*/;

    public final native void callObservers() /*-{
        for (var i = 0; i < this.length; i++) {
            this[i]();
        }
    }-*/;

    static native ObserverList create() /*-{
        return [];
    }-*/;
}
