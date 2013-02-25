package com.lorepo.icplayer.client.model;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;

public class AddonProperty {

	private String name;
	private String type;
	private boolean isLocalized = false;
	private List<AddonProperty> childProperties = new ArrayList<AddonProperty>();
	
	
	public AddonProperty(){
	}
	

	public AddonProperty(String name, String type){
		this.name = name;
		this.type = type;
	}
	

	public String getName(){
		return name;
	}
	
	public String getType(){
		return type;
	}

	
	public boolean isLocalized() {
		return isLocalized;
	}
	
	
	public void setLocalized(boolean value) {
		isLocalized = value;
	}
	
	
	public void load(Element rootElement) {
		
		childProperties.clear();
		name = XMLUtils.getAttributeAsString(rootElement, "name");
		type = XMLUtils.getAttributeAsString(rootElement, "type");
		isLocalized = XMLUtils.getAttributeAsBoolean(rootElement, "isLocalized", false);

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
		}
	}


	public String toXML(){
		
		String xml;
		String encodedName = StringUtils.escapeXML(name.trim());
		String encodedtype = StringUtils.escapeXML(type.trim());
		
		if(childProperties.size() > 0){
			xml = "<property name='" + encodedName + "' type='" + encodedtype + "'>";
			for(AddonProperty property : childProperties){
				xml += property.toXML();
			}
			xml += "</property>";
		}
		else{
			xml = "<property name='" + encodedName + "' type='" + encodedtype + 
					"' isLocalized='" + isLocalized + "'/>";
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
