package com.lorepo.icplayer.client.xml.group.parsers;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.dimensions.ModuleDimensions;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.model.page.group.Group;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.printable.Printable;
import com.lorepo.icplayer.client.printable.Printable.PrintableMode;
import com.lorepo.icplayer.client.semi.responsive.SemiResponsiveStyles;
import com.lorepo.icplayer.client.semi.responsive.StylesDTO;

public class GroupParser {
	private static int defaultLayoutWidth = 0;
	private static int defaultLayoutHeight = 0;
	
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
		
		String printableValue = Printable.getStringValues(group.getPrintable());
		groupModule.setAttribute("printable", printableValue);
		groupModule.setAttribute("isSplitInPrintBlocked", String.valueOf(group.isSplitInPrintBlocked()));
		
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
		String printableValue = groupNode.getAttribute("printable");

		group.setId(id);
		group.setMaxScore(maxScore);
		PrintableMode printable = Printable.getPrintableModeFromString(printableValue);
		group.setPrintable(printable);
		group.setSplitInPrintBlocked(XMLUtils.getAttributeAsBoolean(groupNode, "isSplitInPrintBlocked", false));
		
		for (int j = 0; j < groupModuleElements.getLength(); j++) {
			Element groupModule = (Element) groupModuleElements.item(j);
			String moduleID = groupModule.getAttribute("moduleID");
			IModuleModel module = page.getModules().getModuleById(moduleID); 
			if(module != null) {
				group.add(module);
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
		defaultLayoutWidth = 0;
		defaultLayoutHeight = 0;
		NodeList nodes = xml.getChildNodes();
		Boolean isVisible = XMLUtils.getAttributeAsBoolean((Element) xml, "isVisible", true);
		group.setIsVisible(isVisible);
		for(int i = 0; i < nodes.getLength(); i++){
			Node childNode = nodes.item(i);
			
			if(childNode.getNodeName().compareTo("layout") == 0 && childNode instanceof Element) {
				parseSingleLayout(childNode, group);
			}
		}
		defaultLayoutWidth = 0;
		defaultLayoutHeight = 0;
	}
	
	private static void parseSingleLayout(Node xml, Group group) {
		String id = XMLUtils.getAttributeAsString((Element) xml, "id");
		Boolean isModuleVisibleInEditor = XMLUtils.getAttributeAsBoolean((Element) xml, "isModuleVisibleInEditor", true);
		Boolean isLocked = XMLUtils.getAttributeAsBoolean((Element) xml, "isLocked", false);
		Boolean isDiv = XMLUtils.getAttributeAsBoolean((Element) xml, "isDiv", false); 
		Boolean isModificatedHeight = XMLUtils.getAttributeAsBoolean((Element) xml, "isModificatedHeight", false); 
		Boolean isModificatedWidth = XMLUtils.getAttributeAsBoolean((Element) xml, "isModificatedWidth", false); 
		ModuleDimensions dimensions = null;
		
		NodeList nodes = xml.getChildNodes();
		for(int i = 0; i < nodes.getLength(); i++){
			Node childNode = nodes.item(i);
			
			if(childNode.getNodeName().compareTo("absolute") == 0 && childNode instanceof Element) {
				if (isDiv) {
					dimensions = parseAbsoluteLayout(childNode, 0, 0);
				} else {
					dimensions = parseAbsoluteLayout(childNode, defaultLayoutWidth, defaultLayoutHeight);
				}
				if (id.toLowerCase().equals("default")) {
					defaultLayoutWidth = dimensions.width;
					defaultLayoutHeight = dimensions.height;
				}
			} 
		}
		group.setSemiResponsiveLayoutID(id);
		group.setIsDiv(id, isDiv);
		group.setIsModificatedHeight(id, isModificatedHeight);
		group.setIsModificatedWidth(id, isModificatedWidth);
		group.addSemiResponsiveDimensions(id, dimensions);
		group.setIsLocked(id, isLocked);
		group.setIsVisibleInEditor(id, isModuleVisibleInEditor);
	}
	
	private static ModuleDimensions parseAbsoluteLayout(Node node, int defaultWidth, int defaultHeight) {
		Element xml = (Element) node;
		
		int left = XMLUtils.getAttributeAsInt(xml, "left");
		int top = XMLUtils.getAttributeAsInt(xml, "top");
		int right = XMLUtils.getAttributeAsInt(xml, "right");
		int bottom = XMLUtils.getAttributeAsInt(xml, "bottom");
		int width = XMLUtils.getAttributeAsInt(xml, "width");
		int height = XMLUtils.getAttributeAsInt(xml, "height");
		if (width == 0 && defaultWidth != 0) width = defaultWidth;
		if (height == 0 && defaultHeight != 0) height = defaultHeight;

		return new ModuleDimensions(left, right, top, bottom, height, width);
	}
	
}
