package com.lorepo.icplayer.client;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;

import com.google.gwt.core.client.GWT;
import com.lorepo.icf.utils.ILoadListener;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icf.utils.URLUtils;
import com.lorepo.icf.utils.dom.DOMInjector;
import com.lorepo.icplayer.client.addonsLoader.AddonLoaderFactory;
import com.lorepo.icplayer.client.addonsLoader.IAddonLoader;
import com.lorepo.icplayer.client.model.Page;
import com.lorepo.icplayer.client.model.addon.AddonDescriptor;
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
	private AddonLoaderFactory addonsLoaderFactory;
	
	public ContentDataLoader(String baseUrl) {
		this.baseUrl = baseUrl;
		this.addonsLoaderFactory = new AddonLoaderFactory(baseUrl);
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
		IAddonLoader loader = addonsLoaderFactory.getAddonLoader(descriptor);
		loader.load(new ILoadListener() {
			@Override
			public void onFinishedLoading(Object obj) {
				DOMInjector.injectJavaScript(descriptor.getCode());
				resourceLoaded();
			}
			
			@Override
			public void onError(String error) {
				JavaScriptUtils.log("Error loading addon: " + descriptor.getAddonId());
				JavaScriptUtils.log("Error: " + error.toString());
				resourceLoaded();
			}
		});
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

	private void resourceLoaded() {
		count--;
		if (count == 0) {
			addCSSFromAddons();
			if(listener != null){
				listener.onFinishedLoading(this);
			}
		}
	}
}
