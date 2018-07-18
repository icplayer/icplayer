package com.lorepo.icplayer.client.module.addon.param;

import com.google.gwt.xml.client.Text;
import com.google.gwt.xml.client.CDATASection;
import com.google.gwt.xml.client.Element;
import com.lorepo.icf.properties.IMathTextAnswerProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.module.addon.AddonModel;

public class MathAnswerParam extends StringAddonParam {
	
	public MathAnswerParam(AddonModel parent, String type) {
		super(parent, type);
	}


	@Override
	public Element toXML() {
		
		Element property = XMLUtils.createElement("property");
		property.setAttribute("name", name);
		property.setAttribute("displayName", displayName);
		property.setAttribute("type", type);
		
		Text xmlValue = XMLUtils.createTextNode(StringUtils.escapeXML(value));
		
		property.appendChild(xmlValue);
		
		return property;
	}


	@Override
	public void load(Element element, String baseUrl) {
		name = XMLUtils.getAttributeAsString(element, "name");
		displayName = XMLUtils.getAttributeAsString(element, "displayName");
		type = XMLUtils.getAttributeAsString(element, "type");
		
		String rawText = StringUtils.unescapeXML(XMLUtils.getText(element));
		JavaScriptUtils.log(rawText);
		if (rawText == null) {
			rawText = XMLUtils.getText(element);
		}
		value = rawText;
	}
	
	@Override
	public IProperty getAsProperty() {

		IProperty property = new IMathTextAnswerProperty() {
			
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
				return isDefault;
			}
		};
		
		return property;
	}
}
