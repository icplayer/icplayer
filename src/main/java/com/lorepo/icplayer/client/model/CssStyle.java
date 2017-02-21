package com.lorepo.icplayer.client.model;

import com.lorepo.icf.utils.UUID;

public class CssStyle {
	
	public String id;
	public String name;
	public String style;
	
	public static CssStyle createNewStyle (String name) {
		return new CssStyle(UUID.uuid(),name, "");
	}

	public CssStyle(String id, String name, String style) {
		this.id = id;
		this.name = name;
		this.style = style;
	}

	public void setValue(String value) {
		this.style = value;
	}
}
