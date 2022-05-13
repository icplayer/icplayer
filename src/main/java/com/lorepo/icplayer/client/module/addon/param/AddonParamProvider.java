package com.lorepo.icplayer.client.module.addon.param;

import java.util.ArrayList;
import java.util.List;

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

	@Override
	public List<String> getNameProperties() {
		List<String> names = new ArrayList<String>();
		for(IAddonParam property : this.addonParams) {
			names.add(property.getName());
		}

		return names;
	}

	@Override
	public List<IProperty> getProperties() {
		List<IProperty> properties = new ArrayList<IProperty>();
		
		for(IAddonParam property : this.addonParams) {
			properties.add(property.getAsProperty());
		}

		return properties;
	}

	public void load(Element rootElement, String baseUrl) {
		AddonParamFactory paramFactory = new AddonParamFactory();
		NodeList optionNodes = rootElement.getChildNodes();
		for(int i = 0; i < optionNodes.getLength(); i++){
			if (optionNodes.item(i).getNodeName().compareTo("property") == 0) {
				Element element = (Element)optionNodes.item(i);
				String type = XMLUtils.getAttributeAsString(element, "type");
				IAddonParam addonParam = paramFactory.createAddonParam(null, type);
				
				addonParam.load(element, baseUrl);
				addonParams.add(addonParam);
			}
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
