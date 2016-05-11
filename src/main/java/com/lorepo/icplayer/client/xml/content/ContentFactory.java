package com.lorepo.icplayer.client.xml.content;

import java.util.ArrayList;
import java.util.HashMap;

import com.google.gwt.xml.client.Element;
import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.RequestException;
import com.google.gwt.http.client.Response;
import com.google.gwt.xml.client.XMLParser;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.utils.RequestsUtils;
import com.lorepo.icplayer.client.xml.content.parsers.ContentParser_v0;
import com.lorepo.icplayer.client.xml.content.parsers.ContentParser_v1;

public class ContentFactory implements IContentFactory {
	private HashMap<String, IContentParser> parsersMap = null;
	private static IContentFactory instance = null;
	
	private ContentFactory() {
		this.parsersMap = new HashMap<String, IContentParser>();
		
		this.addParser(new ContentParser_v0());
		this.addParser(new ContentParser_v1());
	}
	
	private void addParser(IContentParser parser) {
		JavaScriptUtils.log("=======================");
		JavaScriptUtils.log(parser.getVersion());
		JavaScriptUtils.log("=======================");
		this.parsersMap.put(parser.getVersion(), parser);
	}

	public static IContentFactory getInstance() {
		if (ContentFactory.instance == null) {
			ContentFactory.instance = new ContentFactory();
		}
		
		return instance;
	}
	
	@Override
	public void load(String fetchUrl, ArrayList<Integer> pagesSubset, IContentLoadingListener listener) {
		try {
			RequestsUtils.get(fetchUrl, this.getContentLoadCallback(listener, pagesSubset, fetchUrl));
		} catch (RequestException e) {
			JavaScriptUtils.log("Fetching main data content from server has failed: " + e.toString());
		}
	}

	private RequestCallback getContentLoadCallback(final IContentLoadingListener listener, final ArrayList<Integer> pagesSubset, String fetchUrl) {
		final String url = fetchUrl;
		
		return new RequestCallback() {
			@Override
			public void onResponseReceived(Request request, Response response) {
				if (response.getStatusCode() == 200 || response.getStatusCode() == 0) {
					Content content = produce(response.getText(), pagesSubset, url);
					listener.onFinishedLoading(content);
				} else {
					// Handle the error.  Can get the status text from response.getStatusText()
					listener.onError("Wrong status: " + response.getText());
				}

			}

			@Override
			public void onError(Request request, Throwable exception) {
				listener.onFinishedLoading(null);
			}
		};
	}

	protected Content produce(String xmlString, ArrayList<Integer> pagesSubset, String fetchUrl) {
		Element xml = XMLParser.parse(xmlString).getDocumentElement();
		String version = XMLUtils.getAttributeAsString(xml, "version", "1");
		
		JavaScriptUtils.log("=============================================");
		JavaScriptUtils.log("W produce");
		JavaScriptUtils.log(version);
		JavaScriptUtils.log(this.parsersMap);
		JavaScriptUtils.log(this.parsersMap.get(version));
		JavaScriptUtils.log("=============================================");
		
		Content producedContent = this.parsersMap.get(version).parse(xml,  pagesSubset);
		producedContent.setBaseUrl(fetchUrl);
		
		return producedContent;
	}

	@Override
	public String dumps(Content content) {
		// TODO Auto-generated method stub
		return null;
	}
}
