package com.lorepo.icplayer.client.xml.module.parsers;


import com.google.gwt.xml.client.Element;
import com.lorepo.icplayer.client.semi.responsive.SemiResponsiveStyles;
import com.lorepo.icplayer.client.semi.responsive.StylesDTO;

public class ModuleParser_v3 extends ModuleParser_v2 {
	
	public ModuleParser_v3() {
		this.version = "4";
	}
	
	@Override
	public void parseModuleStyleAttributes(Element xml) {}
	
	@Override
	protected void parseStyles(Element stylesNode) {
		StylesDTO result = SemiResponsiveStyles.parseXML(stylesNode);
		
		this.module.setInlineStyles(result.inlineStyles);
		this.module.setStylesClasses(result.stylesClasses);
	}
}
