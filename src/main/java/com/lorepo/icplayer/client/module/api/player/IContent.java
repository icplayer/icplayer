package com.lorepo.icplayer.client.module.api.player;

import java.util.HashMap;
import java.util.List;

import com.lorepo.icplayer.client.model.IAsset;
import com.lorepo.icplayer.client.model.page.Page;

public interface IContent {

    public int getPageCount();
    public IPage getPage(int index);
    public IPage getPageById(String id);
    public IAddonDescriptor getAddonDescriptor(String addonId);
    public Page findPageByName(String pageName);
    public String getBaseUrl();
    public String getMetadataValue(String key);
    public IChapter getTableOfContents();
    public IChapter getCommonPages();
    public List<IAsset> getAssets();
	public IPage getCommonPage(int index);
	public int getCommonPageIndex(String pageId);
	public List<Integer> getPagesMapping();
	List<Page> getAllPages();
	public String getActualSemiResponsiveLayoutName();
}
