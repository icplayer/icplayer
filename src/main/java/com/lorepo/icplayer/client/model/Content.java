package com.lorepo.icplayer.client.model;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.xml.client.Document;
import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.XMLParser;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icplayer.client.model.addon.AddonDescriptor;
import com.lorepo.icplayer.client.model.layout.LayoutsContainer;
import com.lorepo.icplayer.client.model.layout.PageLayout;
import com.lorepo.icplayer.client.model.page.IPageListListener;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.model.page.PageList;
import com.lorepo.icplayer.client.module.api.player.IAddonDescriptor;
import com.lorepo.icplayer.client.module.api.player.IChapter;
import com.lorepo.icplayer.client.module.api.player.IContent;
import com.lorepo.icplayer.client.module.api.player.IContentNode;
import com.lorepo.icplayer.client.module.api.player.IPage;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.xml.content.IContentBuilder;

public class Content implements IContentBuilder, IContent {

	public enum ScoreType { first, last }

	private static final String COMMONS_FOLDER = "commons/";
	private String name = "";
	private ScoreType scoreType = ScoreType.last;
	private PageList	pages;
	private PageList	commonPages;
	private HashMap<String, AddonDescriptor>	addonDescriptors = new HashMap<String, AddonDescriptor>();
	private ArrayList<IAsset>	assets = new ArrayList<IAsset>();
	private HashMap<String, String>	metadata = new HashMap<String, String>();
	private String		baseUrl = "";
	private IContentListener listener;
	private String headerPageName = "commons/header";
	private String footerPageName = "commons/footer";

	private HashMap<String, CssStyle> styles = new HashMap<String, CssStyle>();
	private LayoutsContainer layoutsContainer = new LayoutsContainer();

	private int maxPagesCount = 100;
	private String version = "2";

	public Content(){
		this.pages = new PageList("root");
		this.commonPages = new PageList("commons");
		this.connectHandlers();
	}

	public void setPlayerController(IPlayerServices ps) {
		pages.setPlayerServices(ps);
	}

	public void connectHandlers() {
		pages.addListener(new IPageListListener() {
			@Override
			public void onNodeRemoved(IContentNode node, IChapter parent) {
				if(listener != null){
					listener.onRemovePage(node, parent);
				}
			}

			@Override
			public void onNodeMoved(IChapter source, int from, int to) {
				if(listener != null){
					listener.onPageMoved(source, from, to);
				}
			}

			@Override
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
			@Override
			public void onNodeRemoved(IContentNode node, IChapter parent) {
				if(listener != null){
					listener.onRemovePage(node, parent);
				}
			}
			@Override
			public void onNodeMoved(IChapter source, int from, int to) {
			}
			@Override
			public void onNodeAdded(IContentNode node) {
				if(listener != null){
					listener.onAddPage(node);
				}
			}
			@Override
			public void onChanged(IContentNode source) {
			}
		});
	}

	@Override
	public PageList getPagesList() {
		return this.pages;
	}

	@Override
	public PageList getCommonPagesList() {
		return this.commonPages;
	}

	public ScoreType getScoreType(){
		return scoreType;
	}

	public void setScoreType(ScoreType scoreType){
		this.scoreType = scoreType;
	}

	public void addChangeListener(IContentListener l){
		this.listener = l;
	}


	public HashMap<String,AddonDescriptor>	getAddonDescriptors(){
		return addonDescriptors;
	}


	public PageList	getPages(){
		return pages;
	}

	public boolean addonIsLoaded(String addonName) {
		if(this.addonDescriptors.containsKey(addonName)) {
			return true;
		}
		return false;
	}
	public int getMaxPagesCount() {
		return maxPagesCount;
	}

	@Override
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


	public String getMetadataValue(String key) {
		return metadata.get(key);
	}


	public HashMap<String,CssStyle> getStyles() {
		return new HashMap<String, CssStyle>(this.styles);
	}

	public CssStyle getStyle(String cssStyleID) {
		return this.styles.get(cssStyleID);
	}

    public void setMetadataValue(String key, String value){

		if(value == null || value.length() == 0){
			metadata.remove(key);
		}
		else{
			metadata.put(key, value);
		}
	}


	public void setPageSubset(ArrayList<Integer> pageList){
		if (pageList != null) {
		}
	}

	/**
	 * Convert model into XML
	 * @return
	 */
	public String toXML(){

		String xml = "<?xml version='1.0' encoding='UTF-8' ?>";
		String escapedName = StringUtils.escapeXML(name);
		xml += "<interactiveContent name='" + escapedName + "' scoreType='" +scoreType + "\'";
		xml += " version=\"" + this.version + "\">";

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
		for(CssStyle style : styles.values()) {
			Element cssStyle = style.toXML();
			xml += cssStyle.toString();
		}
		xml += "</styles>";

		Document xmlDocument = XMLParser.createDocument();
		Element layouts = xmlDocument.createElement("layouts");
		for(PageLayout pageLayout : layoutsContainer.getLayouts().values()) {
			Element pl = pageLayout.toXML();
			layouts.appendChild(pl);
		}
		xml += layouts.toString();

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
	public List<Page> getAllPages() {
		return pages.getAllPages();
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

	public int getCommonPageIndex(String pageId) {
	    //  -1 if page not found
		return commonPages.findPageIndexById(pageId);
	}

	
	public Page getDefaultHeader(){
		return findPageByName(this.headerPageName);
	}


	public Page getDefaultFooter(){
		return findPageByName(this.footerPageName);
	}
	
	public ArrayList<Page> getHeaders() {
		ArrayList<String> headers = this.getCommonPagesIdsStartingWith("header");
		ArrayList<Page> pages = new ArrayList<Page>();
		
		for (String id : headers) {
			pages.add(this.getCommonPageById(id));
		}
		
		return pages;
	}
	
	public ArrayList<Page> getFooters() {
		ArrayList<String> footers = this.getCommonPagesIdsStartingWith("footer");
		ArrayList<Page> pages = new ArrayList<Page>();
		
		for (String id : footers) {
			pages.add(this.getCommonPageById(id));
		}
		
		return pages;
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
        this.pages.setBaseURL(this.baseUrl);
	}

	@Override
	public void setMetadata(HashMap<String, String> metadata) {
		this.metadata = metadata;
	}

	@Override
	public void setAddonDescriptors (HashMap<String, AddonDescriptor> addonDescriptors) {
		this.addonDescriptors = addonDescriptors;
	}

	@Override
	public void setStyles(HashMap<String, CssStyle> styles) {
		this.styles = styles;
	}

	public void setStyle(CssStyle style) {
		this.styles.put(style.id, style);
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

	@Override
	public void setCommonPages(PageList commonPageList) {
		this.commonPages = commonPageList;
	}

	@Override
	public void addLayout(PageLayout pageLayout) {
		this.layoutsContainer.addLayout(pageLayout);
	}

    public HashMap<String, Integer> getPageWeights() {
		HashMap<String, Integer> weights = new HashMap<String, Integer>();

		for(IPage page : getPages().getAllPages()) {
			weights.put(page.getId(), page.getPageWeight());
		}

		return weights;
	}

	public boolean isPageLimitExceeded() {
		if(getPageCount() + getCommonPages().size() > getMaxPagesCount())
			return true;
		return false;
	}

	public String getActualStyleID() {
		return this.layoutsContainer.getActualLayoutStyleID();
	}

	public String getActualStyle() {
		CssStyle style = styles.get(this.getActualStyleID());

		if (style == null) {
			return this.getDefaultCssStyle().getValue();
		}

		return style.getValue();
	}

	public CssStyle getDefaultCssStyle() {
		for(CssStyle contentStyle : this.styles.values()) {
			if (contentStyle.isDefault()) {
				return contentStyle;
			}
		}

		return null;
	}

	public void removeFromLayoutsStyle(CssStyle styleToDelete) {
		this.layoutsContainer.removeFromLayoutsStyle(styleToDelete, this.styles);
	}

	public  HashMap<String, PageLayout> getLayouts() {
		return this.layoutsContainer.getLayouts();
	}

	public void setSemiResponsiveLayouts(HashMap<String, PageLayout> layouts) {
		this.layoutsContainer.setPageLayouts(layouts);
	}

	public Set<PageLayout> getActualSemiResponsiveLayouts() {
		HashMap<String, PageLayout> layoutsContainer = this.getLayouts();
		Collection<PageLayout> layouts = layoutsContainer.values();
		Set<PageLayout> setsLayouts = new HashSet<PageLayout>(layouts);
		return setsLayouts;
	}

	public String getDefaultSemiResponsiveLayoutID() {
		return this.layoutsContainer.getDefaultSemiResponsiveLayoutID();
	}

	public void setDefaultSemiResponsiveLayout(String newDefaultLayoutID) {
		this.layoutsContainer.setDefaultSemiResponsiveLayout(newDefaultLayoutID);
	}

	@Override
	public boolean setActualLayoutID(String id) {
		return this.layoutsContainer.setActualLayoutID(id);
	}

	public void setDefaultCSSStyle(String cssStyleID) {
		for (CssStyle style : this.styles.values()) {
			if (style.getID().compareTo(cssStyleID) == 0) {
				style.setIsDefault(true);
			} else {
				style.setIsDefault(false);
			}
		}
	}

	public String getActualSemiResponsiveLayoutID() {
		return this.layoutsContainer.getActualSemiResponsiveLayoutID();
	}

	public JavaScriptObject getSemiResponsiveLayoutsAsJS() {
		return this.layoutsContainer.toJS();
	}

	public boolean isSemiResponsiveContent() {
		return this.styles.size() > 1 || this.layoutsContainer.getLayouts().size() > 1;
	}
	
	public ArrayList<String> getCommonPagesIdsStartingWith(String prefix){
		ArrayList<String> pages = new ArrayList<String>();
		prefix = prefix.toLowerCase();
		
		for (Page page : commonPages.getAllPages()) {
			String name = page.getName().toLowerCase();
			if (name.startsWith(prefix)) {
				pages.add(page.getId());
			}
		}
		
		return pages;
	}
	
	public Page getCommonPageById(String id) {
        for (Page page : this.commonPages.getAllPages()) {
            if (page.getId().equals(id)) {
                return page;
            }
        }
        return null;
    }
	
	public Page getHeader(Page page) {
		Page header = this.getCommonPageById(page.getHeaderId());
		if (header == null) {
			return this.getDefaultHeader();
		}
		return header;
	}
	
	public Page getFooter(Page page) {
		Page footer = this.getCommonPageById(page.getFooterId());
		if (footer == null) {
			return this.getDefaultFooter();
		}
		return footer;
	}
}
