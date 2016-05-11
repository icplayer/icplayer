package com.lorepo.icplayer.client.xml.content.parsers;

import java.util.ArrayList;
import java.util.HashMap;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.model.AddonDescriptor;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.model.IAsset;
import com.lorepo.icplayer.client.model.PageList;
import com.lorepo.icplayer.client.model.Content.ScoreType;
import com.lorepo.icplayer.client.xml.content.IContentBuilder;

public abstract class ContentParserBase {
	
	protected String PAGES_KEY = "pages";
	protected String COMMONS_KEY = "commons";
	protected String HEADER_PAGE = "header";
	protected String FOOTER_PAGE = "footer";
	
	public ContentParserBase() {
		// TODO Auto-generated constructor stub
	}
	
	public Content parse(Element rootNode, ArrayList<Integer> pagesSubset) {
		Content content = new Content();
		
		String contentName = this.parseName(rootNode);
		ScoreType scoreType = this.parseScoreType(rootNode);
		
		content.setScoreType(scoreType);
		content.setName(contentName);

		NodeList children = rootNode.getChildNodes();
		for(int i = 0; i < children.getLength(); i++){
		
			if(children.item(i) instanceof Element){
				Element child = (Element) children.item(i);
				String name = child.getNodeName(); 
				if(name.compareTo("metadata") == 0){
					content.setMetadata(this.parseMetadata(child));
				}
				else if(name.compareTo("addons") == 0){
					content.setAddonDescriptors(this.parseAddonDescriptors(child));
				}
				else if(name.compareTo("style") == 0){
					content.setStyles(this.parseStyles(child));
				}
				else if(name.compareTo("styles") == 0){
					content.setStyles(this.parseStyles(child));
				} else if(name.compareTo("layouts") == 0) {
					content = this.parseLayouts(content, child);
				}
				else if(name.compareTo("pages") == 0){
					HashMap<String, PageList> pagesHashmap = this.parsePages(child, pagesSubset);
					PageList pages = pagesHashmap.get(this.PAGES_KEY);
					PageList commons = pagesHashmap.get(this.COMMONS_KEY);
					
					String headerPageName = parsePageName(child, this.HEADER_PAGE);
					String footerPageName = parsePageName(child, this.FOOTER_PAGE);
					
					if (pages != null) {
						content.setPages(pages);						
					}

					if (commons != null) {
						content.setCommonPages(commons);	
					}
					content.setHeaderPageName(headerPageName);
					content.setFooterPageName(footerPageName);
					
				}
				else if(name.compareTo("assets") == 0){
					ArrayList<IAsset> assets = this.parseAssets(child);
					content.setAssets(assets);
				}
			}
		}		

		return content;
	}
	
	protected abstract Content parseLayouts(IContentBuilder content, Element child);

	protected abstract ArrayList<IAsset> parseAssets(Element child);

	protected abstract String parsePageName(Element child, String header_PAGE2);

	protected abstract HashMap<String, PageList> parsePages(Element child, ArrayList<Integer> pagesSubset);

	protected abstract HashMap<String, AddonDescriptor> parseAddonDescriptors(Element child);

	protected abstract HashMap<String, String> parseMetadata(Element child);

	protected abstract HashMap<String, String> parseStyles(Element child);

	protected String parseName(Element rootElement) {
		String name = XMLUtils.getAttributeAsString(rootElement, "name");
		name = StringUtils.unescapeXML(name);
		
		return name;
	}
	
	protected ScoreType parseScoreType(Element rootElement) {
		String st = XMLUtils.getAttributeAsString(rootElement, "scoreType");
		if(st.equals(ScoreType.first.toString())){
			return ScoreType.first;
		}
		
		return null;
	}

}
