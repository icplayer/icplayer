package com.lorepo.icplayer.client.utils;

import com.google.gwt.core.client.GWT;
import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestBuilder;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.RequestException;
import com.google.gwt.http.client.Response;
import com.lorepo.icplayer.client.xml.RequestFinishedCallback;

public class RequestsUtils {
	
	public static void get(String url, String requestData, RequestCallback callback) throws RequestException {
		RequestBuilder request = new RequestBuilder(RequestBuilder.GET, url);
		
		request.sendRequest(requestData, callback);
	}
	
	public static void get(String url, final RequestFinishedCallback requestFinishedCallback) throws RequestException {
		final String fetchURL = getResolvedUrl(url);
		RequestsUtils.get(fetchURL, null, new RequestCallback() {
			@Override
			public void onResponseReceived(Request request, Response response) {
				requestFinishedCallback.onResponseReceived(fetchURL, request, response);
			}

			@Override
			public void onError(Request request, Throwable exception) {
				requestFinishedCallback.onError(request, exception);
			}
		});
	}
	
	public static String getResolvedUrl(String url) {
		if( url.contains("://") || url.startsWith("/") ){
			return url;
		}
		else{
			return GWT.getHostPageBaseURL() + url;
		}
	}
}
