package com.lorepo.icplayer.client.addonsLoader;

import com.lorepo.icf.utils.URLUtils;
import com.lorepo.icplayer.client.addonsLoader.IAddonLoader;
import com.lorepo.icplayer.client.addonsLoader.LocalAddonsLoader;
import com.lorepo.icplayer.client.addonsLoader.PrivateAddonLoader;
import com.lorepo.icplayer.client.model.addon.AddonDescriptor;
import com.lorepo.icplayer.client.model.addon.AddonDescriptorFactory;

public class AddonLoaderFactory {
	private AddonDescriptorFactory localAddons;
	private String baseUrl;
	private String contentBaseURL;

	public AddonLoaderFactory(String baseUrl, String contentBaseURL) {
		this.baseUrl = baseUrl;
		this.contentBaseURL = contentBaseURL;
		this.localAddons = AddonDescriptorFactory.getInstance();
	}
	
	public AddonLoaderFactory(String baseUrl) {
		this.baseUrl = baseUrl;
		this.localAddons = AddonDescriptorFactory.getInstance();
	}

	public IAddonLoader getAddonLoader(final AddonDescriptor descriptor) {
		IAddonLoader loader;
		if(localAddons.isLocalAddon(descriptor.getAddonId())) {
			LocalAddonsLoader localLoader = LocalAddonsLoader.getInstance();
			localLoader.setAddonDescriptor(descriptor);
			loader = localLoader;
		} else {
			String url = URLUtils.resolveURL(this.baseUrl, descriptor.getHref(), this.contentBaseURL);
			loader = new PrivateAddonLoader(descriptor, url);
		}

		return loader;
	}
}
