package com.lorepo.icplayer.client.module.checkcounter;

import com.google.gwt.xml.client.Element;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.BasicModuleModel;

public class CheckCounterModule extends BasicModuleModel {

	/**
	 * constructor
	 * @param services
	 */
	public CheckCounterModule() {
		super("Check Counter", DictionaryWrapper.get("check_counter_module"));

	}

	
	@Override
	public String toXML() {
		Element checkCounterModule = XMLUtils.createElement("checkCounterModule");
		
		this.setBaseXMLAttributes(checkCounterModule);
		checkCounterModule.appendChild(this.getLayoutsXML());
		
		return checkCounterModule.toString();
	}


	@Override
	protected void parseModuleNode(Element element) {}
}
