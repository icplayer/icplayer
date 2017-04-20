package com.lorepo.icplayer.client.module.api.player;

import com.google.gwt.core.client.JavaScriptObject;
import com.lorepo.icf.utils.IXMLSerializable;


public interface IContentNode extends IXMLSerializable{
	public String getName();
	public String getId();
	public JavaScriptObject toJavaScript();
}
