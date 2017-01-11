package com.lorepo.icplayer.client.xml.content.parsers;

import java.util.ArrayList;
import java.util.HashMap;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.model.IAsset;
import com.lorepo.icplayer.client.model.PageList;
import com.lorepo.icplayer.client.model.Content.ScoreType;
import com.lorepo.icplayer.client.model.addon.AddonDescriptor;
import com.lorepo.icplayer.client.model.asset.AssetFactory;
import com.lorepo.icplayer.client.xml.content.IContentBuilder;

public abstract class ContentParserBase implements IContentParser {
	
	protected String PAGES_KEY = "pages";
	protected String COMMONS_KEY = "commons";
	protected String HEADER_PAGE = "header";
	protected String FOOTER_PAGE = "footer";
	protected String version;
	protected ArrayList<Integer> pagesSubset;
	
	public ContentParserBase() {
		// TODO Auto-generated constructor stub
	}
	
	public void setPagesSubset(ArrayList<Integer> pagesSubset) {
		this.pagesSubset = pagesSubset;
	}
	
	public Object parse(Element rootNode) {
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
					HashMap<String, PageList> pagesHashmap = this.parsePages(child, this.pagesSubset);
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


	protected String parsePageName(Element rootElement, String pageNode) {
		String name = null;
		
		NodeList children = rootElement.getChildNodes();
		
		for(int i = 0; i < children.getLength(); i++){
			if(children.item(i) instanceof Element){
				Element node = (Element)children.item(i);
				if(node.getNodeName().compareTo(pageNode) == 0){
					name = node.getAttribute("ref");
				}
			}
		}
		
		return name;
	}


	protected HashMap<String, AddonDescriptor> parseAddonDescriptors(Element rootElement) {
		HashMap<String, AddonDescriptor> addonDescriptors = new HashMap<String, AddonDescriptor>();
		NodeList descriptorNodes = rootElement.getElementsByTagName("addon-descriptor");
		
		for(int i = 0; i < descriptorNodes.getLength(); i++){
			Element node = (Element)descriptorNodes.item(i);
			String addonId = node.getAttribute("addonId");
			String href = StringUtils.unescapeXML(node.getAttribute("href"));
			addonDescriptors.put(addonId, new AddonDescriptor(addonId, href));
		}

		return addonDescriptors;
	}

	protected HashMap<String, String> parseMetadata(Element rootElement) {
		HashMap<String, String> metadata = new HashMap<String, String>();
		NodeList entries = rootElement.getElementsByTagName("entry");
		
		for(int i = 0; i < entries.getLength(); i++){
			Element node = (Element)entries.item(i);
			String key = StringUtils.unescapeXML(node.getAttribute("key"));
			String value = StringUtils.unescapeXML(node.getAttribute("value"));
			
			if(value == null || value.length() == 0){
				metadata.remove(key);
			}
			else{
				metadata.put(key, value);
			}
		}
		
		return metadata;
	}

	protected abstract HashMap<String, String> parseStyles(Element child);
	
	protected ArrayList<IAsset> parseAssets(Element rootElement) {
		ArrayList<IAsset> assets = new ArrayList<IAsset>();
		
		AssetFactory factory = new AssetFactory();
		
		NodeList assetsNodes = rootElement.getElementsByTagName("asset");
		for(int i = 0; i < assetsNodes.getLength(); i++){

			Element node = (Element)assetsNodes.item(i);
			String href = StringUtils.unescapeXML(node.getAttribute("href"));
			String type = StringUtils.unescapeXML(node.getAttribute("type"));
			IAsset asset = factory.createAsset(type, href);
			if(asset != null){
				addAsset(asset, assets);
				asset.setTitle(StringUtils.unescapeXML(node.getAttribute("title")));
				asset.setFileName(StringUtils.unescapeXML(node.getAttribute("fileName")));
				asset.setContentType(StringUtils.unescapeXML(node.getAttribute("contentType")));
			}
		}
		return assets;
	}
	
	public void addAsset(IAsset asset, ArrayList<IAsset> assets){
		
		String href = asset.getHref(); 
		
		if(href == null){
			return;
		}
		
		String escaped = StringUtils.escapeHTML(href);
		if(escaped.compareTo(href) != 0){
			return;
		}
			
		boolean foundURL = false;
			
		for(IAsset a : assets){
			if(a.getHref().compareTo(asset.getHref()) == 0){
				foundURL = true;
				break;
			}
		}
			
		if(	!foundURL){
			assets.add(asset);
		}
	}
	
	
	
	protected HashMap<String, PageList> parsePages(Element rootElement, ArrayList<Integer> pageSubset) {
		HashMap<String, PageList> pagesHashMap = new HashMap<String, PageList>();
		NodeList children = rootElement.getChildNodes();
		
		PageList pages = new PageList("root");
		pages.load(rootElement, null, pageSubset, 0);
		
		pagesHashMap.put("pages", pages);
		for(int i = 0; i < children.getLength(); i++){
			if(children.item(i) instanceof Element){
				Element node = (Element)children.item(i);
				if(node.getNodeName().compareTo("folder") == 0){
					PageList commonPages = new PageList("commons");
					commonPages.load(node, null, null, 0);
					pagesHashMap.put("commons", commonPages);
					break;
				}
			}
		}
		
		return pagesHashMap;
	}

	
	public String getVersion() {
		return this.version;
	}
	
	

	protected String parseName(Element rootElement) {
		String name = XMLUtils.getAttributeAsString(rootElement, "name");
		name = StringUtils.unescapeXML(name);
		
		return name;
	}
	
	protected ScoreType parseScoreType(Element rootElement) {
		String st = XMLUtils.getAttributeAsString(rootElement, "scoreType");
		if(st.equals(ScoreType.first.toString())){
			return ScoreType.first;
		} else {
			return ScoreType.last;
		}
	}

}
