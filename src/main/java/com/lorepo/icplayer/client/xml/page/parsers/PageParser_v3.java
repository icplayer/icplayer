package com.lorepo.icplayer.client.xml.page.parsers;

import com.google.gwt.xml.client.Element;
import com.lorepo.icplayer.client.semi.responsive.SemiResponsiveStyles;
import com.lorepo.icplayer.client.semi.responsive.StylesDTO;
import com.lorepo.icplayer.client.xml.page.IPageBuilder;

public class PageParser_v3 extends PageParser_v2 {
	public PageParser_v3() {
		this.version = "4";
	}
	
	@Override
	protected IPageBuilder loadStyles(IPageBuilder page, Element stylesNode) {
		StylesDTO result = SemiResponsiveStyles.parseXML(stylesNode);
		
		page.setInlineStyles(result.inlineStyles);
		page.setStylesClasses(result.stylesClasses);
		
		return page;
	}
}
