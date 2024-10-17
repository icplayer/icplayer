package com.lorepo.icplayer.client.addonsLoader;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;

import com.google.gwt.core.client.GWT;
import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.RequestException;
import com.google.gwt.http.client.Response;
import com.google.gwt.xml.client.Document;
import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.NodeList;
import com.google.gwt.xml.client.XMLParser;
import com.lorepo.icf.utils.ExtendedRequestBuilder;
import com.lorepo.icf.utils.ILoadListener;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icf.utils.URLUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.model.addon.AddonDescriptor;

public class LocalAddonsLoader implements IAddonLoader {
	private static LocalAddonsLoader instance;
	
	public static LocalAddonsLoader  getInstance() {
		if (LocalAddonsLoader.instance == null) {
			instance = new LocalAddonsLoader();
		}
		
		return instance;
	}
	
	private final String ADDONS_DISTRIBUTION_XML = "addons.min.xml";
	private boolean requestToLoadAddonsXMLSent = false;
	private boolean addonsXMLFetched = false;
	private boolean firstAddonRequestSent = false;
	private boolean firstAddonXMLFetched = false;
	private AddonDescriptor currentAddonDescriptor;
	private HashMap<String, Element> addonsXMLs = new HashMap<String, Element>();
	private String addonsXMLFetchURL = URLUtils.resolveURL(GWT.getModuleBaseURL() + "build/dist/", ADDONS_DISTRIBUTION_XML);
	private List<WaitingDescriptor> queue = new LinkedList<WaitingDescriptor>();
	private String errorString;

	public LocalAddonsLoader() {}

	@Override
	public void load(ILoadListener callbacks) {
		if (this.firstAddonRequestSent) {
			if (this.firstAddonXMLFetched) {
				if (this.requestToLoadAddonsXMLSent) {
					if (this.addonsXMLFetched) {
						this.flushAddon(this.currentAddonDescriptor, callbacks);
					} else {
						this.addToWaitingQue(this.currentAddonDescriptor, callbacks);
					}
				} else {
					this.loadSingleAddon(this.currentAddonDescriptor, callbacks);
				}
			} else {
				this.addToWaitingQue(this.currentAddonDescriptor, callbacks);
			}
		} else {
			this.loadFirstAddon(this.currentAddonDescriptor, callbacks);
		}
	}
	
	private void loadAddonsXML(ILoadListener callbacks) {
		try {
			this.addToWaitingQue(this.currentAddonDescriptor, callbacks);
			this.sendRequestToLoadAddonsXML(this.addonsXMLFetchURL);
			this.requestToLoadAddonsXMLSent = true;
		} catch (RequestException e) {
			errorString = "Request failure in LocalAddonsLoader: " + e.toString();
			JavaScriptUtils.log(errorString);
			this.flushErrorHandlers();
		} catch (Exception e) {
			errorString = "Local addons error: " + e.getMessage();
			JavaScriptUtils.log(errorString);
			this.flushErrorHandlers();
		}
	}
	
	public void setAddonDescriptor(AddonDescriptor descriptor) {
		this.currentAddonDescriptor = descriptor;
	}

	public void setFetchUrl(String addonsXMLFetchURL) {
		this.addonsXMLFetchURL = addonsXMLFetchURL;
	};
	
	private void sendRequestToLoadAddonsXML(String url) throws RequestException {
		final String resolvedURL = this.getResolvedURL(url);
		ExtendedRequestBuilder builder = new ExtendedRequestBuilder(ExtendedRequestBuilder.GET, resolvedURL);
		builder.sendRequest(null, new RequestCallback() {
			public void onError(Request request, Throwable exception) {
				// Couldn't connect to server (could be timeout, SOP violation, etc.)   
				JavaScriptUtils.log("Error" + exception.toString());
			}

			public void onResponseReceived(Request request, Response response){
				// StatusCode == 0 when loading from local file
				addonsXMLResponseHandler(response);
			}
		});
	}
	
	private void addonsXMLResponseHandler(Response response) {
		if (response.getStatusCode() == 200 || response.getStatusCode() == 0) {
			this.parseAddonsXML(response.getText());
			this.flushWaitingAddons();
			this.addonsXMLFetched = true;
		} else {
			// Handle the error.  Can get the status text from response.getStatusText()
			JavaScriptUtils.log("Wrong status: " + response.getText());
		}
	}
	
	private void flushWaitingAddons() {
		for(WaitingDescriptor descriptor : this.queue){
			this.flushAddon(descriptor.descriptor, descriptor.listener);
		}	
		this.queue.clear();
	}
	
	private void flushAddon(final AddonDescriptor descriptor, final ILoadListener callbacks) {
		Element xml = this.addonsXMLs.get(descriptor.getAddonId());
		descriptor.load(xml, null);
		callbacks.onFinishedLoading(descriptor);
	}
	
	private void addToWaitingQue(AddonDescriptor descriptor, ILoadListener callbacks) {
		this.queue.add(new WaitingDescriptor(descriptor, callbacks));
	}

	private void parseAddonsXML(String text) {
		Document dom = XMLParser.parse(text);
		NodeList addonsNodes = dom.getDocumentElement().getElementsByTagName("addon");
		for(int i = 0; i < addonsNodes.getLength(); i++){
			Element addonXML = (Element) addonsNodes.item(i);
			String addonID = XMLUtils.getAttributeAsString(addonXML, "id");
			this.addonsXMLs.put(addonID, addonXML);
		}
	}
	
	private void parseAddonXML(String text) {
		Document dom = XMLParser.parse(text);
		Element addonXML = dom.getDocumentElement();
		String addonID = XMLUtils.getAttributeAsString(addonXML, "id");
		if (addonID != null) {
			this.addonsXMLs.put(addonID, addonXML);
		}
	}

	private String getResolvedURL(String url) {
		String resolvedURL;
		
		if( url.contains("://") || url.startsWith("/") ){
			resolvedURL = url;
		}
		else{
			resolvedURL = GWT.getHostPageBaseURL() + url;
		}
		
		return resolvedURL;
	}
	
	private void flushErrorHandlers() {
		for(WaitingDescriptor descriptor : this.queue){
			descriptor.listener.onError(errorString);
		}	
		this.queue.clear();
	}

	private String getLocalAddonURL(String addonID) {
		return URLUtils.resolveURL(GWT.getModuleBaseURL() + "addons/",addonID+".xml");
	}

	private void loadSingleAddon(AddonDescriptor descriptor, ILoadListener callbacks) {
		if (addonsXMLs.containsKey(descriptor.getAddonId())) {
			this.flushAddon(descriptor, callbacks);
		} else {
			String fetchURL = getLocalAddonURL(descriptor.getAddonId());
			final LocalAddonsLoader self = this;
			final ILoadListener finalCallbacks = callbacks;
			final PrivateAddonLoader addonLoader = new PrivateAddonLoader(descriptor, fetchURL);
			ILoadListener addonListener = new ILoadListener() {
				@Override
				public void onFinishedLoading(Object obj) {
					String addonXML = addonLoader.getXML();
					if (addonXML != null) {
						self.parseAddonXML(addonXML);
					}
					finalCallbacks.onFinishedLoading(obj);
				}
				
				@Override
				public void onError(String error) {
					finalCallbacks.onError(error);
				}
			};
			addonLoader.load(addonListener);
		}
	}

	private void loadFirstAddon(AddonDescriptor descriptor, ILoadListener callbacks) {
		this.firstAddonRequestSent = true;
		final LocalAddonsLoader self = this;
		final ILoadListener finalCallbacks = callbacks;
		final AddonDescriptor finalDescriptor = descriptor;
		ILoadListener firstListener = new ILoadListener() {
			@Override
			public void onFinishedLoading(Object obj) {
				self.firstAddonXMLFetched = true;
				self.loadWaitingAddons();
				finalCallbacks.onFinishedLoading(obj);
			}

			@Override
			public void onError(String error) {
				JavaScriptUtils.log("Error loading addon: " + finalDescriptor.getAddonId());
				JavaScriptUtils.log("Fallback: attempt to load addons.min.xml");
				self.firstAddonXMLFetched = true;
				self.currentAddonDescriptor = finalDescriptor;
				self.loadAddonsXML(finalCallbacks);
			}
		};
		this.loadSingleAddon(descriptor, firstListener);
	}

	private void loadWaitingAddons() {
		for (WaitingDescriptor descriptor : this.queue){
			this.loadSingleAddon(descriptor.descriptor, descriptor.listener);
		}
		this.queue.clear();
	}
}
