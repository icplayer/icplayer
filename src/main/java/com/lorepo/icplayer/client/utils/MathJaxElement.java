package com.lorepo.icplayer.client.utils;

public interface MathJaxElement {
	void mathJaxLoaded();
	void mathJaxIsLoadedCallback();
	void refreshMath();
	void removeHook();
	String getElementId();
}
