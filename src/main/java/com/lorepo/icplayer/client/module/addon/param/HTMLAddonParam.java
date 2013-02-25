package com.lorepo.icplayer.client.module.addon.param;

import com.google.gwt.xml.client.Element;
import com.lorepo.icf.properties.IHtmlProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.module.addon.AddonModel;

public class HTMLAddonParam extends StringAddonParam{


	public HTMLAddonParam(AddonModel parent, String type) {
		super(parent, type);
	}


	@Override
	public String toXML(){
		
		String xml;
		
		xml = "<property";
		xml += " name='" + StringUtils.escapeXML(name) + "'";
		xml += " type='" + StringUtils.escapeXML(type) + "'>";
		xml += "<![CDATA[" + value + "]]>";
		xml += "</property>";
		return xml;
	}


	@Override
	public void load(Element element) {
		name = XMLUtils.getAttributeAsString(element, "name");
		type = XMLUtils.getAttributeAsString(element, "type");
		
		String rawText = XMLUtils.getCharacterDataFromElement(element);
		if(rawText == null){
			rawText = XMLUtils.getText(element);
			rawText = StringUtils.unescapeXML(rawText);
		}
		
		value = rawText;
	}

	
	@Override
	public IProperty getAsProperty() {

		IProperty property = new IHtmlProperty() {
			
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
		};
		
		return property;
	}


	@Override
	public IAddonParam makeCopy() {
		
		IAddonParam param = new HTMLAddonParam(getAddonModel(), type);
		param.setName(name);
		return param;
	}
}
