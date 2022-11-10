package com.lorepo.icplayer.client.xml.content.parsers;

import java.util.HashMap;
import java.util.Set;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.screen.DeviceOrientation;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.model.CssStyle;
import com.lorepo.icplayer.client.model.layout.PageLayout;
import com.lorepo.icplayer.client.xml.content.IContentBuilder;


public class ContentParser_v1 extends ContentParserBase {

	public ContentParser_v1() {
		this.version = "2";
	}
	
	@Override
	protected void onEndParsing(Content content) {
		this.syncStylesAndLayoutsBeforeVersion3(content);
	}
	
	private void syncStylesAndLayoutsBeforeVersion3(Content content) {
		HashMap<String, CssStyle> styles = content.getStyles();
		Set<PageLayout> layouts = content.getActualSemiResponsiveLayouts();
		
		HashMap<String, PageLayout> syncedLayouts = new HashMap<String, PageLayout>();
		HashMap<String, CssStyle> syncedStyles = new HashMap<String, CssStyle>();
		for(PageLayout pl : layouts) {
			String styleID = pl.getStyleID();
			CssStyle newStyle;
			
			if (styles.containsKey(styleID)) {
				CssStyle pageLayoutOldStyle = styles.get(styleID);
				newStyle = CssStyle.createStyleFromPageLayout(pl, pageLayoutOldStyle.getValue());	
			} else {
				newStyle = CssStyle.createStyleFromPageLayout(pl);	
			}
			
			if (pl.isDefault()) {
				newStyle.setIsDefault(true);
			}
			
			pl.setCssID(newStyle.getID());
			syncedLayouts.put(pl.getID(), pl);
			syncedStyles.put(newStyle.getID(), newStyle);
		}
		
		content.setStyles(syncedStyles);
		content.setSemiResponsiveLayouts(syncedLayouts);
	}

	protected HashMap<String,CssStyle> parseStyles(Element rootElement) {
		HashMap<String, CssStyle> styles = new HashMap<String, CssStyle>();

		NodeList childrenNodes = rootElement.getChildNodes();
		for(int i = 0; i < childrenNodes.getLength(); i++) {
			if(childrenNodes.item(i) instanceof Element) {
				Element childNode = (Element) childrenNodes.item(i);
				String name = XMLUtils.getAttributeAsString(childNode, "name");
				String id = XMLUtils.getAttributeAsString(childNode, "id");
				boolean isDefault = XMLUtils.getAttributeAsBoolean(childNode, "isDefault", false);
				String style = XMLUtils.getText(childNode);
				style = StringUtils.unescapeXML(style);
				CssStyle cssStyle = new CssStyle(id, name, style);
				cssStyle.setIsDefault(isDefault);
				styles.put(id, cssStyle);
			}
		}
		
		if(styles.keySet().contains("default") == false && styles.size() == 0) {
			CssStyle style = new CssStyle("default", "default", "");
			style.setIsDefault(true);
			styles.put("default", style);
		}
		
		return styles;
	}
	
	@Override
	protected Content parseLayouts(IContentBuilder content, Element child) {
		NodeList childrenNodes = child.getChildNodes();
		
		for(int i = 0; i < childrenNodes.getLength(); i++) {
			if(childrenNodes.item(i) instanceof Element) {
				Element layoutNode = (Element) childrenNodes.item(i);
				String name = XMLUtils.getAttributeAsString(layoutNode, "name");
				String id = XMLUtils.getAttributeAsString(layoutNode, "id");
				boolean isDefault = XMLUtils.getAttributeAsBoolean(layoutNode, "isDefault", false);
				PageLayout pageLayout = new PageLayout(id, name);
				pageLayout.setIsDefault(isDefault);
				this.parseLayoutChildren(pageLayout, layoutNode);
				
				content.addLayout(pageLayout);
				
				if (isDefault) {
					content.setActualLayoutID(id);
				}
			}
		}
		
		return (Content) content;
	}
	
	protected PageLayout parseLayoutChildren(PageLayout pageLayout, Element layoutNode) {
		NodeList layoutNodeChildren = layoutNode.getChildNodes();
		
		for(int ii = 0; ii < layoutNodeChildren.getLength(); ii++) {
			if (layoutNodeChildren.item(ii) instanceof Element) {
				Element child = (Element) layoutNodeChildren.item(ii);
				String nodeName = child.getNodeName();
				if (nodeName.compareTo("threshold") == 0) {
					pageLayout = this.parseTreshold(pageLayout, child);
				} else if (nodeName.compareTo("style") == 0) {
					pageLayout = this.parseLayoutStyle(pageLayout, child);
				} else if (nodeName.compareTo("deviceOrientation") == 0) {
					pageLayout = this.parseDeviceOrientation(pageLayout, child);
				} else if (nodeName.compareTo("gridSize") == 0) {
					pageLayout = this.parseGridSize(pageLayout, child);
				}
			}
		}
		
		return pageLayout;
	}

	private PageLayout parseDeviceOrientation(PageLayout pageLayout, Element child) {
		pageLayout.useDeviceOrientation(true);
		
		DeviceOrientation deviceOrientation = DeviceOrientation.valueOf(XMLUtils.getAttributeAsString(child, "value"));
		pageLayout.setDeviceOrientation(deviceOrientation);
		
		return pageLayout;
	}

	private PageLayout parseLayoutStyle(PageLayout pageLayout, Element child) {
		String styleID = XMLUtils.getAttributeAsString(child,  "id");
		
		pageLayout.setCssID(styleID);
		
		return pageLayout;
	}

	private PageLayout parseTreshold(PageLayout pageLayout, Element tresholdNode) {
		int width = XMLUtils.getAttributeAsInt(tresholdNode, "width");
		
		pageLayout.setThreshold(width);
		
		return pageLayout;
	}

	private PageLayout parseGridSize(PageLayout pageLayout, Element gridSizeNode) {
		int gridSize = XMLUtils.getAttributeAsInt(gridSizeNode, "value");

		pageLayout.setGridSize(gridSize);

		return pageLayout;
	}
}
