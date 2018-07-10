package com.lorepo.icplayer.client.semi.responsive;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.model.layout.PageLayout;

public class SemiResponsiveStyles {
	private HashMap<String, String> inlineStyles = new HashMap<String, String>();
	private HashMap<String, String> stylesClasses = new HashMap<String, String>();
	
	public String getInlineStyle(String semiID, String defaultSemiID) {
		return this.getHashMapValue(this.inlineStyles, semiID, defaultSemiID);
	}
	
	public String getStyleClass(String semiID, String defaultSemiID) {
		return getHashMapValue(this.stylesClasses, semiID, defaultSemiID);
	}
	
	public HashMap<String, String> getInlineStyles() {
		return this.inlineStyles;
	}
	
	public HashMap<String, String> getStylesClasses() {
		return this.stylesClasses;
	}
	
	public void setInlineStyle(String semiID, String style){
		this.inlineStyles.put(semiID, style);
	}
	
	public void setStyleClass(String semiID, String styleClass){
		if(styleClass != null){
			this.stylesClasses.put(semiID, styleClass);
		}
	}
	
	public void setInlineStyles(HashMap<String, String> inlineStyles) {
		this.inlineStyles = inlineStyles;
	}
	
	public void setStylesClasses(HashMap<String, String> styleClasses) {
		this.stylesClasses = styleClasses;
	}
	
	public boolean haveStyles() {
		return isNonEmpty(this.inlineStyles) || isNonEmpty(this.stylesClasses);
	}
	
	public Element toXML() {
		Element styles = XMLUtils.createElement("styles");
		if (this.isNonEmpty(this.stylesClasses)) {
			Element styleClasses = this.hashMapToXMLList(this.stylesClasses, "styleClasses", "styleClass");
			styles.appendChild(styleClasses);
		}
		
		if (this.isNonEmpty(this.inlineStyles)) {
			Element inlineStyles = this.hashMapToXMLList(this.inlineStyles, "inlineStyles", "inlineStyle");
			styles.appendChild(inlineStyles);
		}
		
		return styles;
	}
	
	private Element hashMapToXMLList(HashMap<String, String> hashmap, String mainNode, String childNodeName) {
		Element listNode = XMLUtils.createElement(mainNode);
		
		for (String key : hashmap.keySet()) {
			String value = hashmap.get(key);
			String escapedValue = StringUtils.escapeXML(value);
			
			Element child = XMLUtils.createElement(childNodeName);
			child.setAttribute("value", escapedValue);
			child.setAttribute("layoutID", key);
			listNode.appendChild(child);
		}
		
		return listNode;
	}
	
	private boolean isNonEmpty(HashMap<String, String> hashMapData) {
		if (hashMapData.size() == 0) {
			return false;
		}

		for(String value : hashMapData.values()) {
			if (value.trim().compareTo("") != 0) {
				return true;
			}
		}

		return false;
	}

	public void syncStyles(Set<PageLayout> actualSemiResponsiveLayouts, String defaultSemiResponsiveID) {
		String defaultStylesID = this.syncDefaultLayoutStyles(actualSemiResponsiveLayouts, defaultSemiResponsiveID);
		this.deleteOldStyles(actualSemiResponsiveLayouts);
		this.addMissingLayouts(actualSemiResponsiveLayouts, defaultStylesID);
	}
	

	private void addMissingLayouts(Set<PageLayout> actualSemiResponsiveLayouts, String defaultStylesID) {
		for(PageLayout pl : actualSemiResponsiveLayouts) {
			this.ensureStyleExistsOrFallbackToDefault(pl.getID(), defaultStylesID);
		}
	}

	private void deleteOldStyles(Set<PageLayout> actualSemiResponsiveLayouts) {
		Set<String> layoutsIDs = this.convertToActualLayoutsIDs(actualSemiResponsiveLayouts);
		
		this.inlineStyles = this.removeOldStyles(this.inlineStyles, layoutsIDs);
		this.stylesClasses = this.removeOldStyles(this.stylesClasses, layoutsIDs);
	}

	private HashMap<String, String> removeOldStyles(HashMap<String, String> styles, Set<String> layoutsIDs) {
		HashMap<String, String> onlyActualStyles = new HashMap<String, String>();
		
		for(String key : styles.keySet()) {
			if(layoutsIDs.contains(key)) {
				onlyActualStyles.put(key, styles.get(key));
			}
		}
		
		return onlyActualStyles;
	}

	private Set<String> convertToActualLayoutsIDs(Set<PageLayout> actualSemiResponsiveLayouts) {
		Set<String> layoutsIDs = new HashSet<String>();
		for(PageLayout pl : actualSemiResponsiveLayouts) {
			layoutsIDs.add(pl.getID());
		}
		
		return layoutsIDs;
	}

	private String syncDefaultLayoutStyles(Set<PageLayout> actualSemiResponsiveLayouts, String defaultIDBeforeSync) {
		for(PageLayout pl : actualSemiResponsiveLayouts) {
			if (pl.isDefault()) {
				String actualDefaultLayoutID = pl.getID();
				
				if (defaultIDBeforeSync.compareTo(actualDefaultLayoutID) != 0) {
					this.ensureStyleExistsOrFallbackToDefault(actualDefaultLayoutID, defaultIDBeforeSync);
					return actualDefaultLayoutID;
				}
				
				break;
			}
		}
		
		return defaultIDBeforeSync;
	}
	
	private String getHashMapValue(HashMap<String, String> valuesMap, String semiID, String defaultSemiID) {
		if(valuesMap.containsKey(semiID)){
			return valuesMap.get(semiID);
		} else if (valuesMap.containsKey(defaultSemiID)) {
			return valuesMap.get(defaultSemiID);
		}
		
		return "";
	}

	private void ensureStyleExistsOrFallbackToDefault(String layoutID, String defaultID) {
		boolean inlineStyleNotInMap = !this.inlineStyles.containsKey(layoutID);
		if (inlineStyleNotInMap) {
			String defaultStyleValue = this.getValue(this.inlineStyles, defaultID, "");
			this.inlineStyles.put(layoutID, defaultStyleValue);
		}
		
		boolean styleClassNotInMap = !this.stylesClasses.containsKey(layoutID); 
		if (styleClassNotInMap) {
			String defaultStyleClass = this.getValue(this.stylesClasses, defaultID, "");
			this.stylesClasses.put(layoutID, defaultStyleClass);
		}
	}
	
	private String getValue(HashMap<String, String> values, String layoutID, String defaultValue) {
		if (values.containsKey(layoutID)) {
			return values.get(layoutID);
		}
		
		if (defaultValue != null) {
			return defaultValue;
		}
		
		return "";
	}
	
	public static StylesDTO parseXML(Element stylesNode) {
		StylesDTO result = new StylesDTO();
		
		NodeList configuration = stylesNode.getChildNodes();

		for(int i = 0; i < configuration.getLength(); i++) {
			Node childNode = configuration.item(i);
			if (childNode.getNodeName().compareTo("styleClasses") == 0 && childNode instanceof Element && childNode != null) {
				HashMap<String, String> stylesClasses = SemiResponsiveStyles.parseHashMap(childNode, "styleClass");
				result.setStylesClasses(stylesClasses);
			} else if (childNode.getNodeName().compareTo("inlineStyles") == 0 && childNode instanceof Element && childNode != null) {
				HashMap<String, String> inlineStyles = SemiResponsiveStyles.parseHashMap(childNode, "inlineStyle");
				result.setInlineStyles(inlineStyles);
			}
		}
		
		return result;
	}

	private static HashMap<String, String> parseHashMap(Node keyValueNode, String elementName) {
		HashMap<String, String> result = new HashMap<String, String>();
		
		NodeList nodeList = keyValueNode.getChildNodes();
		for(int i = 0; i < nodeList.getLength(); i++) {
			Node child = nodeList.item(i);
			if(child.getNodeName().compareTo(elementName) == 0 && child instanceof Element && child != null) {
				Element childElement = (Element) child;
				String layoutID = XMLUtils.getAttributeAsString(childElement, "layoutID");
				String value = XMLUtils.getAttributeAsString(childElement, "value");
				String unescapedValue = StringUtils.unescapeXML(value);
				result.put(layoutID, unescapedValue);
			}
		}
		
		return result;
	};
}
