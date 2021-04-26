package com.lorepo_patchers.icplayer.client.content.services.externalNotifications;

import com.googlecode.gwt.test.patchers.PatchClass;
import com.googlecode.gwt.test.patchers.PatchMethod;
import com.lorepo.icplayer.client.content.services.externalNotifications.IObserver;
import com.lorepo.icplayer.client.content.services.externalNotifications.IObserverList;
import com.lorepo.icplayer.client.content.services.externalNotifications.ObserverList;

import java.util.ArrayList;

@PatchClass(ObserverList.class)
public class ObserverListPatcher {
    private static final IObserverList mockup = new ObserverListMockup();

    private static class ObserverListMockup implements IObserverList {
        private final ArrayList<IObserver> observers = new ArrayList<IObserver>();

        @Override
        public void addObserver(IObserver observer) {
            observers.add(observer);
        }

        @Override
        public void callObservers() {
            for (IObserver obs : observers) {
                obs.next();
            }
        }
    }

    @PatchMethod
    public static void addObserver(IObserver observer) {
        mockup.addObserver(observer);
    }

    @PatchMethod
    public static void callObservers() {
        mockup.callObservers();
    }

    @PatchMethod
    public static IObserverList create() {
        return mockup;
    }
}
