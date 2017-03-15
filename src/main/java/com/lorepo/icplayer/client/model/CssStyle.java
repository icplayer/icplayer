package com.lorepo.icplayer.client.model;

import com.google.gwt.xml.client.Document;
import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Text;
import com.google.gwt.xml.client.XMLParser;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.UUID;

public class CssStyle {
	
	public String id;
	public String name;
	public String style;
	public boolean isDefault = false;
	
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
	
	public void setIsDefault(boolean isDefault) {
		this.isDefault = isDefault;
	}
	
	public String getID() {
		return this.id;
	}

	public String getName() {
		return this.name;
	}
	
	public boolean isDefault() {
		return this.isDefault;
	}

	public Element toXML() {
		Document doc = XMLParser.createDocument();
		
		Element style = doc.createElement("style");
		style.setAttribute("name", this.name);
		style.setAttribute("id", this.id);
		
		if (this.isDefault) {
			style.setAttribute("isDefault", "true");
		}
		
		Text node = doc.createTextNode(StringUtils.escapeHTML(this.style));
		style.appendChild(node);
		
		return style;
	}
}
