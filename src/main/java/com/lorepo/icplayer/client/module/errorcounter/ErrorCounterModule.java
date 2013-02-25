package com.lorepo.icplayer.client.module.errorcounter;

import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.BasicModuleModel;


/**
 * Moduł raportu strony
 * Przykład serializacj XML:
 * 
 * <pageReportModule left='60' top='30' width='10' height='10'>
 * </pageReportModule>
 * 
 * @author Krzysztof Langner
 *
 */
public class ErrorCounterModule extends BasicModuleModel{

	/**
	 * constructor
	 * @param services
	 */
	public ErrorCounterModule() {
		super(DictionaryWrapper.get("error_counter_module"));

	}

	
	/**
	 * Convert module into XML
	 */
	@Override
	public String toXML() {
		
		String xml = 
				"<errorCounterModule " + getBaseXML() + ">" + 
				"</errorCounterModule>";
		
		return xml;
	}

}
