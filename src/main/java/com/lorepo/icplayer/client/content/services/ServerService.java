package com.lorepo.icplayer.client.content.services;

import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestBuilder;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.RequestException;
import com.google.gwt.http.client.Response;
import com.google.gwt.http.client.URL;
import com.lorepo.icplayer.client.module.api.player.IServerService;

public class ServerService implements IServerService {

	private String	apiUrl;
	private String	analyticsUrl;
	
	/**
	 * Constructor
	 */
	public ServerService(String apiUrl){

		this.apiUrl = apiUrl;
	}
	
	
	@Override
	public String getServerApiUrl() {
		return apiUrl;
	}


	public void setAnalyticsUrl(String url) {

		analyticsUrl = url;
	}


	@Override
	public void sendAnalytics(int pageIndex) {

		if(analyticsUrl == null){
			return;
		}

		String url = analyticsUrl + "page=" + pageIndex;
		RequestBuilder builder = new RequestBuilder(RequestBuilder.GET, URL.encode(url));

		try {
			builder.sendRequest(null, new RequestCallback() {
				public void onError(Request request, Throwable exception) {
				}
				public void onResponseReceived(Request request, Response response){
				}
			});
		  
		} catch (RequestException e) {
		}
	}


	private native void trackGoogleAnalytics(String historyToken) /*-{
    
	  try {
	        var pageTracker = $wnd._gat._getTracker("UA-22106147-2");
	        pageTracker._setRemoteServerMode();
	        pageTracker._setAllowAnchor(true)
	        pageTracker._trackPageview(historyToken);
	            
	  } catch(err) {
	  }

	}-*/;


}
