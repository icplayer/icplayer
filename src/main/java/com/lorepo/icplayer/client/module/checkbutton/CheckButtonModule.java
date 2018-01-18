package com.lorepo.icplayer.client.module.checkbutton;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.BasicModuleModel;

public class CheckButtonModule extends BasicModuleModel {

	private String checkTitle = "";
	private String unCheckTitle = "";
	private String title = "";
	
	public CheckButtonModule() {
		super("Check Button", DictionaryWrapper.get("check_answers_button"));
		addPropertyCheckTitle();
		addPropertyUnCheckTitle();
	}
	
	protected void parseModuleNode(Element node) {
		NodeList nodes = node.getChildNodes();
		for (int i = 0; i < nodes.getLength(); i++) {
			
			Node childNode = nodes.item(i);
			if (childNode instanceof Element) {
				if(childNode.getNodeName().compareTo("button") == 0 && childNode instanceof Element) {
					Element childElement = (Element) childNode;
					
					title = StringUtils.unescapeXML(XMLUtils.getAttributeAsString(childElement, "text"));
					checkTitle = StringUtils.unescapeXML(XMLUtils.getAttributeAsString(childElement, "checkTitle"));
					unCheckTitle = StringUtils.unescapeXML(XMLUtils.getAttributeAsString(childElement, "unCheckTitle"));
					
					if (!title.equals("")) {
						checkTitle = title;
						unCheckTitle = title;
					}
				}
			}
		}
	}

	
	@Override
	public String toXML() {
		Element checkModule = XMLUtils.createElement("checkModule");
		this.setBaseXMLAttributes(checkModule);
		checkModule.appendChild(this.getLayoutsXML());
		
		String encodedCheck = StringUtils.escapeHTML(checkTitle);
		String encodedUnCheck = StringUtils.escapeHTML(unCheckTitle);
		
		Element button = XMLUtils.createElement("button");
		button.setAttribute("checkTitle", encodedCheck);
		button.setAttribute("unCheckTitle", encodedUnCheck);
		
		checkModule.appendChild(button);
		
		return checkModule.toString();
	}

	public String getCheckTitle() {
		return checkTitle;
	}

	public String getUnCheckTitle() {
		return unCheckTitle;
	}

	public void setCheckTitle(String html) {
		checkTitle = html;
	}

	public void setUnCheckTitle(String html) {
		unCheckTitle = html;
	}

	private void addPropertyCheckTitle() {

		IProperty property = new IProperty() {
				
			@Override
			public void setValue(String newValue) {
				checkTitle = newValue;
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return checkTitle;
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("check_title");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("check_title");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(property);
	}

	private void addPropertyUnCheckTitle() {

		IProperty property = new IProperty() {
				
			@Override
			public void setValue(String newValue) {
				unCheckTitle = newValue;
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return unCheckTitle;
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("uncheck_title");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("uncheck_title");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(property);
	}
}
