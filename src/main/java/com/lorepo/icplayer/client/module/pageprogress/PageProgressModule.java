package com.lorepo.icplayer.client.module.pageprogress;

import java.util.LinkedList;
import java.util.List;

import com.google.gwt.xml.client.CDATASection;
import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.IStringListProperty;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.BasicModuleModel;
import com.lorepo.icplayer.client.module.IWCAGModuleModel;
import com.lorepo.icplayer.client.module.ModuleUtils;


/**
 * Moduł raportu strony
 * Przykład serializacj XML:
 * 
 * <pageReportModule left='60' top='30' width='10' height='10'>
 * </pageReportModule>
 * 
 *
 */
public class PageProgressModule extends BasicModuleModel  implements IWCAGModuleModel{

	private String rawWorksWith = "";
	private List<String> modules = new LinkedList<String>();
	private String langAttribute = "";

	/**
	 * constructor
	 * @param services
	 */
	public PageProgressModule() {
		super("Page Progress", DictionaryWrapper.get("page_progress_module"));

		addPropertyWorksWith();
		addPropertyLangAttribute();
	}


	/**
	 * Convert module into XML
	 */
	@Override
	public String toXML() {
		Element module = XMLUtils.createElement("pageProgressModule");
		module.setAttribute("langAttribute", this.langAttribute);
		this.setBaseXMLAttributes(module);
		module.appendChild(this.getLayoutsXML());
		module.appendChild(modelToXML());
		return module.toString();
	}

	@Override
	protected void parseModuleNode(Element element) {
		NodeList nodes = element.getChildNodes();
		for (int i = 0; i < nodes.getLength(); i++) {
			Node childNode = nodes.item(i);
			if (childNode instanceof Element) {
				if(childNode.getNodeName().compareTo("pageProgress") == 0) {
					Element childElement = (Element) childNode;

					langAttribute = XMLUtils.getAttributeAsString(childElement, "langAttribute");
					rawWorksWith = XMLUtils.getCharacterDataFromElement(childElement);
					
					if (rawWorksWith == null) {
						rawWorksWith = "";
					}
					modules = ModuleUtils.getListFromRawText(rawWorksWith);
				}
			}
		}
	}
	
	private Element modelToXML() {
		Element pageProgress = XMLUtils.createElement("pageProgress");
		CDATASection section = XMLUtils.createCDATASection(this.rawWorksWith);
		pageProgress.appendChild(section);
		
		return pageProgress;
	}

	protected String getRawWorksWith() {
		return rawWorksWith;
	}

	public List<String> getModules() {
		return modules;
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
				return DictionaryWrapper.get("Page_progress_property_works_with");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("Page_progress_property_works_with");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(property);
	}

	private void addPropertyLangAttribute() {
		IProperty property = new IProperty() {

			@Override
			public void setValue(String newValue) {
				langAttribute = newValue;
				sendPropertyChangedEvent(this);
			}

			@Override
			public String getValue() {
				return langAttribute;
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("choice_lang_attribute");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("choice_lang_attribute");
			}
		};

		addProperty(property);
	}
	
	public String getLangAttribute() {
		return langAttribute;
	}

}
