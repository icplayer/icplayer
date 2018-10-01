package com.lorepo.icplayer.client.module.addon.param;

import com.google.gwt.xml.client.Text;
import com.google.gwt.xml.client.Element;
import com.lorepo.icf.properties.IMathTextAnswerProperty;
import com.lorepo.icf.properties.IProperty;
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
		property.setAttribute("name", this.name);
		property.setAttribute("displayName", this.displayName);
		property.setAttribute("type", this.type);
		
		Text xmlValue = XMLUtils.createTextNode(StringUtils.escapeXML(this.value));
		
		property.appendChild(xmlValue);
		
		return property;
	}


	@Override
	public void load(Element element, String baseUrl) {
		this.name = XMLUtils.getAttributeAsString(element, "name");
		this.displayName = XMLUtils.getAttributeAsString(element, "displayName");
		this.type = XMLUtils.getAttributeAsString(element, "type");
		
		this.value = StringUtils.unescapeXML(XMLUtils.getText(element));
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
