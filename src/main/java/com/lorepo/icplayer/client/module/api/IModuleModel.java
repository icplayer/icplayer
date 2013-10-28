package com.lorepo.icplayer.client.module.api;

import com.google.gwt.xml.client.Element;
import com.lorepo.icf.properties.IPropertyProvider;
import com.lorepo.icplayer.client.framework.module.IStyledModule;

/**
 * Interface implementowany przez każdy moduł umieszczany na stronie
 * @author Krzysztof Langner
 *
 */
public interface IModuleModel extends IStyledModule, IRectangleItem, IPropertyProvider{
	public String 	getModuleTypeName();
	public String	getId();
	public void setId(String id);
	public void release();
	public void load(Element node, String baseUrl);
	public String toXML();
	public void addNameValidator(INameValidator validator);
	public boolean isLocked();
	public void lock(boolean state);
}
