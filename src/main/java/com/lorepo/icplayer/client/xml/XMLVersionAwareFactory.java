package com.lorepo.icplayer.client.xml;

import java.util.HashMap;

import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.RequestException;
import com.google.gwt.http.client.Response;
import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.XMLParser;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.utils.RequestsUtils;

public abstract class XMLVersionAwareFactory implements IXMLFactory {

	protected HashMap<String, IParser> parsersMap = new HashMap<String, IParser>();
	
	protected void addParser(IParser parser) {
		this.parsersMap.put(parser.getVersion(), parser);
	}
	
	
	@Override
	public void load(String fetchUrl, IProducingLoadingListener listener) {
		try {
			RequestsUtils.get(fetchUrl, this.getContentLoadCallback(listener));
		} catch (RequestException e) {
			JavaScriptUtils.log("Fetching main data content from server has failed: " + e.toString());
		}
	}

	protected RequestFinishedCallback getContentLoadCallback(final IProducingLoadingListener listener) {
		return new RequestFinishedCallback() {

			@Override
			public void onResponseReceived(String fetchURL, Request request,
					Response response) {
				if (response.getStatusCode() == 200 || response.getStatusCode() == 0) {
				Object producedItem = produce(response.getText(), fetchURL);
				listener.onFinishedLoading(producedItem);
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

	public Object produce(String xmlString, String fetchUrl) {
		Element xml = XMLParser.parse(xmlString).getDocumentElement();
		String version = XMLUtils.getAttributeAsString(xml, "version", "1");
		Object producedContent = this.parsersMap.get(version).parse(xml);
		
		return producedContent;
	}
}
