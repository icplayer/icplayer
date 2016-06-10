package com.lorepo.icplayer.client;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;

import com.google.gwt.core.client.GWT;
import com.lorepo.icf.utils.ILoadListener;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icf.utils.URLUtils;
import com.lorepo.icf.utils.XMLLoader;
import com.lorepo.icf.utils.dom.DOMInjector;
import com.lorepo.icplayer.client.model.AddonDescriptor;
import com.lorepo.icplayer.client.model.AddonDescriptorFactory;
import com.lorepo.icplayer.client.model.Page;
import com.lorepo.icplayer.client.xml.IProducingLoadingListener;
import com.lorepo.icplayer.client.xml.page.PageFactory;


/**
 * Załaduj dane contentu i wyślij sygnał gdy wszystkie będą załadowane
 * Jeżeli nie ma żadnych addonów do pobrania to sygnał wysyłany jest natychmiast.
 */
public class ContentDataLoader {

	private String baseUrl;
	private ILoadListener listener;
	private int count;
	private Collection<AddonDescriptor> descriptors;
	private List<Page> pages = new ArrayList<Page>();
	private List<String> libs = new ArrayList<String>();
	private AddonDescriptorFactory localAddons;
	
	public ContentDataLoader(String baseUrl) {
		this.baseUrl = baseUrl;
		localAddons = AddonDescriptorFactory.getInstance();
	}

	public void addPage(Page page) {
		pages.add(page);
	}
	
	public void addAddons(Collection<AddonDescriptor> descriptors) {
		this.descriptors = descriptors;
	}

	public void load(ILoadListener listener) {
		this.listener = listener;
		
		if (descriptors.size() > 0 || pages.size() > 0) {
			count = descriptors.size() + pages.size();
			
			Iterator<AddonDescriptor> iterator = descriptors.iterator();
			while (iterator.hasNext()) {
				loadDescriptor(iterator.next());
			}

			for (Page page : pages) {
				loadPage(page);
			}
		} else {
			if (listener != null) {
				listener.onFinishedLoading(this);
			}
		}
	}

	private void loadDescriptor(final AddonDescriptor descriptor) {
		String url;
		if (localAddons.isLocalAddon(descriptor.getAddonId())) {
			url = URLUtils.resolveURL(GWT.getModuleBaseURL() + "addons/", descriptor.getAddonId() + ".xml");
		} else {
			url = URLUtils.resolveURL(baseUrl, descriptor.getHref());
		}
		
		XMLLoader loader = new XMLLoader(descriptor);
		loader.load(url, new ILoadListener() {
			@Override
			public void onFinishedLoading(Object obj) {
				DOMInjector.injectJavaScript(descriptor.getCode());
				resourceLoaded();
			}
			
			@Override
			public void onError(String error) {
				JavaScriptUtils.log("Error loading addon: " + descriptor.getAddonId());
				resourceLoaded();
			}
		});
	}
	
	protected void addLibrary(String libName) {
		libName = libName.toLowerCase();
		for (String lib : libs) {
			if (lib.compareTo(libName) == 0) {
				return;
			}
		}
		
		libs.add(libName);
	}

	private void loadPage(Page page) {
		String url = URLUtils.resolveURL(baseUrl, page.getHref());
		
		PageFactory factory = new PageFactory((Page) page);
		factory.load(url, new IProducingLoadingListener() {
			@Override
			public void onFinishedLoading(Object producedItem) {
				resourceLoaded();
			}
			
			@Override
			public void onError(String error) {
				JavaScriptUtils.log("Error loading page: " + error);
			}
		});
	}
	
	private void addCSSFromAddons() {

		String css = "";
		Iterator<AddonDescriptor> iterator = descriptors.iterator();
		while (iterator.hasNext()) {
			css += iterator.next().getCSS();
		}

		css = css.trim();
		css = css.replace("url(\'resources/", 
				"url(\'" + GWT.getModuleBaseForStaticFiles() + "addons/resources/");
		css = css.replace("url(\"resources/", 
				"url(\"" + GWT.getModuleBaseForStaticFiles() + "addons/resources/");
		if (!css.isEmpty()) {
			DOMInjector.injectStyleAtStart(css);
		}
	}
	
	private native void includeJavaScript(ContentDataLoader x, String url) /*-{
	  
		// allow user to set any option except for dataType, cache, and url
		options = $wnd.jQuery.extend({}, {
		    dataType: "script",
		    cache: true,
		    url: url
		});
		
		
	  	$wnd.jQuery.ajax(options).done(function(script, status) {
			console.log("Loaded lib: " + url);
			x.@com.lorepo.icplayer.client.ContentDataLoader::loadLib()();
		});
	}-*/; 
	
	
	private void resourceLoaded() {
		count--;
		if (count == 0) {
			addCSSFromAddons();
			loadLib();
		}
	}

	
	private void loadLib() {

		if(libs.size() > 0){
			String libName = libs.remove(0);
			String url = GWT.getModuleBaseURL() + "libs/" + libName;
			includeJavaScript(this,url);
		}
		else if(listener != null){
			listener.onFinishedLoading(this);
		}
	}
}
