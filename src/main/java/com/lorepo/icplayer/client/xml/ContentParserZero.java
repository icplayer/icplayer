package com.lorepo.icplayer.client.xml;

import java.util.ArrayList;
import java.util.HashMap;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.model.AddonDescriptor;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.model.IAsset;
import com.lorepo.icplayer.client.model.Content.ScoreType;
import com.lorepo.icplayer.client.model.PageList;
import com.lorepo.icplayer.client.model.asset.AssetFactory;

public class ContentParserZero implements IContentParser{
	
	@Override
	public Content parse(Element rootNode, ArrayList<Integer> pagesSubset) {
		IContentBuilder content = new Content();
		
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
					HashMap<String, String> metadata = this.parseMetadata(child);
					content.setMetadata(metadata);
				}
				else if(name.compareTo("addons") == 0){
					HashMap<String, AddonDescriptor> addonDescriptors = this.parseAddonDescriptors(child);
					content.setAddonDescriptors(addonDescriptors);
				}
				else if(name.compareTo("style") == 0){
					HashMap<String, String> styles = this.parseStyles(child);
					content.setStyles(styles);
				}
				else if(name.compareTo("pages") == 0){
					HashMap<String, PageList> pagesList = this.parsePages(child, pagesSubset);
				}
				else if(name.compareTo("assets") == 0){
					ArrayList<IAsset> assets = this.parseAssets(child);
					content.setAssets(assets);
				}
			}
		}
			
		
		
		return (Content) content;
	}
	
	private ScoreType parseScoreType(Element rootElement) {
		String st = XMLUtils.getAttributeAsString(rootElement, "scoreType");
		if(st.equals(ScoreType.first.toString())){
			return ScoreType.first;
		}
		
		return null;
	}
	
	private String parseName(Element rootElement) {
		String name = XMLUtils.getAttributeAsString(rootElement, "name");
		name = StringUtils.unescapeXML(name);
		
		return name;
	}
	
	private HashMap<String, String> parseMetadata(Element rootElement) {
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
	
	private HashMap<String, AddonDescriptor> parseAddonDescriptors(Element rootElement) {
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
	
	private HashMap<String,String> parseStyles(Element rootElement) {
		HashMap<String, String> styles = new HashMap<String, String>();
		
		String style = XMLUtils.getText(rootElement);
		if(style.length() > 0){
			style = StringUtils.unescapeXML(style);
			styles.put("default", style);
		}
	
		return styles;
	}
	
	private ArrayList<IAsset> parseAssets(Element rootElement) {
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
	
	private HashMap<String, PageList> parsePages(Element rootElement, ArrayList<Integer> pageSubset) {
		HashMap<String, PageList> pagesHashMap = new HashMap<String, PageList>();
		NodeList children = rootElement.getChildNodes();
//		pages.load(rootElement, baseUrl, pageSubset, 0);
//		for(int i = 0; i < children.getLength(); i++){
//	
//			if(children.item(i) instanceof Element){
//				Element node = (Element)children.item(i);
//				if(node.getNodeName().compareTo("folder") == 0){
//					commonPages.load(node, baseUrl, null, 0);
//				}
//				else if(node.getNodeName().compareTo("header") == 0){
//					headerPageName = node.getAttribute("ref");
//				}
//				else if(node.getNodeName().compareTo("footer") == 0){
//					footerPageName = node.getAttribute("ref");
//				}
//			}
//		}
		
		return pagesHashMap;
	}
}
