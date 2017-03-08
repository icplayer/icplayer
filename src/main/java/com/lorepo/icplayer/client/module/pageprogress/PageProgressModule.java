package com.lorepo.icplayer.client.module.pageprogress;


import com.google.gwt.xml.client.Element;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.BasicModuleModel;


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

	/**
	 * constructor
	 * @param services
	 */
	public PageProgressModule() {
		super("Page Progress", DictionaryWrapper.get("page_progress_module"));

	}

	
	/**
	 * Convert module into XML
	 */
	@Override
	public String toXML() {
		Element module = XMLUtils.createElement("pageProgressModule");
		this.setBaseXMLAttributes(module);
		module.appendChild(this.getLayoutsXML());
		return module.toString();
	}


	@Override
	protected void parseModuleNode(Element element) {
		// TODO Auto-generated method stub
	}
}
