package com.lorepo.icplayer.client.module.checkcounter;

import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.BasicModuleModel;


/**
 * Moduł licznika wcisniecie klawisza check
 * 
 * @author Krzysztof Langner
 *
 */
public class CheckCounterModule extends BasicModuleModel{

	/**
	 * constructor
	 * @param services
	 */
	public CheckCounterModule() {
		super(DictionaryWrapper.get("check_counter_module"));

	}

	
	@Override
	public String toXML() {
		
		String xml = 
				"<checkCounterModule " + getBaseXML() + ">" + getLayoutXML() + 
				"</checkCounterModule>";
		
		return xml;
	}




}
