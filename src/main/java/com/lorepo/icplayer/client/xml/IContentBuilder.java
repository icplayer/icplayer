package com.lorepo.icplayer.client.xml;

import java.util.ArrayList;
import java.util.HashMap;

import com.lorepo.icplayer.client.model.AddonDescriptor;
import com.lorepo.icplayer.client.model.Content.ScoreType;
import com.lorepo.icplayer.client.model.IAsset;
import com.lorepo.icplayer.client.model.PageList;

public interface IContentBuilder {
	public void setBaseUrl(String url);
	public void setMetadata(HashMap<String, String> metadata);
	public void setAddonDescriptors(HashMap<String, AddonDescriptor> addonDescriptors);
	public void setStyles(HashMap<String, String> styles);
	public void setAssets(ArrayList<IAsset> assets);
	public void setScoreType(ScoreType scoreType);
	public void setName(String name);
	public void setPages(PageList pagesList);
	public void setCommonPages(PageList commonPageList);
	public void setHeaderPageName(String name);
	public void setFooterPageName(String name);
}
