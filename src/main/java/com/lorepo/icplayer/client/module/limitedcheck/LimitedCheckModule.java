package com.lorepo.icplayer.client.module.limitedcheck;

import java.util.LinkedList;
import java.util.List;

import com.google.gwt.xml.client.CDATASection;
import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.IBooleanProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.IStringListProperty;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.BasicModuleModel;
import com.lorepo.icplayer.client.module.IWCAGModuleModel;
import com.lorepo.icplayer.client.module.ModuleUtils;

public class LimitedCheckModule extends BasicModuleModel implements IWCAGModuleModel {
	
	private String checkText = "";
	private String unCheckText = "";
	private String rawWorksWith = "";
	private List<String> modules = new LinkedList<String>();
	private boolean mistakesFromProvidedModules = false;

	public LimitedCheckModule() {
		super("Limited Check", DictionaryWrapper.get("Limited_Check_name"));
		
		addPropertyCheckText();
		addPropertyUnCheckText();
		addPropertyWorksWith();
		addPropertyCountMistakesFromProvidedModules();
	}

	protected void setCheckText(String checkText) {
		this.checkText = checkText;
	}
	
	protected String getCheckText() {
		return checkText;
	}

	protected void setUnCheckText(String unCheckText) {
		this.unCheckText = unCheckText;
	}
	
	protected String getUnCheckText() {
		return unCheckText;
	}
	
	protected void setRawWorksWith(String worksWith) {
		this.rawWorksWith = worksWith;
	}

	protected String getRawWorksWith() {
		return rawWorksWith;
	}
	
	public List<String> getModules() {
		return modules;
	}

	private void addPropertyCheckText() {

		IProperty property = new IProperty() {
				
			@Override
			public void setValue(String newValue) {
				checkText = newValue;
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return checkText;
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("Limited_Check_property_check_text");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("Limited_Check_property_check_text");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(property);
	}

	private void addPropertyUnCheckText() {

		IProperty property = new IProperty() {
				
			@Override
			public void setValue(String newValue) {
				unCheckText = newValue;
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return unCheckText;
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("Limited_Check_property_uncheck_text");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("Limited_Check_property_uncheck_text");
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
				
				modules = ModuleUtils.getListFromRawText(rawWorksWith);
				
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return rawWorksWith.replace(";", "\n");
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("Limited_Check_property_works_with");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("Limited_Check_property_works_with");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(property);
	}
	
	private void addPropertyCountMistakesFromProvidedModules() {
		IProperty property = new IBooleanProperty() {

			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value != mistakesFromProvidedModules) {
					mistakesFromProvidedModules = value;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return mistakesFromProvidedModules ? "True" : "False";
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("Limited_Check_property_mistakes_from_provided_modules");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("Limited_Check_property_mistakes_from_provided_modules");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

		};

		addProperty(property);
	}

	public boolean getMistakesFromProvidedModules() {
		return mistakesFromProvidedModules;
	}

	@Override
	protected void parseModuleNode(Element node) {
		NodeList nodes = node.getChildNodes();
		for (int i = 0; i < nodes.getLength(); i++) {
			
			Node childNode = nodes.item(i);
			if (childNode instanceof Element) {
				if(childNode.getNodeName().compareTo("limitedCheck") == 0) {
					Element childElement = (Element) childNode;
					
					checkText = StringUtils.unescapeXML(XMLUtils.getAttributeAsString(childElement, "checkText"));
					unCheckText = StringUtils.unescapeXML(XMLUtils.getAttributeAsString(childElement, "unCheckText"));
					rawWorksWith = XMLUtils.getCharacterDataFromElement(childElement);
					mistakesFromProvidedModules = XMLUtils.getAttributeAsBoolean(childElement, "mistakesFromProvidedModules");

					modules = ModuleUtils.getListFromRawText(rawWorksWith);
				}
			}
		}
	}

	@Override
	public String toXML() {
		Element limitedCheckModule = XMLUtils.createElement("limitedCheckModule");
		this.setBaseXMLAttributes(limitedCheckModule);
		limitedCheckModule.appendChild(this.getLayoutsXML());
		limitedCheckModule.appendChild(this.modelToXML());

		return limitedCheckModule.toString();
	}

	protected Element modelToXML() {
		String encodedCheck = StringUtils.escapeHTML(checkText);
		String encodedUnCheck = StringUtils.escapeHTML(unCheckText);

		Element limitedCheckElement = XMLUtils.createElement("limitedCheck");
		limitedCheckElement.setAttribute("checkText", encodedCheck);
		limitedCheckElement.setAttribute("unCheckText", encodedUnCheck);
		XMLUtils.setBooleanAttribute(limitedCheckElement, "mistakesFromProvidedModules", mistakesFromProvidedModules);

		CDATASection cdata = XMLUtils.createCDATASection(rawWorksWith);

		limitedCheckElement.appendChild(cdata);
		return limitedCheckElement;
	}
}
