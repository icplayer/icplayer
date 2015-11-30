package com.lorepo.icplayer.client.module.addon.param;

import com.google.gwt.xml.client.Element;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.module.addon.AddonModel;

public class StringAddonParam implements IAddonParam{

	protected String name;
	protected String displayName;
	protected String type;
	protected String value = "";
	private AddonModel parent;
	
	
	public StringAddonParam(AddonModel parent, String type) {
		this.parent = parent;
		this.type = type;
	}

	
	@Override
	public String getName(){
		return name;
	}
	
	@Override
	public String toXML(){
		
		String xml;
		
		xml = "<property";
		xml += " name='" + StringUtils.escapeXML(name) + "'";
		xml += " displayName='" + StringUtils.escapeXML(displayName) + "'";
		xml += " type='" + StringUtils.escapeXML(type) + "'";
		xml += " value='" + StringUtils.escapeXML(value) + "'";
		xml += "/>";
		
		return xml;
	}


	@Override
	public void load(Element element, String baseUrl) {
		name = XMLUtils.getAttributeAsString(element, "name");
		displayName = XMLUtils.getAttributeAsString(element, "displayName");
		type = XMLUtils.getAttributeAsString(element, "type");
		String rawPropertyValue = XMLUtils.getAttributeAsString(element, "value");
		value = StringUtils.unescapeXML(rawPropertyValue);
	}

	
	@Override
	public IProperty getAsProperty() {

		IProperty property = new IProperty() {
			
			public void setValue(String newValue) {
				value = newValue;
				sendPropertyChangedEvent(this);
			}
			
			public String getValue() {
				return value;
			}
			
			public String getName() {
				return name;
			}
			
			public String getDisplayName() {
				return displayName;
			}

			@Override
			public boolean isDefault() {
				return false;
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


	@Override
	public IAddonParam makeCopy() {
		
		IAddonParam param = new StringAddonParam(getAddonModel(), type);
		param.setName(name);
		param.setDisplayName(displayName);
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
}
