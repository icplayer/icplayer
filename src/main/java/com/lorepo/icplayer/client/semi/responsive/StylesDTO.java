package com.lorepo.icplayer.client.semi.responsive;

import java.util.HashMap;

public class StylesDTO {
	public HashMap<String, String> stylesClasses = new HashMap<String, String>();
	public HashMap<String, String> inlineStyles = new HashMap<String, String>();
	
	public void setInlineStyles(HashMap<String, String> inlineStyles) {
		this.inlineStyles = inlineStyles;
	}
	
	public void setStylesClasses(HashMap<String, String> stylesclasses) {
		this.stylesClasses = stylesclasses;
	}
}