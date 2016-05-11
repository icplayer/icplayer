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
import com.lorepo.icplayer.client.model.asset.AssetFactory;
import com.lorepo.icplayer.client.model.layout.PageLayout;
import com.lorepo.icplayer.client.xml.content.IContentBuilder;
import com.lorepo.icplayer.client.xml.content.IContentParser;

public class ContentParser_v0 extends ContentParserBase implements IContentParser{
	
	private String version = "1";
	
	@Override
	public Content parse(Element rootNode, ArrayList<Integer> pagesSubset) {
		IContentBuilder content = (IContentBuilder) super.parse(rootNode, pagesSubset);
		
		return this.parseLayouts(content, null);
	}
	
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
	
	protected HashMap<String,String> parseStyles(Element rootElement) {
		HashMap<String, String> styles = new HashMap<String, String>();
		
		String style = XMLUtils.getText(rootElement);
		if(style.length() > 0){
			style = StringUtils.unescapeXML(style);
			styles.put("default", style);
		}
	
		return styles;
	}
	
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

	@Override
	public String getVersion() {
		return this.version;
	}

	@Override
	protected Content parseLayouts(IContentBuilder content, Element child) {
		if (child == null) {
			PageLayout defaultLayout = new PageLayout();
			defaultLayout.setName("default");
			defaultLayout.setTreshold(0, PageLayout.MAX_RIGHT_TRESHOLD);
			defaultLayout.setType("default");
			
			content.addLayout(defaultLayout);
		}
		
		return (Content) content;
	}
}
