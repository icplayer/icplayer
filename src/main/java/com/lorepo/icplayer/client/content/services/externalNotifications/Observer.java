package com.lorepo.icplayer.client.content.services.externalNotifications;

import com.google.gwt.core.client.JavaScriptObject;

/**
 * JavaScript object which contains "next" function.
 */
public class Observer extends JavaScriptObject implements IObserver {
    protected Observer() { }

    public final native void next() /*-{
        $entry(
            this.next()
        );
    }-*/;

}
