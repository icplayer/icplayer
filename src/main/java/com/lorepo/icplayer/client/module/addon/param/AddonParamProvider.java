package com.lorepo.icplayer.client.module.addon.param;

import java.util.ArrayList;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.IPropertyListener;
import com.lorepo.icf.properties.IPropertyProvider;
import com.lorepo.icf.utils.XMLUtils;

public class AddonParamProvider implements IPropertyProvider{

	private ArrayList<IAddonParam>	addonParams = new ArrayList<IAddonParam>();

	
	public AddonParamProvider() {
	}
	
	@Override
	public String getProviderName() {
		return "Item";
	}

	@Override
	public void addPropertyListener(IPropertyListener listener) {
	}

	@Override
	public void removePropertyListener(IPropertyListener listener) {
	}

	@Override
	public int getPropertyCount() {
		return addonParams.size();
	}

	@Override
	public IProperty getProperty(int index) {
		return addonParams.get(index).getAsProperty();
	}

	public void load(Element rootElement) {
		AddonParamFactory paramFactory = new AddonParamFactory();
		NodeList optionNodes = rootElement.getElementsByTagName("property");
		for(int i = 0; i < optionNodes.getLength(); i++){

			Element element = (Element)optionNodes.item(i);
			String type = XMLUtils.getAttributeAsString(element, "type");
			IAddonParam addonParam = paramFactory.createAddonParam(null, type);
			
			addonParam.load(element);
			addonParams.add(addonParam);
		}
	}


	public String toXML() {
		
		String xml;
		
		xml ="<item>";
		for(IAddonParam property: addonParams){
			xml += property.toXML();
		}
		xml +="</item>";
		
		return xml;
	}
	
	
	public void addParam(IAddonParam param){
		addonParams.add(param);
	}
}
