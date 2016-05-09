package com.lorepo.icplayer.client.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.utils.IXMLSerializable;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.model.asset.AssetFactory;
import com.lorepo.icplayer.client.module.api.player.IAddonDescriptor;
import com.lorepo.icplayer.client.module.api.player.IChapter;
import com.lorepo.icplayer.client.module.api.player.IContent;
import com.lorepo.icplayer.client.module.api.player.IContentNode;
import com.lorepo.icplayer.client.module.api.player.IPage;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.xml.IContentBuilder;

public class Content implements IContentBuilder, IContent {

	public enum ScoreType{ first, last }
	
	private static final String COMMONS_FOLDER = "commons/";
	private String name = "";
	private ScoreType scoreType = ScoreType.last; 
	private PageList	pages;
	private PageList	commonPages;
	private HashMap<String, AddonDescriptor>	addonDescriptors = new HashMap<String, AddonDescriptor>();
	private ArrayList<IAsset>	assets = new ArrayList<IAsset>();
	private ArrayList<Integer> pageSubset = new ArrayList<Integer>();
	private HashMap<String, String> styles;
	private HashMap<String, String>	metadata = new HashMap<String, String>();
	private String		baseUrl = "";
	private IContentListener listener;
	private String headerPageName = "commons/header";
	private String footerPageName = "commons/footer";
	private Integer version = 2;
	
	public Content(){
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
	
	public void setScoreType(ScoreType scoreType){
		this.scoreType = scoreType;
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
	
	@Override
	public List<IAsset> getAssets(){
		return assets;
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

	
	public HashMap<String,String> getStyles(){
		return styles;
	}
	

	public void setPageSubset(ArrayList<Integer> pageList){
		if (pageList != null) {
			pageSubset = pageList;
		}
	}


	/**
	 * Convert model into XML
	 * @return
	 */
	public String toXML(){
	
		String xml = "<?xml version='1.0' encoding='UTF-8' ?>"; 

		String escapedName = StringUtils.escapeXML(name);
		xml += "<interactiveContent name='" + escapedName + "' scoreType='" +scoreType + "' version='" + this.version.toString() + "'>";			
		
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

		
		xml += "<styles>";
		if(styles != null){
		    for (String key : styles.keySet()) {
		    	xml += "<style name='" + key + "'>" + StringUtils.escapeHTML(styles.get(key)) + "</style>"; 
		    }
		}
		xml += "</styles>";
		
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

	public IPage getCommonPage(int index) {
		return commonPages.getAllPages().get(index);
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
			JavaScriptUtils.log("znajduje w contencie header z commons folder");
			index = commonPages.findPageIndexByName(commonPageName);
			JavaScriptUtils.log("dostalem index commons");
			JavaScriptUtils.log(index);
			if(index >= 0){
				page = commonPages.getAllPages().get(index);
			}
		}
		else{
			JavaScriptUtils.log("znajduje w pager header z commons folder");
			index = pages.findPageIndexByName(pageName);
			JavaScriptUtils.log("dostalem index pages");
			JavaScriptUtils.log(index);
			if(index >= 0){
				page = pages.getAllPages().get(index);
			}
		}
		
		
		return page;
	}
	
	public int getCommonPageIndex(String pageId) {
	    //  -1 if page not found
		return commonPages.findPageIndexById(pageId);
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

	@Override
	public void setBaseUrl(String url) {
		this.baseUrl = url.substring(0, url.lastIndexOf("/")+1);
		
	}

	@Override
	public void setMetadata(HashMap<String, String> metadata) {
		this.metadata = metadata;
	}

	@Override
	public void setAddonDescriptors(
		HashMap<String, AddonDescriptor> addonDescriptors) {
		
	}

	@Override
	public void setStyles(HashMap<String, String> styles) {
		this.styles = styles;
	}

	@Override
	public void setCommonPages(PageList commonPageList) {
		this.commonPages = commonPageList;
		
	}

	@Override
	public void setPages(PageList pagesList) {
		this.pages = pagesList;
	}

	@Override
	public void setAssets(ArrayList<IAsset> assets) {
		this.assets = assets;
		
	}

	@Override
	public void setName(String name) {
		this.name = name;
	}

	@Override
	public void setHeaderPageName(String name) {
		this.headerPageName = name;
	}

	@Override
	public void setFooterPageName(String name) {
		this.footerPageName = name;
	}
}
