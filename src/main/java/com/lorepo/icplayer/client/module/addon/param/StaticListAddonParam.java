package com.lorepo.icplayer.client.module.addon.param;

import java.util.ArrayList;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.NodeList;
import com.google.gwt.xml.client.XMLParser;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.IPropertyProvider;
import com.lorepo.icf.properties.IStaticListProperty;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.model.addon.AddonProperty;
import com.lorepo.icplayer.client.module.addon.AddonModel;

public class StaticListAddonParam extends StringAddonParam{

	private AddonParamFactory factory;
	private ArrayList<AddonParamProvider>	propertyProviders = new ArrayList<AddonParamProvider>();
	private ArrayList<IAddonParam>	template = new ArrayList<IAddonParam>();
	private String baseUrl;
	
	
	public StaticListAddonParam(AddonModel parent, String type, AddonParamFactory factory) {
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
			if (param instanceof StaticRowAddonParam) {
				xml += ((StaticRowAddonParam)param).toXMLTemplate();
			} else {
				xml += param.toXML();
			}
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
					if (XMLUtils.getAttributeAsString(element, "type").compareTo("staticrow") == 0){
						String type = XMLUtils.getAttributeAsString(element, "type");
						StaticRowAddonParam row = new StaticRowAddonParam(null, type);						
						row.loadTemplate(element);
						template.add(row);
					}
				}
			}
		}
	}

	
	private void loadItems(Element rootElement) {
		NodeList optionNodes = rootElement.getElementsByTagName("items");
		for(int i = 0; i < optionNodes.getLength();){
			Element items = (Element)optionNodes.item(i);
			NodeList properties = items.getElementsByTagName("property");
			for (int j = 0; j < properties.getLength(); j++) {
				Element element = (Element)properties.item(j);
				if (XMLUtils.getAttributeAsString(element, "type").compareTo("staticrow") == 0) {
					AddonParamProvider provider = new AddonParamProvider();
					StaticRowAddonParam row = new StaticRowAddonParam(null, "staticrow");
					row.load(element, "staticrow");
					provider.addParam(row);
					propertyProviders.add(provider);
				}
			}

			break;
		}
	}

	
	@Override
	public IProperty getAsProperty() {

		IProperty property = new IStaticListProperty() {
			
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
		};
		
		return property;
	}


	public void addNewItems(int count) {

		for(int i = 0; i < count; i++){
			for(int j = 0; j < template.size(); j++) {
				AddonParamProvider provider = createParamProvider(j);
				propertyProviders.add(provider);
			}
		}
	}

	public void addNewItem(AddonParamProvider item) {
		this.propertyProviders.add(item);
	}
	
	private void moveItemUp(int index) {
		if(index > 0){
			AddonParamProvider item = propertyProviders.remove(index);
			propertyProviders.add(index-1, item);
		}
	}

	private void moveItemDown(int index) {
		if(index < propertyProviders.size()-1){
			AddonParamProvider item = propertyProviders.remove(index);
			propertyProviders.add(index+1, item);
		}
	}
	
	private AddonParamProvider createParamProvider(int index) {

		AddonParamProvider provider = new AddonParamProvider();
		
		IAddonParam param = template.get(index);
		IAddonParam addonParam = param.makeCopy();
		provider.addParam(addonParam);
		
		
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
				provider.addParam(param);
			}
		}
		
	}
}
