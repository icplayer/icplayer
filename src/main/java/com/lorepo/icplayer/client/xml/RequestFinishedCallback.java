package com.lorepo.icplayer.client.xml;

import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.Response;

public interface RequestFinishedCallback {
	public void onResponseReceived(String fetchURL, Request request, Response response);
	public void onError(Request request, Throwable exception);
}
