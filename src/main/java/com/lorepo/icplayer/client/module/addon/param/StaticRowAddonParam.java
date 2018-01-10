package com.lorepo.icplayer.client.module.addon.param;

import java.util.ArrayList;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.NodeList;
import com.google.gwt.xml.client.XMLParser;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.IPropertyProvider;
import com.lorepo.icf.properties.IStaticRowProperty;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.module.addon.AddonModel;

public class StaticRowAddonParam implements IAddonParam{

	protected String name;
	protected String displayName;
	protected String type;
	protected String value = "";
	private AddonModel parent;
	private String baseUrl = "";
	protected boolean isDefault = false;
	private ArrayList<AddonParamProvider> addons = new ArrayList<AddonParamProvider>();
	private ArrayList<IAddonParam>	template = new ArrayList<IAddonParam>();
	
	public StaticRowAddonParam(AddonModel parent, String type) {
		this.parent = parent;
		this.type = type;
	}

	
	@Override
	public String getName(){
		return name;
	}
	
	private String templateToXML() {
		
		String xml = "";
		for(IAddonParam param : template){
			
			xml += param.toXML();
		}
		xml += "";
		
		return xml;
	}
	
	private String itemsToXML() {
		
		String xml = "";
		for(AddonParamProvider provider : addons){
			
			xml += provider.toXML();
		}
		return xml;
	}
	
	public String toXMLTemplate() {
		String xml;
		
		xml = "<property";
		xml += " name='" + StringUtils.escapeXML(name) + "'";
		xml += " displayName='" + StringUtils.escapeXML(displayName) + "'";
		xml += " type='" + StringUtils.escapeXML(type) + "'";
		xml += ">";
		
		xml += templateToXML();
		xml += "</property>";
		return xml;		
	}
	
	@Override
	public Element toXML() {
		String xml;
		
		xml = "<property";
		xml += " name='" + StringUtils.escapeXML(name) + "'";
		xml += " displayName='" + StringUtils.escapeXML(displayName) + "'";
		xml += " type='" + StringUtils.escapeXML(type) + "'";
		xml += ">";
		
		xml += itemsToXML();
		xml += "</property>";
		
		return XMLParser.parse(xml).getDocumentElement();
	}

	
	private void loadItems(Element rootElement) {
		name = XMLUtils.getAttributeAsString(rootElement, "name");
		displayName = XMLUtils.getAttributeAsString(rootElement, "displayName");
		type = XMLUtils.getAttributeAsString(rootElement, "type");
		NodeList optionNodes = rootElement.getElementsByTagName("item");
		for(int i = 0; i < optionNodes.getLength(); i++){

			Element element = (Element)optionNodes.item(i);
			AddonParamProvider provider = new AddonParamProvider();
			provider.load(element, baseUrl);
			addons.add(provider);
		}
	}

	public void loadTemplate(Element rootElement) {
		NodeList optionNodes = rootElement.getElementsByTagName("property");
		name = XMLUtils.getAttributeAsString(rootElement, "name");
		displayName = XMLUtils.getAttributeAsString(rootElement, "displayName");
		type = XMLUtils.getAttributeAsString(rootElement, "type");
		for(int i = 0; i < optionNodes.getLength(); i++){
			Element element = (Element)optionNodes.item(i);
			if (XMLUtils.getAttributeAsString(element, "type").compareTo("staticrow") != 0) {
				AddonParamFactory factory = new AddonParamFactory();
				IAddonParam addonParam = factory.createAddonParam(null, XMLUtils.getAttributeAsString(element, "type"));
				addonParam.load(element, baseUrl);
				template.add(addonParam);
				AddonParamProvider addonProvider = new AddonParamProvider();
				addonProvider.addParam(addonParam);
				addons.add(addonProvider);
			}
		}
		
	}
	
	@Override
	public void load(Element element, String baseUrl) {
		name = XMLUtils.getAttributeAsString(element, "name");
		displayName = XMLUtils.getAttributeAsString(element, "displayName");
		type = XMLUtils.getAttributeAsString(element, "type");
		this.baseUrl = baseUrl;
		loadItems(element);
	}

	
	@Override
	public IProperty getAsProperty() {

		IProperty property = new IStaticRowProperty() {

			public void setValue(String newValue) {
				sendPropertyChangedEvent(this);
			}
			
			public String getValue() {
				return Integer.toString(addons.size());
			}
			
			public String getName() {
				return name;
			}
			
			public String getDisplayName() {
				return displayName;
			}

			@Override
			public boolean isDefault() {
				return isDefault;
			}

			@Override
			public int getChildrenCount() {
				return addons.size();
			}

			@Override
			public IPropertyProvider getChild(int index) {
				return addons.get(index);
			}

						
		};
		
		return property;
	}

	@Override
	public void setName(String name) {

		this.name = name;
	}
	
	
	protected void sendPropertyChangedEvent(IProperty sender){
		
		if(parent != null){
			parent.sendPropertyChangedEvent(sender);
		}
	}
	
	protected AddonModel getAddonModel(){
		return parent;
	}

	public void setAddons(ArrayList<AddonParamProvider> addons) {
		this.addons = new ArrayList<AddonParamProvider>(addons);
	}

	@Override
	public IAddonParam makeCopy() {
		
		StaticRowAddonParam param = new StaticRowAddonParam(getAddonModel(), type);
		param.setName(name);
		param.setDisplayName(displayName);
		param.setAddons(addons);
		return param;
	}


	@Override
	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}


	@Override
	public String getDisplayName() {
		return this.displayName;
	}
	
	@Override
	public void setDefault(boolean isDefault) {
		this.isDefault = isDefault;
	}

	@Override
	public boolean isDefault() {
		return isDefault;
	}
	
	public void addToTemplate(IAddonParam param){
		template.add(param);
		AddonParamProvider addonProvider = new AddonParamProvider();
		addonProvider.addParam(param);
		addons.add(addonProvider);
		
	}
}
