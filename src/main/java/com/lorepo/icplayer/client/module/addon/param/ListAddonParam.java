package com.lorepo.icplayer.client.module.addon.param;

import java.util.ArrayList;

import com.google.gwt.dom.client.Document;
import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.NodeList;
import com.google.gwt.xml.client.XMLParser;
import com.lorepo.icf.properties.IListProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.IPropertyProvider;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.model.addon.AddonProperty;
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
	public Element toXML(){
		
		String xml;
		
		xml = "<property";
		xml += " name='" + StringUtils.escapeXML(name) + "'";
		xml += " displayName='" + StringUtils.escapeXML(displayName) + "'";
		xml += " type='" + StringUtils.escapeXML(type) + "'";
		xml += ">";
		
		xml += templateToXML();
		xml += temsToXML();
		
		xml += "</property>";
		return XMLParser.parse(xml).getDocumentElement();
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
		displayName = XMLUtils.getAttributeAsString(rootElement, "displayName");
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
			
			public String getDisplayName() {
				return displayName;
			}

			@Override
			public int getChildrenCount() {
				return propertyProviders.size();
			}

			@Override
			public void addChildren(int count) {
				addNewItems(count);
				sendPropertyChangedEvent(this);
			}

			@Override
			public IPropertyProvider getChild(int index) {
				return propertyProviders.get(index);
			}

			@Override
			public void removeChildren(int index) {
				removeItem(index);
				sendPropertyChangedEvent(this);
			}

			@Override
			public void moveChildUp(int index) {
				moveItemUp(index);
				sendPropertyChangedEvent(this);
			}

			@Override
			public void moveChildDown(int index) {
				moveItemDown(index);
				sendPropertyChangedEvent(this);
			}

			@Override
			public boolean isDefault() {
				return isDefault;
			}

			@Override
			public void moveChild(int prevIndex, int nextIndex) {
				moveItem(prevIndex, nextIndex);
				sendPropertyChangedEvent(this);
			}
		};
		
		return property;
	}


	public void addNewItems(int count) {

		for(int i = 0; i < count; i++){
			AddonParamProvider provider = createParamProvider();
			propertyProviders.add(provider);
		}
	}

	private void removeItem(int index) {
		if(propertyProviders.size() > 1){
			propertyProviders.remove(index);
		}
	}


	private void moveItemUp(int index) {
		if(index > 0){
			AddonParamProvider item = propertyProviders.remove(index);
			propertyProviders.add(index-1, item);
		}
	}

	private void moveItem(int prevIndex, int nextIndex) {
		if(nextIndex > 0){
			AddonParamProvider item = propertyProviders.remove(prevIndex);
			propertyProviders.add(nextIndex, item);
		}
	}

	private void moveItemDown(int index) {
		if(index < propertyProviders.size()-1){
			AddonParamProvider item = propertyProviders.remove(index);
			propertyProviders.add(index+1, item);
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

		@Override
		public void setDisplayName(String displayName) {
			this.displayName = displayName;
		}


		@Override
		public String getDisplayName() {
			return this.displayName;
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
			param.setDisplayName(child.getDisplayName());
			template.add(param);
			
			for(AddonParamProvider provider : propertyProviders){
				IAddonParam childParam = addonParamFactory.createAddonParam(getAddonModel(), child.getType());
				childParam.setName(child.getName());
				childParam.setDisplayName(child.getDisplayName());
				provider.addParam(childParam);
			}
		}
		
	}
}
