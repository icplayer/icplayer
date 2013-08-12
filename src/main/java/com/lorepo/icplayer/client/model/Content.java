package com.lorepo.icplayer.client.model;

import java.util.ArrayList;
import java.util.HashMap;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.model.asset.AssetFactory;
import com.lorepo.icplayer.client.module.api.player.IAddonDescriptor;
import com.lorepo.icplayer.client.module.api.player.IContent;
import com.lorepo.icplayer.client.module.api.player.IPage;
import com.lorepo.icplayer.client.utils.IXMLSerializable;

/**
 * Model reprezentujący główny plik startowy.
 * 
 * @author Krzysztof Langner
 *
 */
public class Content implements IXMLSerializable, IContent {

	private static final String COMMONS_FOLDER = "commons/";
	private String name = "";
	private PageList	pages;
	private PageList	commonPages;
	private HashMap<String, AddonDescriptor>	addonDescriptors = new HashMap<String, AddonDescriptor>();
	private ArrayList<IAsset>	assets = new ArrayList<IAsset>();
	private String styles;
	private HashMap<String, String>	metadata = new HashMap<String, String>();
	private String		baseUrl = "";
	private IContentListener listener;
	private String headerPageName = "commons/header";
	private String footerPageName = "commons/footer";
	
	
	public Content(){
		
		pages = new PageList();
		commonPages = new PageList();
		connectHandlers();
	}


	private void connectHandlers() {
		
		pages.addListener(new IPageListListener() {
			public void onPageRemoved(Page page) {
				if(listener != null){
					listener.onRemovePage(page);
				}
			}
			public void onPageMoved(int from, int to) {
			}
			public void onPageAdded(Page page) {
				if(listener != null){
					listener.onAddPage(page);
				}
			}
		});
		
		commonPages.addListener(new IPageListListener() {
			public void onPageRemoved(Page page) {
				if(listener != null){
					listener.onRemovePage(page);
				}
			}
			public void onPageMoved(int from, int to) {
			}
			public void onPageAdded(Page page) {
				if(listener != null){
					listener.onAddPage(page);
				}
			}
		});
		
	}
	
	
	/**
	 * Add content listener
	 * @param l
	 */
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
	
	
	public void movePage(int from, int to, boolean rootPages){
		
		if(rootPages){
			
			if(from < pages.size() && to < pages.size()){
				
				Page page = pages.remove(from);
				pages.add(to, page);
				if(listener != null){
					listener.onPageMove(from, to);
				}
			}
		}
		else{

			if(from < commonPages.size() && to < commonPages.size()){
				
				Page page = commonPages.remove(from);
				commonPages.add(to, page);
				if(listener != null){
					listener.onPageMove(from, to);
				}
			}
		}
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


	
	public void load(Element rootElement, String url) {

		baseUrl = url.substring(0, url.lastIndexOf("/")+1);

		name = XMLUtils.getAttributeAsString(rootElement, "name");
		name = StringUtils.unescapeXML(name);
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
					loadPages(child, pages);
				}
				else if(name.compareTo("assets") == 0){
					loadAssets(child);
				}
			}
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


	private void loadPages(Element rootElement, PageList pageList) {
		
		NodeList children = rootElement.getChildNodes();
		
		for(int i = 0; i < children.getLength(); i++){
	
			if(children.item(i) instanceof Element){
				Element node = (Element)children.item(i);
				if(node.getNodeName().compareTo("page") == 0){
					Page page = loadPage(node);
					pageList.add(page);
				}
				else if(node.getNodeName().compareTo("folder") == 0){
					loadCommons(node);
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


	private Page loadPage(Element node) {

		String name = StringUtils.unescapeXML(node.getAttribute("name"));
		String href = node.getAttribute("href");
		String pageId = node.getAttribute("id");
		String preview = XMLUtils.getAttributeAsString(node, "preview");
		boolean reportable = XMLUtils.getAttributeAsBoolean(node, "reportable", true);
		Page page = new Page(name, href);
		if(pageId != null && pageId.length() > 0 && !pageId.equals("null")){
			page.setId(pageId);
		}
		page.setReportable(reportable);
		page.setPreview(preview);
		return page;
	}


	private void loadCommons(Element element) {
		loadPages(element, commonPages);
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
		xml += "<interactiveContent name='" + escapedName + "'>";			
		
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
		for(Page page : pages){
			xml += toXMLPage(page);
		}
		
		if(commonPages.size() > 0){
			
			xml += "<folder name='commons'>";
			for(Page page : commonPages){
				xml += toXMLPage(page);
			}
			
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


	private String toXMLPage(Page page) {
		
		String name = StringUtils.escapeXML(page.getName());
		String href = StringUtils.escapeXML(page.getHref());
		String preview = StringUtils.escapeXML(page.getPreview());
		String xml = "<page id='" + page.getId() + "' name='" + name + "'" + 
				" href='" + href + "' preview='" + preview + "'";
		if(page.isReportable()){
			xml += " reportable='true'/>";
		}
		else{
			xml += " reportable='false'/>";
		}
		return xml;
	}


	@Override
	public int getPageCount() {
		return pages.size();
	}


	@Override
	public IPage getPage(int index) {
		return pages.get(index);
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
				page = commonPages.get(index);
			}
		}
		else{
			index = pages.findPageIndexByName(pageName);
			if(index >= 0){
				page = pages.get(index);
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
	
}
