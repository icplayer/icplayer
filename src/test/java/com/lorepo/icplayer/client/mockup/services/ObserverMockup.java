package com.lorepo.icplayer.client.mockup.services;

import com.lorepo.icplayer.client.content.services.externalNotifications.IObserver;

public class ObserverMockup implements IObserver {
    private int callCount = 0;

    @Override
    public void next() {
        this.callCount++;
    }

    public boolean wasCalled() {
        return callCount > 0;
    }

    public int getCallCount() {
        return callCount;
    }
}
