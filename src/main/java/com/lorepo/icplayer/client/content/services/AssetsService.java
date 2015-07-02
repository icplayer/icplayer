package com.lorepo.icplayer.client.content.services;

import java.util.List;
import com.lorepo.icplayer.client.model.IAsset;
import com.lorepo.icplayer.client.module.api.player.IAssetsService;
import com.lorepo.icplayer.client.module.api.player.IContent;

public class AssetsService implements IAssetsService{
	
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
}
