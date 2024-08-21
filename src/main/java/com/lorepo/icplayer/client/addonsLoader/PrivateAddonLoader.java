package com.lorepo.icplayer.client.addonsLoader;

import com.lorepo.icf.utils.ILoadListener;
import com.lorepo.icf.utils.IXMLSerializable;
import com.lorepo.icf.utils.XMLLoader;

public class PrivateAddonLoader extends XMLLoader implements IAddonLoader{
	
	private String url;
	private String xml;

	public PrivateAddonLoader(IXMLSerializable model, String url) {
		super(model);
		this.url = url;
	}
	
	public void load(ILoadListener listener) {
		this.load(this.url, listener);
	}

	public String getXML() {
	    return xml;
	}
	
	@Override
	protected void successCallback(String xmlString, String resolvedURL) {
		this.xml = xmlString;
		super.successCallback(xmlString, resolvedURL);
	}
}
