package com.lorepo.icplayer.client.xml.module.parsers;

import java.util.HashMap;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.UUID;
import com.lorepo.icf.utils.XMLUtils;

public abstract class ModuleModelParser_base implements IModuleModelParser {

	protected String version;
	protected IModuleModelBuilder module;
	
	public ModuleModelParser_base() {
	}

	@Override
	public String getVersion() {
		return this.version;
	}

	@Override
	public Object parse(Element xml) {
		NodeList nodes = xml.getChildNodes();
		this.parsePosition(xml);
		this.parseModuleAttributes(xml);
		
		for(int i = 0; i < nodes.getLength(); i++){
			Node childNode = nodes.item(i);
			
			if(childNode.getNodeName().compareTo("button") == 0 && childNode instanceof Element) {
				this.module.setButtonType(StringUtils.unescapeXML(((Element) childNode).getAttribute("type")));
			}else if(childNode.getNodeName().compareTo("layout") == 0 && childNode instanceof Element) {
				this.module.loadLayout((Element) childNode);
			} else if(childNode.getNodeName().compareTo("layouts") == 0 && childNode instanceof Element) {
				this.parseLayouts((Element) childNode);
			}
		}
		return this.module;
	}

	protected void parseLayouts(Element childNode) {
		
	}

	protected void parsePosition(Element xml) {
		int left = XMLUtils.getAttributeAsInt(xml, "left");
		int top = XMLUtils.getAttributeAsInt(xml, "top");
		int width = XMLUtils.getAttributeAsInt(xml, "width");
		int height = XMLUtils.getAttributeAsInt(xml, "height");
		int right = XMLUtils.getAttributeAsInt(xml, "right");
		int bottom = XMLUtils.getAttributeAsInt(xml, "bottom");
		
		HashMap<String, Integer> defaultPosition = new HashMap<String, Integer>();
		defaultPosition.put("left", left);
		defaultPosition.put("top", top);
		defaultPosition.put("width", width);
		defaultPosition.put("height", height);
		defaultPosition.put("right", right);
		defaultPosition.put("bottom", bottom);
		this.module.setPosition("default", defaultPosition);
	}
	
	protected void parseModuleAttributes(Element xml) {
		String id = parseModuleID(xml);
		this.module.setID(id);
		this.parsePosition(xml);
		this.module.setIsVisible(XMLUtils.getAttributeAsBoolean(xml, "isVisible", true));
		this.module.setIsLocked(XMLUtils.getAttributeAsBoolean(xml, "isLocked", false));
		this.module.setIsModuleVisibleInEditor(XMLUtils.getAttributeAsBoolean(xml, "isModuleVisibleInEditor", true));

		String style = StringUtils.unescapeXML(xml.getAttribute("style"));
		this.module.setInlineStyle(style);
		this.module.setStyleClass(StringUtils.unescapeXML(xml.getAttribute("class") ));
	}

	protected String parseModuleID(Element xml) {
		String id = xml.getAttribute("id");
		if (id == null || id.compareTo("null") == 0) {
			id = UUID.uuid(6);
		} else {
			id = StringUtils.unescapeXML(id);
		}
		return id;
	}

	@Override
	public void setModule(IModuleModelBuilder module) {
		this.module = module;
	}
}
