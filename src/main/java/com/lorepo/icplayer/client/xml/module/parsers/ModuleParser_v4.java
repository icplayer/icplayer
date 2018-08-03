package com.lorepo.icplayer.client.xml.module.parsers;

import com.google.gwt.xml.client.Element;
import com.lorepo.icf.utils.XMLUtils;

public class ModuleParser_v4 extends ModuleParser_v3 {
	
	public ModuleParser_v4() {
		this.version = "5";
	}
	
	@Override
	protected void setDefaultIsVisible(Element layouts){
		Boolean isVisible = XMLUtils.getAttributeAsBoolean(layouts , "isVisible", true);
		this.module.setIsVisible(isVisible);
	}

}
