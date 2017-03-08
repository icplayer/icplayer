package com.lorepo.icplayer.client.model.layout;

import com.google.gwt.xml.client.Document;
import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.XMLParser;
import com.lorepo.icf.utils.UUID;

public class PageLayout implements PageLayoutBuilder{

	public enum PageLayoutTypes {
		small,
		medium,
		large
	};
	
	public static int MAX_TRESHOLD = 100000;
	private String name;
	private String id;
	private int treshold;
	private PageLayoutTypes type;
	private String styleID;
	private boolean isDefault;
	
	public PageLayout(String id, String name) {
		this.id = id;
		this.name = name;
		this.isDefault = false;
	}
	
	public static PageLayout createDefaultPageLayout() {
		PageLayout defaultPageLayout = new PageLayout("default", "default");
		defaultPageLayout.setTreshold(PageLayout.MAX_TRESHOLD);
		defaultPageLayout.setType(PageLayoutTypes.small);
		defaultPageLayout.setCssID("default");
		defaultPageLayout.setIsDefault(true);
		
		return defaultPageLayout;
	}
	
	public static PageLayout createPageLayout(String name, int treshold, PageLayoutTypes type) {
		PageLayout newPageLayout = new PageLayout(UUID.uuid(), name);
		newPageLayout.setType(type);
		newPageLayout.setCssID("default");
		newPageLayout.setTreshold(treshold);
		
		return newPageLayout;
	}
	
	public String getStyleID () {
		return this.styleID;
	}

	@Override
	public void setName(String name) {
		this.name = name;
	}

	@Override
	public void setTreshold(int value) {
		this.treshold = value;
	}	

	@Override
	public void setType(PageLayoutTypes type) {
		this.type = type;
	}
	
	@Override
	public void setCssID(String styleID) {
		this.styleID = styleID;
	}
	
	@Override
	public void setIsDefault(boolean isDefault) {
		this.isDefault = isDefault;
	}
	
	public boolean isDefault() {
		return this.isDefault;
	}

	public String getName() {
		return this.name;
	}
	
	public String getID() {
		return this.id;
	}
	
	public boolean isThisCssStyle(String styleID) {
		return this.styleID.compareTo(styleID) == 0;
	}

	public Element toXML() {
		Document doc = XMLParser.createDocument();
		Element layout = doc.createElement("layout");
		layout.setAttribute("name", this.name);
		layout.setAttribute("id", this.id);
		
		if (this.isDefault()) {
			layout.setAttribute("isDefault", "true");
		}
		
		Element styleNode = doc.createElement("style");
		styleNode.setAttribute("id", this.styleID);
		layout.appendChild(styleNode);
		
		Element tresholdNode = doc.createElement("treshold");
		tresholdNode.setAttribute("width", Integer.toString(this.treshold));
		layout.appendChild(tresholdNode);
		
		Element typeNode = doc.createElement("type");
		typeNode.setAttribute("value", this.type.toString());
		layout.appendChild(typeNode);
		
		return layout;
	}
}
