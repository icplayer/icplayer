package com.lorepo.icplayer.client.module.pageprogress;

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
		
		String xml = 
				"<pageProgressModule " + getBaseXML() + ">" + getLayoutXML() + 
				"</pageProgressModule>";
		
		return xml;
	}




}
