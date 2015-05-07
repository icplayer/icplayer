package com.lorepo.icplayer.client.model;

import java.util.ArrayList;
import java.util.HashMap;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.utils.IXMLSerializable;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.model.asset.AssetFactory;
import com.lorepo.icplayer.client.module.api.player.IAddonDescriptor;
import com.lorepo.icplayer.client.module.api.player.IChapter;
import com.lorepo.icplayer.client.module.api.player.IContent;
import com.lorepo.icplayer.client.module.api.player.IContentNode;
import com.lorepo.icplayer.client.module.api.player.IPage;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;

public class Content implements IXMLSerializable, IContent {

	public enum ScoreType{ first, last }
	
	private static final String COMMONS_FOLDER = "commons/";
	private String name = "";
	private ScoreType scoreType = ScoreType.last; 
	private PageList	pages;
	private PageList	commonPages;
	private HashMap<String, AddonDescriptor>	addonDescriptors = new HashMap<String, AddonDescriptor>();
	private ArrayList<IAsset>	assets = new ArrayList<IAsset>();
	private ArrayList<Integer> pageSubset = new ArrayList<Integer>();
	private String styles;
	private HashMap<String, String>	metadata = new HashMap<String, String>();
	private String		baseUrl = "";
	private IContentListener listener;
	private String headerPageName = "commons/header";
	private String footerPageName = "commons/footer";
	
	public Content(){
		
		pages = new PageList("root");
		commonPages = new PageList("commons");
		connectHandlers();
	}
	
	public void setPlayerController(IPlayerServices ps) {
		pages.setPlayerServices(ps);
	}
	
	private void connectHandlers() {
		pages.addListener(new IPageListListener() {
			public void onNodeRemoved(IContentNode node, IChapter parent) {
				if(listener != null){
					listener.onRemovePage(node, parent);
				}
			}
			
			public void onNodeMoved(IChapter source, int from, int to) {
				if(listener != null){
					listener.onPageMoved(source, from, to);
				}
			}
			
			public void onNodeAdded(IContentNode node) {
				if(listener != null){
					listener.onAddPage(node);
				}
			}

			@Override
			public void onChanged(IContentNode source) {
				if(listener != null){
					listener.onChanged(source);
				}
				
			}
		});
		
		commonPages.addListener(new IPageListListener() {
			public void onNodeRemoved(IContentNode node, IChapter parent) {
				if(listener != null){
					listener.onRemovePage(node, parent);
				}
			}
			public void onNodeMoved(IChapter source, int from, int to) {
			}
			public void onNodeAdded(IContentNode node) {
				if(listener != null){
					listener.onAddPage(node);
				}
			}
			public void onChanged(IContentNode source) {
			}
		});
		
	}

	
	public ScoreType getScoreType(){
		return scoreType;
	}
	
	public void setScoreType(ScoreType st){
		scoreType = st;
	}
	
	public void addChangeListener(IContentListener l){
		listener = l;
	}
	
	
	public HashMap<String,AddonDescriptor>	getAddonDescriptors(){
		return addonDescriptors;
	}
	
	
	public PageList	getPages(){
		return pages;
	}
	
	
	public PageList	getCommonPages(){
		return commonPages;
	}
	
	
	public void addAsset(IAsset asset){
		
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

	
	public IAsset getAsset(int index){
		
		return assets.get(index);
	}

	
	public int getAssetCount(){
		
		return assets.size();
	}

	
	public String getBaseUrl(){
		return baseUrl;
	}
	
	
	public String getMetadataValue(String key){
		return metadata.get(key);
	}

	
	public String getStyles(){
		return styles;
	}
	
	public void setMetadataValue(String key, String value){
		
		if(value == null || value.length() == 0){
			metadata.remove(key);
		}
		else{
			metadata.put(key, value);
		}
	}

	
	public void setStyles(String text) {
		styles = text;
	}

	public void setPageSubset(ArrayList<Integer> pageList){
		pageSubset = pageList;
	}

	@Override
	public void load(Element rootElement, String url) {

		baseUrl = url.substring(0, url.lastIndexOf("/")+1);

		loadAttributes(rootElement);

		NodeList children = rootElement.getChildNodes();
		for(int i = 0; i < children.getLength(); i++){
			
			if(children.item(i) instanceof Element){
				Element child = (Element) children.item(i);
				String name = child.getNodeName(); 
				if(name.compareTo("metadata") == 0){
					loadMetadata(child);
				}
				else if(name.compareTo("addons") == 0){
					loadAddonDescriptors(child);
				}
				else if(name.compareTo("style") == 0){
					loadStyles(child);
				}
				else if(name.compareTo("pages") == 0){
					loadPages(child, url, pageSubset);
				}
				else if(name.compareTo("assets") == 0){
					loadAssets(child);
				}
			}
		}
		
	}

	private void loadAttributes(Element rootElement) {
		name = XMLUtils.getAttributeAsString(rootElement, "name");
		name = StringUtils.unescapeXML(name);
		String st = XMLUtils.getAttributeAsString(rootElement, "scoreType");
		if(st.equals(ScoreType.first.toString())){
			scoreType = ScoreType.first;
		}
	}


	private void loadMetadata(Element rootElement) {
		NodeList entries = rootElement.getElementsByTagName("entry");
		
		for(int i = 0; i < entries.getLength(); i++){
	
			Element node = (Element)entries.item(i);
			String key = StringUtils.unescapeXML(node.getAttribute("key"));
			String value = StringUtils.unescapeXML(node.getAttribute("value"));
			setMetadataValue(key, value);
		}
	}


	private void loadAddonDescriptors(Element rootElement) {
	
		NodeList descriptorNodes = rootElement.getElementsByTagName("addon-descriptor");
		
		for(int i = 0; i < descriptorNodes.getLength(); i++){
	
			Element node = (Element)descriptorNodes.item(i);
			String addonId = node.getAttribute("addonId");
			String href = StringUtils.unescapeXML(node.getAttribute("href"));
			addonDescriptors.put(addonId, new AddonDescriptor(addonId, href));
		}
	}


	private void loadStyles(Element rootElement) {

		String style = XMLUtils.getText(rootElement);
		if(style.length() > 0){
			style = StringUtils.unescapeXML(style);
			setStyles(style);
		}
	}


	private void loadPages(Element rootElement, String baseUrl, ArrayList<Integer> pageSubset) {
		NodeList children = rootElement.getChildNodes();
		pages.load(rootElement, baseUrl, pageSubset, 0);
		for(int i = 0; i < children.getLength(); i++){
	
			if(children.item(i) instanceof Element){
				Element node = (Element)children.item(i);
				if(node.getNodeName().compareTo("folder") == 0){
					commonPages.load(node, baseUrl, null, 0);
				}
				else if(node.getNodeName().compareTo("header") == 0){
					headerPageName = node.getAttribute("ref");
				}
				else if(node.getNodeName().compareTo("footer") == 0){
					footerPageName = node.getAttribute("ref");
				}
			}
		}
	}


	private void loadAssets(Element rootElement) {
		
		AssetFactory factory = new AssetFactory();
		
		NodeList assets = rootElement.getElementsByTagName("asset");
		for(int i = 0; i < assets.getLength(); i++){

			Element node = (Element)assets.item(i);
			String href = StringUtils.unescapeXML(node.getAttribute("href"));
			String type = StringUtils.unescapeXML(node.getAttribute("type"));
			IAsset asset = factory.createAsset(type, href);
			if(asset != null){
				addAsset(asset);
				asset.setTitle(StringUtils.unescapeXML(node.getAttribute("title")));
				asset.setFileName(StringUtils.unescapeXML(node.getAttribute("fileName")));
				asset.setContentType(StringUtils.unescapeXML(node.getAttribute("contentType")));
			}
		}
	}


	/**
	 * Convert model into XML
	 * @return
	 */
	public String toXML(){
	
		String xml = "<?xml version='1.0' encoding='UTF-8' ?>"; 

		String escapedName = StringUtils.escapeXML(name);
		xml += "<interactiveContent name='" + escapedName + "' scoreType='" +scoreType + "'>";			
		
		// Metadata
		xml += "<metadata>";
		for(String key : metadata.keySet()){
			String encodedKey = StringUtils.escapeHTML(key);
			String encodedValue = StringUtils.escapeHTML(metadata.get(key));
			xml += "<entry key='" + encodedKey + "' value='" + encodedValue + "'/>";
		}
		xml += 	"</metadata>";
		
		// Addons
		xml += "<addons>";
		for(AddonDescriptor descriptor : addonDescriptors.values()){
			xml += "<addon-descriptor addonId='"+descriptor.getAddonId()+"' href='"+descriptor.getHref()+"'/>";
		}
		xml += 	"</addons>";

		if(styles != null){
			xml += "<style>" + StringUtils.escapeHTML(styles) + "</style>";
		}
		
		// Pages
		xml += toXMLPages();
		
		// Assets
		xml += "<assets>";
		for(IAsset asset : assets){
			xml += asset.toXML();
		}
		xml += 	"</assets>";
		
		xml += 	"</interactiveContent>";
		return xml;
	}


	private String toXMLPages() {
		
		String xml = "<pages>";
		xml += pages.toXML();
		
		if(commonPages.getTotalPageCount() > 0){
			
			xml += "<folder name='commons'>";
			xml += commonPages.toXML();
			xml += 	"</folder>";
		}
		
		if(headerPageName != null){
			xml += "<header ref='" + headerPageName + "'/>";
		}
		
		if(footerPageName != null){
			xml += "<footer ref='" + footerPageName + "'/>";
		}
		
		xml += 	"</pages>";
		
		return xml;
	}


	@Override
	public int getPageCount() {
		return pages.getTotalPageCount();
	}


	@Override
	public IPage getPage(int index) {
		return pages.getAllPages().get(index);
	}

    @Override
    public IPage getPageById(String id) {
        for (IPage page : pages.getAllPages()) {
            if (page.getId().equals(id)) {
                return page;
            }
        }

        return null;
    }

	@Override
	public IAddonDescriptor getAddonDescriptor(String addonId) {
		return addonDescriptors.get(addonId);
	}
	
	
	public Page findPageByName(String pageName){
		
		int index;
		Page page = null;
		String lowerCaseName = pageName.toLowerCase(); 
		
		if(lowerCaseName.startsWith(COMMONS_FOLDER)){
		
			String commonPageName = lowerCaseName.substring(COMMONS_FOLDER.length());
			index = commonPages.findPageIndexByName(commonPageName);
			if(index >= 0){
				page = commonPages.getAllPages().get(index);
			}
		}
		else{
			index = pages.findPageIndexByName(pageName);
			if(index >= 0){
				page = pages.getAllPages().get(index);
			}
		}
		
		
		return page;
	}
	
	
	public Page getHeader(){
		return findPageByName(headerPageName);
	}
	
	
	public Page getFooter(){
		return findPageByName(footerPageName);
	}


	public String getName() {
		return name;
	}

	@Override
	public IChapter getTableOfContents() {
		return pages;
	}

	public IChapter getParentChapter(IContentNode node){
		IChapter parent = pages.getParentChapter(node);
		if(parent == null){
			parent = commonPages.getParentChapter(node);
		}
		return parent;
	}


	
}
