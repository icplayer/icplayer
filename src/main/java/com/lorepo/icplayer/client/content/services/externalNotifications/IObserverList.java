package com.lorepo.icplayer.client.content.services.externalNotifications;

public interface IObserverList {
    // We could use http://www.gwtproject.org/doc/latest/DevGuideCodingBasicsJsInterop.html, but this requires gwt 2.7.0
    void addObserver(IObserver observer);
    void callObservers();
}
