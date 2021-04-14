package com.lorepo.icplayer.client.module.skiplink;

import com.google.gwt.core.client.JavaScriptObject;

public class JSSkipLinkPresenter extends JavaScriptObject {
    protected JSSkipLinkPresenter() { }

    public static native JSSkipLinkPresenter create(ISkipLinkPresenter presenter) /*-{
        var object = function() {};

        return object;
    }-*/;

}
