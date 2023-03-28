package com.lorepo.icplayer.client.xml.content.parsers;

import java.util.ArrayList;
import java.util.HashMap;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.model.CssStyle;
import com.lorepo.icplayer.client.model.IAsset;
import com.lorepo.icplayer.client.model.Content.ScoreType;
import com.lorepo.icplayer.client.model.addon.AddonDescriptor;
import com.lorepo.icplayer.client.model.asset.AssetFactory;
import com.lorepo.icplayer.client.model.layout.PageLayout;
import com.lorepo.icplayer.client.xml.content.IContentBuilder;

public abstract class ContentParserBase implements IContentParser {
	
	protected String PAGES_KEY = "pages";
	protected String COMMONS_KEY = "commons";
	protected String HEADER_PAGE = "header";
	protected String FOOTER_PAGE = "footer";
	protected String version;
	protected ArrayList<Integer> pagesSubset;
	
	public ContentParserBase() {}
	
	public void setPagesSubset(ArrayList<Integer> pagesSubset) {
		this.pagesSubset = pagesSubset;
	}
	
	public Object parse(Element rootNode) {
		Content content = new Content();
		
		String contentName = this.parseName(rootNode);
		ScoreType scoreType = this.parseScoreType(rootNode);
		
		content.setScoreType(scoreType);
		content.setName(contentName);
		this.setContentDefaultStyle(content);

		NodeList children = rootNode.getChildNodes();
		for(int i = 0; i < children.getLength(); i++){
		
			if(children.item(i) instanceof Element){
				Element child = (Element) children.item(i);
				String name = child.getNodeName(); 
				
				if(name.compareTo("metadata") == 0){
					content.metadata.parse(child);
				}
				else if(name.compareTo("addons") == 0){
					HashMap<String, AddonDescriptor> addonsDescriptors = this.parseAddonDescriptors(child);
					content.setAddonDescriptors(addonsDescriptors);
				}
				else if(name.compareTo("style") == 0){
					content.setStyles(this.parseStyles(child));
				}
				else if(name.compareTo("styles") == 0){
					content.setStyles(this.parseStyles(child));
				} else if(name.compareTo("layouts") == 0) {
					content = this.parseLayouts(content, child);
					content.setDefaultGridSize();
				}
				else if(name.compareTo("pages") == 0){
					this.parsePages(content, child, this.pagesSubset);
					
					String headerPageName = parsePageName(child, this.HEADER_PAGE);
					String footerPageName = parsePageName(child, this.FOOTER_PAGE);
					
					if (headerPageName != null) {
						content.setHeaderPageName(headerPageName);	
					}
					
					if (footerPageName != null) {
						content.setFooterPageName(footerPageName);	
					}
				}
				else if(name.compareTo("assets") == 0){
					ArrayList<IAsset> assets = this.parseAssets(child);
					content.setAssets(assets);
				}
				else if (name.compareTo("adaptive") == 0) {
					String adaptiveStructure = parseAdaptiveStructure(child);
					content.setAdaptiveStructure(adaptiveStructure);
				}
				else if (name.compareTo("dictionary") == 0) {
					HashMap<String, HashMap<String, String>> dictionary = parseDictionaryStructure(child);
					content.setDictionaryStructure(dictionary);
				}
				else if (name.compareTo("defaultTTSTitlesDictionary") == 0) {
					HashMap<String, String> dictionary = parseDefaultTTSTitlesDictionary(child);
					content.setDefaultTTSTitlesDictionary(dictionary);
				}
			}
		}		

		
		this.onEndParsing(content);
		return content;
	}
	
	protected void onEndParsing(Content content) {}
	
	private void setContentDefaultStyle(Content content) {
		HashMap<String, CssStyle> styles = new HashMap<String, CssStyle>();
		styles.put("default", new CssStyle("default", "default", ""));
		content.setStyles(styles);
	}

	protected Content parseLayouts(IContentBuilder content, Element child) {
		if (child == null) {
			PageLayout defaultLayout = PageLayout.createDefaultPageLayout();
			content.addLayout(defaultLayout);
		}
		
		return (Content) content;
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

	protected HashMap<String, AddonDescriptor> parseAddonDescriptors(Element rootElement) {
		HashMap<String, AddonDescriptor> addonDescriptors = new HashMap<String, AddonDescriptor>();
		NodeList descriptorNodes = rootElement.getElementsByTagName("addon-descriptor");
		
		for(int i = 0; i < descriptorNodes.getLength(); i++){
			Element node = (Element)descriptorNodes.item(i);
			String addonId = node.getAttribute("addonId");
			if (!addonId.equals("null")) {
                String href = StringUtils.unescapeXML(node.getAttribute("href"));
                addonDescriptors.put(addonId, new AddonDescriptor(addonId, href));
            }
		}

		return addonDescriptors;
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
	
	protected void parsePages(Content content, Element rootElement, ArrayList<Integer> pageSubset) {
		NodeList children = rootElement.getChildNodes();

		ArrayList<Integer> pagesMapping = new ArrayList<Integer>();
		content.getPagesList().load(rootElement, null, pageSubset, 0, pagesMapping);

		ArrayList<Integer> pages = new ArrayList<Integer>();
		int addedPages = 0;
		for (Integer i : pagesMapping) {
			if (i != null) {
				pages.add(addedPages);
				addedPages++;
			} else {
				pages.add(null);
			}
		}
		content.setPagesSubsetMap(pages);

		for(int i = 0; i < children.getLength(); i++){
			if(children.item(i) instanceof Element){
				Element node = (Element)children.item(i);
				if(node.getNodeName().compareTo("folder") == 0){
					content.getCommonPagesList().load(node, null, null, 0, null);
					break;
				}
			}
		}
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
	
	protected HashMap<String, CssStyle> parseStyles(Element rootElement) {
		HashMap<String, CssStyle> styles = new HashMap<String, CssStyle>();
		
		String style = XMLUtils.getText(rootElement);
		CssStyle defaultStyle = new CssStyle("default", "default", "");
		if(style.length() > 0){
			defaultStyle.setValue(StringUtils.unescapeXML(style));
		}
		
		defaultStyle.setIsDefault(true);
		styles.put("default", defaultStyle);
	
		return styles;
	}
	
	protected String parseAdaptiveStructure(Element xml) {
		return "";
	}

	protected HashMap<String, HashMap<String, String>> parseDictionaryStructure(Element xml) {
		return new HashMap<String, HashMap<String, String>>();
	}

	protected HashMap<String, String> parseDefaultTTSTitlesDictionary(Element xml) {
		return new HashMap<String, String>();
	}
}
