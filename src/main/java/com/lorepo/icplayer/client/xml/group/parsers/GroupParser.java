package com.lorepo.icplayer.client.xml.group.parsers;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.dimensions.ModuleDimensions;
import com.lorepo.icplayer.client.model.page.Group;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.semi.responsive.SemiResponsiveStyles;
import com.lorepo.icplayer.client.semi.responsive.StylesDTO;

public class GroupParser {
	
	public static String toXML(Group group) {
		Element groupModule = XMLUtils.createElement("group");
		groupModule.setAttribute("id", group.getId());
		Element scoring = XMLUtils.createElement("scoring");
		scoring.setAttribute("type", String.valueOf(group.getScoringType()));
		scoring.setAttribute("max", String.valueOf(group.getMaxScore()));
		groupModule.appendChild(scoring); 
		Element groupedModulesList = XMLUtils.createElement("groupedModulesList");
		groupModule.appendChild(groupedModulesList);
		
		for(IModuleModel module: group) {
			Element modules = XMLUtils.createElement("groupModule");
			modules.setAttribute("moduleID", module.getId());
			groupedModulesList.appendChild(modules); 
		}
		
		groupModule.appendChild(group.getSemiResponsivePositions().toXML());
		groupModule.appendChild(group.stylesToXML());
		return groupModule.toString();
	}
	
	public static Group loadGroupFromXML(Element groupNode, Page page) {
		Group group = new Group(page);
		NodeList groupModuleElements = groupNode.getElementsByTagName("groupModule");
		NodeList scoringNode = groupNode.getElementsByTagName("scoring");
		Element scoring = (Element)scoringNode.item(0);
		group.setScoreFromString(DictionaryWrapper.get(scoring.getAttribute("type")));
		int maxScore = Integer.parseInt(scoring.getAttribute("max"));
		String id = groupNode.getAttribute("id");

		group.setId(id);
		group.setMaxScore(maxScore);
		
		for (int j = 0; j < groupModuleElements.getLength(); j++) {
			Element groupModule = (Element) groupModuleElements.item(j);
			String moduleID = groupModule.getAttribute("moduleID");
			IModuleModel m = page.getModules().getModuleById(moduleID); 
			if(m != null) {
				group.add(m);
			}
		}
		
		Element layouts = XMLUtils.getFirstElementWithTagName(groupNode,"layouts");
		if(layouts!=null) {
			parseLayouts(layouts, group);
		}
		
		Element styles = XMLUtils.getFirstElementWithTagName(groupNode,"styles");
		if(styles!=null) {
				parseStyles(styles, group); 
		}
		
		return group;
	}
	
	private static void parseStyles(Element xml, Group group) {
		StylesDTO result = SemiResponsiveStyles.parseXML(xml);
		group.setInlineStyles(result.inlineStyles);
		group.setStylesClasses(result.stylesClasses);
	}
	
	private static void parseLayouts(Element xml, Group group) {
		NodeList nodes = xml.getChildNodes();
		
		for(int i = 0; i < nodes.getLength(); i++){
			Node childNode = nodes.item(i);
			
			if(childNode.getNodeName().compareTo("layout") == 0 && childNode instanceof Element) {
				parseSingleLayout(childNode, group);
			}
		}
	}
	
	private static void parseSingleLayout(Node xml, Group group) {
		String id = XMLUtils.getAttributeAsString((Element) xml, "id");
		Boolean isVisible = XMLUtils.getAttributeAsBoolean((Element) xml, "isVisible", true);
		Boolean isModuleVisibleInEditor = XMLUtils.getAttributeAsBoolean((Element) xml, "isModuleVisibleInEditor", true);
		Boolean isLocked = XMLUtils.getAttributeAsBoolean((Element) xml, "isLocked", false);
		Boolean isDiv = XMLUtils.getAttributeAsBoolean((Element) xml, "isDiv", false); 
		ModuleDimensions dimensions = null;
		
		NodeList nodes = xml.getChildNodes();
		for(int i = 0; i < nodes.getLength(); i++){
			Node childNode = nodes.item(i);
			
			if(childNode.getNodeName().compareTo("absolute") == 0 && childNode instanceof Element) {
				dimensions = parseAbsoluteLayout(childNode);
			} 
		}
		group.setSemiResponsiveLayoutID(id);
		group.setIsDiv(id, isDiv);
		group.addSemiResponsiveDimensions(id, dimensions);
		group.setIsVisible(id, isVisible);
		group.setIsLocked(id, isLocked);
		group.setIsVisibleInEditor(id, isModuleVisibleInEditor);
	}
	
	private static ModuleDimensions parseAbsoluteLayout(Node node) {
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
