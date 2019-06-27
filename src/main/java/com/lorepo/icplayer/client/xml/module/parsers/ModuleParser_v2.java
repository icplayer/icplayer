package com.lorepo.icplayer.client.xml.module.parsers;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.dimensions.ModuleDimensions;
import com.lorepo.icplayer.client.module.LayoutDefinition;

public class ModuleParser_v2 extends ModuleModelParser_base {

	public ModuleParser_v2() {
		this.version = "3";
	}

	@Override
	protected void parsePosition(Element xml) {}
	
	@Override
	protected void parseLayouts(Element xml) {
		NodeList nodes = xml.getChildNodes();
		setDefaultIsVisible(xml);
		for(int i = 0; i < nodes.getLength(); i++){
			Node childNode = nodes.item(i);
			
			if(childNode.getNodeName().compareTo("layout") == 0 && childNode instanceof Element) {
				this.parseSingleLayout(childNode);
			}
		}
	}
	
	protected void setDefaultIsVisible(Element layouts){
		NodeList layoutChildren = layouts.getChildNodes();
		for (int i = 0; i < layoutChildren.getLength(); i++){
			Node childNode = layoutChildren.item(i);
			if (childNode instanceof Element) {
				Element child = (Element) childNode;
				if(child.getAttribute("id").equals(this.defaultLayoutID)) {
					Boolean isVisible = XMLUtils.getAttributeAsBoolean(child , "isVisible", true);
					this.module.setIsVisible(isVisible);
					return;
				}
			}
		}
		this.module.setIsVisible(true);
	}

	@Override
	public void parseModuleStyleAttributes(Element xml) {
		String inlineStyle = StringUtils.unescapeXML(xml.getAttribute("style"));
		String styleClass = StringUtils.unescapeXML(xml.getAttribute("class"));
		
		this.module.setDefaultInlineStyle(inlineStyle);
		this.module.setDefaultStyleClass(styleClass);
	}

	protected void parseSingleLayout(Node xml) {
		Boolean isModuleVisibleInEditor = XMLUtils.getAttributeAsBoolean((Element) xml, "isModuleVisibleInEditor", true);
		Boolean isLocked = XMLUtils.getAttributeAsBoolean((Element) xml, "isLocked", false);
		String id = XMLUtils.getAttributeAsString((Element) xml, "id");
		ModuleDimensions dimensions = null;
		
		LayoutDefinition relativeLayout = new LayoutDefinition();
		
		NodeList nodes = xml.getChildNodes();
		for(int i = 0; i < nodes.getLength();i++) {
			Node childNode = nodes.item(i);
			
			if(childNode.getNodeName().compareTo("absolute") == 0 && childNode instanceof Element) {
				dimensions = this.parseAbsoluteLayout(childNode);
			} else if (childNode.getNodeName().compareTo("relative") == 0 && childNode instanceof Element) {
				relativeLayout.load((Element) childNode);
			}
		}
		
		this.module.setRelativeLayout(id, relativeLayout);
		this.module.addSemiResponsiveDimensions(id, dimensions);
		this.module.setIsLocked(id, isLocked);
		this.module.setIsVisibleInEditor(id, isModuleVisibleInEditor);
	}

	private ModuleDimensions parseAbsoluteLayout(Node node) {
		Element xml = (Element) node;
		
		int left = XMLUtils.getAttributeAsInt(xml, "left");
		int top = XMLUtils.getAttributeAsInt(xml, "top");
		int right = XMLUtils.getAttributeAsInt(xml, "right");
		int bottom = XMLUtils.getAttributeAsInt(xml, "bottom");
		int width = XMLUtils.getAttributeAsInt(xml, "width");
		int height = XMLUtils.getAttributeAsInt(xml, "height");

		
		return new ModuleDimensions(left, right, top, bottom, height, width);
	}
}
