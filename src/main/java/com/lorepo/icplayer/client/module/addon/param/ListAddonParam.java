package com.lorepo.icplayer.client.module.addon.param;

import java.util.ArrayList;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.IListProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.IPropertyProvider;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.model.AddonProperty;
import com.lorepo.icplayer.client.module.addon.AddonModel;

public class ListAddonParam extends StringAddonParam{

	private AddonParamFactory factory;
	private ArrayList<AddonParamProvider>	propertyProviders = new ArrayList<AddonParamProvider>();
	private ArrayList<IAddonParam>	template = new ArrayList<IAddonParam>();
	private String baseUrl;
	
	
	public ListAddonParam(AddonModel parent, String type, AddonParamFactory factory) {
		super(parent, type);
		this.factory = factory;
	}


	@Override
	public String toXML(){
		
		String xml;
		
		xml = "<property";
		xml += " name='" + StringUtils.escapeXML(name) + "'";
		xml += " type='" + StringUtils.escapeXML(type) + "'";
		xml += ">";
		
		xml += templateToXML();
		xml += temsToXML();
		
		xml += "</property>";
		return xml;
	}


	private String templateToXML() {
		
		String xml = "<template>";
		for(IAddonParam param : template){
			
			xml += param.toXML();
		}
		xml += "</template>";
		
		return xml;
	}


	private String temsToXML() {
		
		String xml = "<items>";
		for(AddonParamProvider provider : propertyProviders){
			
			xml += provider.toXML();
		}
		xml += "</items>";
		return xml;
	}


	@Override
	public void load(Element rootElement, String baseUrl) {
		
		this.baseUrl = baseUrl;
		propertyProviders.clear();
		name = XMLUtils.getAttributeAsString(rootElement, "name");
		type = XMLUtils.getAttributeAsString(rootElement, "type");

		loadTemplate(rootElement);
		loadItems(rootElement);
	}


	private void loadTemplate(Element rootElement) {
		
		NodeList templateNodes = rootElement.getElementsByTagName("template");
		if(templateNodes.getLength() > 0){
			NodeList optionNodes = templateNodes.item(0).getChildNodes();
			for(int i = 0; i < optionNodes.getLength(); i++){

				if(optionNodes.item(i) instanceof Element){
					Element element = (Element)optionNodes.item(i);
					String type = XMLUtils.getAttributeAsString(element, "type");
					IAddonParam addonParam = factory.createAddonParam(null, type);
					addonParam.load(element, baseUrl);
		
					template.add(addonParam);
				}
			}
		}
	}

	
	private void loadItems(Element rootElement) {
		NodeList optionNodes = rootElement.getElementsByTagName("item");
		for(int i = 0; i < optionNodes.getLength(); i++){

			Element element = (Element)optionNodes.item(i);
			AddonParamProvider provider = new AddonParamProvider();
			provider.load(element, baseUrl);
			propertyProviders.add(provider);
		}
	}

	
	@Override
	public IProperty getAsProperty() {

		IProperty property = new IListProperty() {
			
			public void setValue(String newValue) {
				sendPropertyChangedEvent(this);
			}
			
			public String getValue() {
				return Integer.toString(getChildrenCount());
			}
			
			public String getName() {
				return name;
			}

			@Override
			public int getChildrenCount() {
				return propertyProviders.size();
			}

			@Override
			public void setChildrenCount(int count) {
				resizeTo(count);
				sendPropertyChangedEvent(this);
			}

			@Override
			public IPropertyProvider getChild(int index) {
				return propertyProviders.get(index);
			}
		};
		
		return property;
	}


	public void resizeTo(int count) {

		while(propertyProviders.size() > count){
			propertyProviders.remove(propertyProviders.size()-1);
		}
		
		while(propertyProviders.size() < count){

			AddonParamProvider provider = createParamProvider();
			propertyProviders.add(provider);
		}
	}


	private AddonParamProvider createParamProvider() {

		AddonParamProvider provider = new AddonParamProvider();
		
		for(IAddonParam param : template){
			IAddonParam addonParam = param.makeCopy();
			provider.addParam(addonParam);
		}
		
		return provider;
	}
	
	
	public void addToTemplate(IAddonParam param){
		template.add(param);
	}


	public void addSubPropertyIfNotExists(AddonProperty child, AddonParamFactory addonParamFactory) {

		boolean found = false;
		for(IAddonParam  templateParam: template){
			if(templateParam.getName().compareTo(child.getName()) == 0){
				found = true;
				break;
			}
		}
		
		if(!found){
			IAddonParam param = addonParamFactory.createAddonParam(getAddonModel(), child.getType());
			param.setName(child.getName());
			template.add(param);
			
			for(AddonParamProvider provider : propertyProviders){
				provider.addParam(param);
			}
		}
		
	}
}
