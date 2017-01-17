package com.lorepo.icplayer.client.xml.content.parsers;

import java.util.HashMap;

import com.google.gwt.xml.client.Element;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.model.CssStyle;
import com.lorepo.icplayer.client.model.layout.PageLayout;
import com.lorepo.icplayer.client.xml.content.IContentBuilder;
import com.google.gwt.xml.client.NodeList;


public class ContentParser_v1 extends ContentParserBase {

	public ContentParser_v1() {
		this.version = "2";
	}
	
	protected HashMap<String,CssStyle> parseStyles(Element rootElement) {
		HashMap<String, CssStyle> styles = new HashMap<String, CssStyle>();

		NodeList childrenNodes = rootElement.getChildNodes();
		for(int i = 0; i < childrenNodes.getLength(); i++) {
			if(childrenNodes.item(i) instanceof Element) {
				Element childNode = (Element) childrenNodes.item(i);
				String name = XMLUtils.getAttributeAsString(childNode, "name");
				String id = XMLUtils.getAttributeAsString(childNode, "id");
				String style = XMLUtils.getText(childNode);
				
				if(style.length() > 0) {
					style = StringUtils.unescapeXML(style);
					styles.put(id, new CssStyle(id, name, style));
				}
			}
		}
		
		if(styles.keySet().contains("default") == false) {
			styles.put("default", new CssStyle("default", "default", ""));
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
				PageLayout pageLayout = new PageLayout(id, name);
				
				this.parseLayoutChildren(pageLayout, layoutNode);
				
				content.addLayout(pageLayout);
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
				if(nodeName.compareTo("type") == 0) {
					pageLayout = this.parseTypeNode(pageLayout, child);
				} else if (nodeName.compareTo("treshold") == 0) {
					pageLayout = this.parseTreshold(pageLayout, child);
				}
			}
		}
		
		return pageLayout;
	}

	private PageLayout parseTreshold(PageLayout pageLayout, Element tresholdNode) {
		int right = XMLUtils.getAttributeAsInt(tresholdNode, "right");
		
		pageLayout.setTreshold(right);
		
		return pageLayout;
	}

	private PageLayout parseTypeNode(PageLayout pageLayout, Element typeNode) {
		String type = XMLUtils.getAttributeAsString(typeNode, "value");
		pageLayout.setType(type);
		return pageLayout;
	}
}
