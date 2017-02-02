package com.lorepo.icplayer.client.module.pageprogress;

import java.util.LinkedList;
import java.util.List;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.IStringListProperty;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.BasicModuleModel;
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
public class PageProgressModule extends BasicModuleModel{

	private String rawWorksWith = "";
	private List<String> modules = new LinkedList<String>();
	
	/**
	 * constructor
	 * @param services
	 */
	public PageProgressModule() {
		super("Page Progress", DictionaryWrapper.get("page_progress_module"));

		addPropertyWorksWith();
	}

	
	/**
	 * Convert module into XML
	 */
	@Override
	public String toXML() {
		
		String xml = 
				"<pageProgressModule " + getBaseXML() + ">"
				+ getLayoutXML()
				+ modelToXML()
				+ "</pageProgressModule>";
		
		return xml;
	}
	
	protected String modelToXML() {

		return "<pageProgress>"
				+ "<![CDATA[" + rawWorksWith + "]]>"
				+ "</pageProgress>";
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

	@Override
	public void load(Element node, String baseUrl) {

		super.load(node, baseUrl);
		
		NodeList nodes = node.getChildNodes();
		for (int i = 0; i < nodes.getLength(); i++) {
			
			Node childNode = nodes.item(i);
			if (childNode instanceof Element) {
				if(childNode.getNodeName().compareTo("pageProgress") == 0) {
					Element childElement = (Element) childNode;
					
					rawWorksWith = XMLUtils.getCharacterDataFromElement(childElement);	
					modules = ModuleUtils.getListFromRawText(rawWorksWith);
				}
			}
		}
	}


}
