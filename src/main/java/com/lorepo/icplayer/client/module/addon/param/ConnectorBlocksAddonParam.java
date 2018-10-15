package com.lorepo.icplayer.client.module.addon.param;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.XMLParser;
import com.lorepo.icf.properties.IConnectorBlocksProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.module.addon.AddonModel;

public class ConnectorBlocksAddonParam extends StringAddonParam{


	public ConnectorBlocksAddonParam(AddonModel parent, String type) {
		super(parent, type);
	}


	@Override
	public Element toXML(){
		
		String xml;
		
		xml = "<property" + 
			" name='" + StringUtils.escapeXML(name) + "'" +
			" displayName='" + StringUtils.escapeXML(displayName) + "'" +
			" type='" + StringUtils.escapeXML(type) + "'" +
			">";
		
		String singleLine = value.replace("\\", "\\:");
		singleLine = singleLine.replace("\n", "\\n");
		xml += StringUtils.escapeXML(singleLine);
		xml += "</property>";
		
		return XMLParser.parse(xml).getDocumentElement();
	}


	@Override
	public void load(Element element, String baseUrl) {
		name = XMLUtils.getAttributeAsString(element, "name");
		displayName = XMLUtils.getAttributeAsString(element, "displayName");
		type = XMLUtils.getAttributeAsString(element, "type");
		String rawText = XMLUtils.getText(element);
		rawText = rawText.replace("\\n", "\n");
		rawText = rawText.replace("\\:", "\\");
		value = StringUtils.unescapeXML(rawText);
	}

	
	@Override
	public IProperty getAsProperty() {

		IProperty property = new IConnectorBlocksProperty() {
			
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


	@Override
	public IAddonParam makeCopy() {
		
		IAddonParam param = new ConnectorBlocksAddonParam(getAddonModel(), type);
		param.setName(name);
		param.setDisplayName(displayName);
		return param;
	}
}
