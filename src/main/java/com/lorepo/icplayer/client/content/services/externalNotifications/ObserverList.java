package com.lorepo.icplayer.client.content.services.externalNotifications;

import com.google.gwt.core.client.JsArray;

/**
 * JSNI overlay type for JS list of callbacks.
 */
public class ObserverList extends JsArray<Observer> implements IObserverList {
    protected ObserverList() { }

    public final native void addObserver(IObserver observer) /*-{
        this.push(observer);
    }-*/;

    public final void callObservers() {
        for (int i = 0; i < length(); i++) {
            IObserver obs = get(i);
            obs.next();
        }
    }

    static native IObserverList create() /*-{
        return [];
    }-*/;
}
