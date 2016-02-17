package com.lorepo.icplayer.client.utils;

import com.google.gwt.core.client.GWT;
import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestBuilder;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.RequestException;

public class RequestsUtils {
	
	public static void get(String url, String requestData, RequestCallback callback) throws RequestException {
		RequestBuilder request = new RequestBuilder(RequestBuilder.GET, getResolvedUrl(url));
		
		request.sendRequest(requestData, callback);
	}
	
	public static void get(String url, RequestCallback callback) throws RequestException {
		RequestsUtils.get(url, null, callback);
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
