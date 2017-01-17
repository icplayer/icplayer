package com.lorepo.icplayer.client.model;

public class CssStyle {
	
	public String id;
	public String name;
	public String style;

	public CssStyle(String id, String name, String style) {
		this.id = id;
		this.name = name;
		this.style = style;
	}

	public void setValue(String value) {
		this.style = value;
	}
}
