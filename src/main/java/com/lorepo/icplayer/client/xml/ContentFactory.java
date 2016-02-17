package com.lorepo.icplayer.client.xml;

import java.util.ArrayList;

import com.google.gwt.xml.client.Element;
import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.RequestException;
import com.google.gwt.http.client.Response;
import com.google.gwt.xml.client.XMLParser;
import com.lorepo.icf.utils.ILoadListener;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.utils.RequestsUtils;

public class ContentFactory implements IContentFactory {
	
	private ArrayList<IContentParser> parsersList = null;
	private static IContentFactory instance = null;
	
	private ContentFactory() {
		this.parsersList = new ArrayList<IContentParser>();
		
		this.parsersList.add(new ContentParserZero());
	}

	public static IContentFactory getInstance() {
		if (ContentFactory.instance == null) {
			ContentFactory.instance = new ContentFactory();
		}
		
		return instance;
	}
	
	@Override
	public void load(String fetchUrl, ArrayList<Integer> pagesSubset, ILoadListener listener) {
		this.pagesSubset = pagesSubset;
		try {
			RequestsUtils.get(fetchUrl, this.getContentLoadCallback(listener, pagesSubset));
		} catch (RequestException e) {
			JavaScriptUtils.log("Fetching main data content from server has failed: " + e.toString());
		}
	}

	private RequestCallback getContentLoadCallback(final ILoadListener listener, final Array<Integer> pagesSubset) {
		return new RequestCallback() {

			@Override
			public void onResponseReceived(Request request, Response response) {
				if (response.getStatusCode() == 200 || response.getStatusCode() == 0) {
					Content content = produce(response.getText(), pagesSubset);
					listener.onFinishedLoading(null);
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

	protected Content produce(String xmlString, ArrayList<Integer> pagesSubset) {
		Element xml = XMLParser.parse(xmlString).getDocumentElement();
		Integer version = XMLUtils.getAttributeAsInt(xml, "version");
		
		return this.parsersList.get(version).parse(xml, pagesSubset);
	}

	@Override
	public String dumps(Content content) {
		// TODO Auto-generated method stub
		return null;
	}
}
