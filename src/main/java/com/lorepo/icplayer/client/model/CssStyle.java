package com.lorepo.icplayer.client.model;

import com.google.gwt.xml.client.Document;
import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Text;
import com.google.gwt.xml.client.XMLParser;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.UUID;
import com.lorepo.icplayer.client.model.layout.PageLayout;

public class CssStyle {
	
	public String id;
	public String name;
	public String style;
	public boolean isDefault = false;
	
	public static CssStyle createNewStyle (String name) {
		return new CssStyle(UUID.uuid(),name, "");
	}
	
	public static CssStyle copy(CssStyle toCopy) {
		return new CssStyle(toCopy.getID(), toCopy.getName(), toCopy.getValue());
	}
	

	public static CssStyle createStyleFromPageLayout(PageLayout newLayout) {
		return new CssStyle(newLayout.getID(), newLayout.getName(), "");
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
	
	public String getValue() {
		return this.style;
	}

	public Element toXML() {
		Document doc = XMLParser.createDocument();
		
		Element style = doc.createElement("style");
		style.setAttribute("name", this.name);
		style.setAttribute("id", this.id);
		
		if (this.isDefault) {
			style.setAttribute("isDefault", "true");
		}
		
		Text node = doc.createTextNode(StringUtils.escapeHTML(this.getValue()));
		style.appendChild(node);
		
		return style;
	}
}
