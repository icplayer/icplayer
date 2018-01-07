package com.lorepo.icplayer.client.model;

import com.google.gwt.xml.client.Document;
import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Text;
import com.google.gwt.xml.client.XMLParser;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.UUID;
import com.lorepo.icplayer.client.model.layout.PageLayout;

public class CssStyle {
	
	private String id;
	private String name;
	private String style;
	private boolean isDefault = false;
	
	public static CssStyle createNewStyle (String name) {
		return new CssStyle(UUID.uuid(),name, "");
	}
	
	public static CssStyle copy(CssStyle toCopy) {
		return new CssStyle(toCopy.getID(), toCopy.getName(), toCopy.getValue());
	}
	

	public static CssStyle createStyleFromPageLayout(PageLayout newLayout) {
		return new CssStyle(newLayout.getID(), newLayout.getName(), "");
	}
	
	public static CssStyle createStyleFromPageLayout(PageLayout newLayout, String value) {
		return new CssStyle(newLayout.getID(), newLayout.getName(), value);
	}

	public CssStyle(String id, String name, String style) {
		this.id = id;
		this.name = name;
		this.style = style;
	}

	public void setValue(String value) {
		this.style = value;
	}
	
	public void setName(String name) {
		this.name = name;
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
	
	@Override
	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		
		if (other instanceof CssStyle) {
			CssStyle otherStyle = (CssStyle) other;
			return this.getID().compareTo(otherStyle.getID()) == 0
					&& this.getName().compareTo(otherStyle.getName()) == 0
					&& this.getValue().compareTo(otherStyle.getValue()) == 0;
		}
		
		return false;
	}
}
