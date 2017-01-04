package com.lorepo.icplayer.client.addonsLoader;

import com.lorepo.icf.utils.ILoadListener;
import com.lorepo.icplayer.client.model.addon.AddonDescriptor;

public class WaitingDescriptor {
	
	public WaitingDescriptor(AddonDescriptor descriptor, ILoadListener listener) {
		this.descriptor = descriptor;
		this.listener = listener;
	}
	
	public AddonDescriptor descriptor;
	public ILoadListener listener;
}
