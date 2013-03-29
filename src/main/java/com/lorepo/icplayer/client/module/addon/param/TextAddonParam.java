package com.lorepo.icplayer.client.module.addon.param;

import com.google.gwt.xml.client.Element;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.ITextProperty;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.module.addon.AddonModel;

public class TextAddonParam extends StringAddonParam{


	public TextAddonParam(AddonModel parent, String type) {
		super(parent, type);
	}


	@Override
	public String toXML(){
		
		String xml;
		
		xml = "<property";
		xml += " name='" + StringUtils.escapeXML(name) + "'";
		xml += " type='" + StringUtils.escapeXML(type) + "'";
		xml += ">";
		
		String singleLine = value.replace("\\", "\\:");
		singleLine = singleLine.replace("\n", "\\n");
		xml += StringUtils.escapeXML(singleLine);
		xml += "</property>";
		return xml;
	}


	@Override
	public void load(Element element, String baseUrl) {
		name = XMLUtils.getAttributeAsString(element, "name");
		type = XMLUtils.getAttributeAsString(element, "type");
		String rawText = XMLUtils.getText(element);
		rawText = rawText.replace("\\n", "\n");
		rawText = rawText.replace("\\:", "\\");
		value = StringUtils.unescapeXML(rawText);
	}

	
	@Override
	public IProperty getAsProperty() {

		IProperty property = new ITextProperty() {
			
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
		
		IAddonParam param = new TextAddonParam(getAddonModel(), type);
		param.setName(name);
		return param;
	}
}
