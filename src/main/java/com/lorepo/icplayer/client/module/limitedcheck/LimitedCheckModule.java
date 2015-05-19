package com.lorepo.icplayer.client.module.limitedcheck;

import java.util.LinkedList;
import java.util.List;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.IStringListProperty;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.BasicModuleModel;
import com.lorepo.icplayer.client.module.ModuleUtils;

public class LimitedCheckModule extends BasicModuleModel {
	
	private String checkText = "";
	private String unCheckText = "";
	private String rawWorksWith = "";
	private List<String> modules = new LinkedList<String>();

	public LimitedCheckModule() {
		super(DictionaryWrapper.get("Limited_Check_name"));
		
		addPropertyCheckText();
		addPropertyUnCheckText();
		addPropertyWorksWith();
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
		};
		
		addProperty(property);
	}
	
	@Override
	public void load(Element node, String baseUrl) {

		super.load(node, baseUrl);
		
		NodeList nodes = node.getChildNodes();
		for (int i = 0; i < nodes.getLength(); i++) {
			
			Node childNode = nodes.item(i);
			if (childNode instanceof Element) {
				if(childNode.getNodeName().compareTo("limitedCheck") == 0) {
					Element childElement = (Element) childNode;
					
					checkText = XMLUtils.getAttributeAsString(childElement, "checkText");
					unCheckText = XMLUtils.getAttributeAsString(childElement, "unCheckText");
					rawWorksWith = XMLUtils.getCharacterDataFromElement(childElement);
					
					modules = ModuleUtils.getListFromRawText(rawWorksWith);
				}
			}
		}
	}
	
	protected String modelToXML() {
		String encodedCheck = StringUtils.escapeHTML(checkText);
		String encodedUnCheck = StringUtils.escapeHTML(unCheckText);

		return "<limitedCheck checkText='" + encodedCheck + "' unCheckText='" + encodedUnCheck + "'>"
				+ "<![CDATA[" + rawWorksWith + "]]>"
				+ "</limitedCheck>";
	}

	@Override
	public String toXML() {
		return "<limitedCheckModule " + getBaseXML() + ">" 
			+ getLayoutXML()
			+ modelToXML()
			+ "</limitedCheckModule>";
	}
}
