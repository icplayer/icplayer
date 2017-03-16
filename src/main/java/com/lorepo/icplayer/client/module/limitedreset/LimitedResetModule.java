package com.lorepo.icplayer.client.module.limitedreset;

import java.util.LinkedList;
import java.util.List;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.google.gwt.xml.client.XMLParser;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.IStringListProperty;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.BasicModuleModel;
import com.lorepo.icplayer.client.module.ModuleUtils;

public class LimitedResetModule extends BasicModuleModel {
	
	private String title = "";
	private String rawWorksWith = "";
	private List<String> modules = new LinkedList<String>();

	public LimitedResetModule() {
		super("Limited Reset", DictionaryWrapper.get("Limited_Reset_name"));
		
		addPropertyTitle();
		addPropertyWorksWith();
	}
	
	public String getTitle () {
		return title;
	}
	
	public List<String> getModules() {
		return modules;
	}
	
	private void addPropertyTitle() {

		IProperty property = new IProperty() {
				
			@Override
			public void setValue(String newValue) {
				title = newValue;
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return title;
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("Limited_Reset_property_title");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("Limited_Reset_property_title");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(property);
	}
	
	private void addPropertyWorksWith() {

		IStringListProperty property = new IStringListProperty() {
				
			@Override
			public void setValue(String newValue) {
				rawWorksWith = newValue.replace("\n", ";");
				
				modules = ModuleUtils.getListFromRawText(newValue);
				
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return rawWorksWith.replace(";", "\n");
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("Limited_Reset_property_works_with");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("Limited_Reset_property_works_with");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(property);
	}

	@Override
	protected void parseModuleNode(Element node) {
		NodeList nodes = node.getChildNodes();
		for (int i = 0; i < nodes.getLength(); i++) {
			
			Node childNode = nodes.item(i);
			if (childNode instanceof Element) {
				if(childNode.getNodeName().compareTo("limitedReset") == 0) {
					Element childElement = (Element) childNode;
					
					title = XMLUtils.getAttributeAsString(childElement, "title");
					rawWorksWith = XMLUtils.getCharacterDataFromElement(childElement);
					
					modules = ModuleUtils.getListFromRawText(rawWorksWith);
				}
			}
		}
	}
	
	protected String modelToXML() {
		String encodedTitle = StringUtils.escapeHTML(title);

		return "<limitedReset title='" + encodedTitle + "'>"
				+ "<![CDATA[" + rawWorksWith + "]]>"
				+ "</limitedReset>";
	}
	
	@Override
	public String toXML() {
		Element limitedResetModule = XMLUtils.createElement("limitedResetModule");
		this.setBaseXMLAttributes(limitedResetModule);
		limitedResetModule.appendChild(this.getLayoutsXML());
		limitedResetModule.appendChild(XMLParser.parse(this.modelToXML()));
		return limitedResetModule.toString();
	}

}
