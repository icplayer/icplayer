package com.lorepo.icplayer.client.content.services;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

import com.lorepo.icplayer.client.model.IAsset;
import com.lorepo.icplayer.client.model.asset.FileAsset;
import com.lorepo.icplayer.client.module.api.player.IAssetsService;
import com.lorepo.icplayer.client.module.api.player.IContent;
import com.google.gwt.core.client.JavaScriptObject;
import com.lorepo.icf.utils.JavaScriptUtils;

public class AssetsService implements IAssetsService {
	
	private final List<IAsset> assets;
	
	public AssetsService (IContent content){
		assets = content.getAssets();
	}
	
	@Override
	public String getContentType (String href){
		
		String contentType = "";
		
		for (IAsset asset : assets) {
			if (asset.getHref().equals(href)) {
				contentType = asset.getContentType();
			}
		}

		return contentType;
	}

	@Override
	public List<JavaScriptObject> getAssetsAsJS() {
		List<JavaScriptObject> assetsList = new ArrayList<JavaScriptObject>();
		for (IAsset asset : assets) {
			assetsList.add(this.mapFromAsset(asset));
		}
		return assetsList;
	}

	public JavaScriptObject mapFromAsset(IAsset asset) {
		HashMap<String, String> map = new HashMap<String, String>();

		map.put("fileName", asset.getFileName());
		map.put("type", asset.getContentType());
		map.put("href", asset.getHref());

		return JavaScriptUtils.createHashMap(map);
	}

	public Map<String, FileAsset> getAttachedLibraries() {
		Map<String, FileAsset> addedLibraries = new HashMap<String, FileAsset>();
		for (IAsset asset : assets) {
			String fileName = asset.getFileName();
			if (fileName.endsWith(".min.js")) {
				FileAsset fileAsset = new FileAsset(asset.getHref());
				addedLibraries.put(fileName, fileAsset);
			}
		}

		return addedLibraries;
	} 
}
