package com.lorepo.icplayer.client.xml.module.parsers;

import java.util.HashMap;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.utils.XMLUtils;
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
		
		for(int i = 0; i < nodes.getLength(); i++){
			Node childNode = nodes.item(i);
			
			if(childNode.getNodeName().compareTo("layout") == 0 && childNode instanceof Element) {
				this.parseSingleLayout(childNode);
			}
		}
	}

	private void parseSingleLayout(Node xml) {
		Boolean isVisible = XMLUtils.getAttributeAsBoolean((Element) xml, "isVisible", true);
		Boolean isModuleVisibleInEditor = XMLUtils.getAttributeAsBoolean((Element) xml, "isModuleVisibleInEditor", true);
		Boolean isLocked = XMLUtils.getAttributeAsBoolean((Element) xml, "isLocked", false);
		String id = XMLUtils.getAttributeAsString((Element) xml, "id");
		HashMap<String, Integer> absolutePosition = null;
		LayoutDefinition relativeLayout = new LayoutDefinition();
		
		NodeList nodes = xml.getChildNodes();
		for(int i = 0; i < nodes.getLength();i++) {
			Node childNode = nodes.item(i);
			
			if(childNode.getNodeName().compareTo("absolute") == 0 && childNode instanceof Element) {
				absolutePosition = this.parseAbsoluteLayout(childNode);
			} else if (childNode.getNodeName().compareTo("relative") == 0 && childNode instanceof Element) {
				relativeLayout.load((Element) childNode);
			}
		}
		
		this.module.setPosition(id, absolutePosition);
		this.module.setIsVisible(id, isVisible);
		this.module.setIsLocked(id, isLocked);
		this.module.setIsVisibleInEditor(id, isModuleVisibleInEditor);
	}

	private HashMap<String, Integer> parseAbsoluteLayout(Node node) {
		Element xml = (Element) node;
		
		int left = XMLUtils.getAttributeAsInt(xml, "left");
		int top = XMLUtils.getAttributeAsInt(xml, "top");
		int width = XMLUtils.getAttributeAsInt(xml, "width");
		int height = XMLUtils.getAttributeAsInt(xml, "height");
		int right = XMLUtils.getAttributeAsInt(xml, "right");
		int bottom = XMLUtils.getAttributeAsInt(xml, "bottom");
		
		HashMap<String, Integer> position = new HashMap<String, Integer>();
		position.put("left", left);
		position.put("top", top);
		position.put("width", width);
		position.put("height", height);
		position.put("right", right);
		position.put("bottom", bottom);
		
		return position;
	}
}
