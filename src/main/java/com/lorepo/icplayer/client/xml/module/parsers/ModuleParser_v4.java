package com.lorepo.icplayer.client.xml.module.parsers;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.utils.XMLUtils;

public class ModuleParser_v4 extends ModuleParser_v3 {
	
	public ModuleParser_v4() {
		this.version = "5";
	}
	
	@Override
	protected void parseLayouts(Element xml) {
		NodeList nodes = xml.getChildNodes();	
		setDefaultIsVisible(xml);	
		for(int i = 0; i < nodes.getLength(); i++){
			Node childNode = nodes.item(i);
			
			if(childNode.getNodeName().compareTo("layout") == 0 && childNode instanceof Element) {
				this.parseSingleLayout(childNode);
			}
		}
	}
	
	private void setDefaultIsVisible(Element layouts){
		Boolean isVisible = XMLUtils.getAttributeAsBoolean(layouts , "isVisible", true);
		this.module.setIsVisible(isVisible);
		return;
	}

}
