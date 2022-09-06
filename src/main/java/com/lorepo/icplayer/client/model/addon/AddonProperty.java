package com.lorepo.icplayer.client.model.addon;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;

public class AddonProperty {

	private String name;
	private String displayName;
	private String type;
	private String value;
	private boolean isLocalized = false;
	private List<AddonProperty> childProperties = new ArrayList<AddonProperty>();
	private boolean isDefault = false;
	
	public AddonProperty(){}

	public AddonProperty(String name, String displayName, String type){
		this.name = name;
		this.displayName = displayName;
		this.type = type;
	}
	
	public String getName(){
		return name;
	}
	
	public String getDisplayName(){
		return displayName;
	}
	
	public String getType(){
		return type;
	}
		
	public String getValue(){
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public boolean isLocalized() {
		return isLocalized;
	}
	
	
	public void setLocalized(boolean value) {
		isLocalized = value;
	}
	
	public boolean isDefault() {
		return isDefault;
	}
	
	public void load(Element rootElement) {
		
		childProperties.clear();
		name = XMLUtils.getAttributeAsString(rootElement, "name");
		displayName = AddonPropertyUtils.loadDisplayNameFromXML(rootElement);
		value = XMLUtils.getAttributeAsString(rootElement, "value");
		type = XMLUtils.getAttributeAsString(rootElement, "type");
		isLocalized = XMLUtils.getAttributeAsBoolean(rootElement, "isLocalized", false);

		isDefault = XMLUtils.getAttributeAsBoolean(rootElement, "isDefault");
		
		if(type.compareTo("list") == 0){
			
			NodeList optionNodes = rootElement.getChildNodes();
			for(int i = 0; i < optionNodes.getLength(); i++){                        
		
				Node node = optionNodes.item(i);
				if(node instanceof Element && node.getNodeName().compareTo("property") == 0){
					Element element = (Element)optionNodes.item(i);
					AddonProperty property = new AddonProperty();
					property.load(element);
					childProperties.add(property);
				}
			}
		} else if(type.compareTo("staticlist") == 0) {
			
			NodeList optionNodes = rootElement.getChildNodes();
			for(int i = 0; i < optionNodes.getLength(); i++){                        
		
				Node node = optionNodes.item(i);
				if(node instanceof Element && node.getNodeName().compareTo("property") == 0){
					if(XMLUtils.getAttributeAsString((Element)node, "type").compareTo("staticrow") == 0) {
						Element element = (Element)optionNodes.item(i);
						AddonProperty property = new AddonProperty();
						property.load(element);
						childProperties.add(property);
					}
				}
			}	
		} else if(type.compareTo("staticrow") == 0) {
			NodeList optionNodes = rootElement.getChildNodes();
			for(int i = 0; i < optionNodes.getLength(); i++){                        
				Node node = optionNodes.item(i);
				if(node instanceof Element && node.getNodeName().compareTo("property") == 0){	
					Element element = (Element)optionNodes.item(i);
					AddonProperty property = new AddonProperty();
					property.load(element);
					childProperties.add(property);
				}
			}					  
		} else if(type.compareTo("editableselect") == 0) {
			NodeList optionNodes = rootElement.getChildNodes();
			for(int i = 0; i < optionNodes.getLength(); i++){
				Node node = optionNodes.item(i);
				if(node instanceof Element && node.getNodeName().compareTo("property") == 0){	
					Element element = (Element)optionNodes.item(i);
					AddonProperty property = new AddonProperty();
					property.load(element);
					childProperties.add(property);
				}
			}
		}
	}


	public String toXML(){
		
		String xml;
		String encodedName = StringUtils.escapeXML(name.trim());
		String encodedDisplayName = StringUtils.escapeXML(displayName != null ? displayName.trim() : "");
		String encodedType = StringUtils.escapeXML(type.trim());
		
		if(childProperties.size() > 0){
			xml = "<property name='" + encodedName + "' displayName='" + encodedDisplayName + "' type='" + encodedType + "'>"; 
			for(AddonProperty property : childProperties){
				xml += property.toXML();
			}
			xml += "</property>";
		} else if (value != null) {
			xml = "<property name='" + encodedName + "' displayName='" + encodedDisplayName + "' type='" + encodedType + 
			"' isLocalized='" + isLocalized + "' isDefault='" + isDefault + "' value='" + value + "'/>";
		}
		else{
			xml = "<property name='" + encodedName + "' displayName='" + encodedDisplayName + "' type='" + encodedType + 
					"' isLocalized='" + isLocalized + "' isDefault='" + isDefault + "'/>";
		}
		
		return xml;
	}
	
	
	public int getChildrenCount(){
		return childProperties.size();
	}
	
	
	public void addSubProperty(AddonProperty property){
		childProperties.add(property);
	}
	
	
	public AddonProperty getProperty(int index){
		return childProperties.get(index);
	}
}
