package com.lorepo.icplayer.client.model.layout;

import com.google.gwt.xml.client.Document;
import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.XMLParser;
import com.lorepo.icf.screen.DeviceOrientation;
import com.lorepo.icf.utils.UUID;

public class PageLayout implements PageLayoutBuilder {
	
	public static int MAX_TRESHOLD = 800;
	private String name;
	private String id;
	private int threshold;
	private String styleID;
	private boolean isDefault;
	private boolean useDeviceOrientation = false;
	private DeviceOrientation deviceOrientation = DeviceOrientation.vertical;
	
	public PageLayout(String id, String name) {
		this.id = id;
		this.name = name;
		this.isDefault = false;
	}
	
	public static PageLayout copy(PageLayout pageLayout) {
		PageLayout copy = new PageLayout(pageLayout.getID(), pageLayout.getName());
		copy.setThreshold(pageLayout.getThreshold());
		copy.setDeviceOrientation(pageLayout.getDeviceOrientation());
		copy.useDeviceOrientation(pageLayout.useDeviceOrientation());
		copy.setCssID(pageLayout.getStyleID());
		
		return copy;
	}
	
	public static PageLayout createDefaultPageLayout() {
		PageLayout defaultPageLayout = PageLayout.createPageLayout("default", PageLayout.MAX_TRESHOLD, "default");
		defaultPageLayout.id = "default";
		defaultPageLayout.setIsDefault(true);
		
		return defaultPageLayout;
	}
	
	public static PageLayout createPageLayout(String name, int treshold, String cssID) {
		PageLayout newPageLayout = new PageLayout(UUID.uuid(), name);
		newPageLayout.setCssID(cssID);
		newPageLayout.setThreshold(treshold);
		
		return newPageLayout;
	}
	
	public static PageLayout createPageLayout(String name, int treshold, String cssID, boolean useDeviceOrientation, DeviceOrientation deviceOrientation) {
		PageLayout newPageLayout = new PageLayout(UUID.uuid(), name);
		newPageLayout.setCssID(cssID);
		newPageLayout.setThreshold(treshold);
		newPageLayout.useDeviceOrientation(useDeviceOrientation);
		newPageLayout.setDeviceOrientation(deviceOrientation);
		
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
	public void setThreshold(int value) {
		this.threshold = value;
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
	
	public int getThreshold() {
		return this.threshold;
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
		
		Element tresholdNode = doc.createElement("threshold");
		tresholdNode.setAttribute("width", Integer.toString(this.threshold));
		layout.appendChild(tresholdNode);
		
		if (this.useDeviceOrientation) {
			Element deviceOrientation = doc.createElement("deviceOrientation");
			deviceOrientation.setAttribute("value", this.deviceOrientation.toString());
			layout.appendChild(deviceOrientation);
		}
		
		return layout;
	}

	public void useDeviceOrientation(boolean value) {
		this.useDeviceOrientation = value;
	}

	public void setDeviceOrientation(DeviceOrientation orientation) {
		this.deviceOrientation = orientation;
	}

	public boolean useDeviceOrientation() {
		return this.useDeviceOrientation;
	}
	
	public DeviceOrientation getDeviceOrientation() {
		return this.deviceOrientation;
	}
	
	@Override
	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		
		if (other instanceof PageLayout) {
			PageLayout otherPL = (PageLayout) other;
			return this.id.compareTo(otherPL.getID()) == 0
					&& this.name.compareTo(otherPL.getName()) == 0
					&& this.threshold == otherPL.getThreshold()
					&& this.isDefault == otherPL.isDefault()
					&& this.deviceOrientation == otherPL.deviceOrientation
					&& this.useDeviceOrientation == otherPL.useDeviceOrientation;
		}
		
		return false;
	}
}
