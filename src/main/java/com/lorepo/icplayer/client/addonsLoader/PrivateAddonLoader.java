package com.lorepo.icplayer.client.addonsLoader;

import com.lorepo.icf.utils.ILoadListener;
import com.lorepo.icf.utils.IXMLSerializable;
import com.lorepo.icf.utils.XMLLoader;

public class PrivateAddonLoader extends XMLLoader implements IAddonLoader{
	
	private String url;

	public PrivateAddonLoader(IXMLSerializable model, String url) {
		super(model);
		this.url = url;
	}
	
	public void load(ILoadListener listener) {
		this.load(this.url, listener);
	}
}
