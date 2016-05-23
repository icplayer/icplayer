package com.lorepo.icplayer.client.xml.content;

import java.util.ArrayList;

import com.google.gwt.xml.client.Element;
import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.Response;
import com.google.gwt.xml.client.XMLParser;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.xml.IProducingLoadingListener;
import com.lorepo.icplayer.client.xml.IXMLFactory;
import com.lorepo.icplayer.client.xml.XMLVersionAwareFactory;
import com.lorepo.icplayer.client.xml.content.parsers.ContentParser_v0;
import com.lorepo.icplayer.client.xml.content.parsers.ContentParser_v1;
import com.lorepo.icplayer.client.xml.content.parsers.IContentParser;

public class ContentFactory extends XMLVersionAwareFactory {
	private ArrayList<Integer> pagesSubset;
	
	private ContentFactory() {
		this.addParser(new ContentParser_v0());
		this.addParser(new ContentParser_v1());
	}
	
	public void setPagesSubset(ArrayList<Integer> pagesSubset) {
		this.pagesSubset = pagesSubset;
	}
	
	private void addParser(IContentParser parser) {
		parser.setPagesSubset(this.pagesSubset);
		super.addParser(parser);
	}

	public static IXMLFactory getInstance(ArrayList<Integer> pagesSubset) {
		ContentFactory factory = new ContentFactory();
		factory.setPagesSubset(pagesSubset);
		
		return factory;
	}
	
	@Override
	protected RequestCallback getContentLoadCallback(final IProducingLoadingListener listener, String fetchUrl) {
		return this.getContentLoadCallback(listener, this.pagesSubset, fetchUrl);
	}
	
	private RequestCallback getContentLoadCallback(final IProducingLoadingListener listener, final ArrayList<Integer> pagesSubset, String fetchUrl) {
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
		
		Content producedContent = (Content) this.parsersMap.get(version).parse(xml);
		producedContent.setBaseUrl(fetchUrl);
		
		return producedContent;
	}
}
