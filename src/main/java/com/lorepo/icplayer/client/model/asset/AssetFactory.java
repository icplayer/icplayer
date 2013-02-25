package com.lorepo.icplayer.client.model.asset;

import com.lorepo.icplayer.client.model.IAsset;

public class AssetFactory {

	public IAsset createAsset(String type, String url){
		
		IAsset asset = null;
		
		type = type.toLowerCase();
		if(type.compareTo("audio") == 0){
			asset = new AudioAsset(url);
		}
		else if(type.compareTo("image") == 0){
			asset = new ImageAsset(url);
		}
		else if(type.compareTo("video") == 0){
			asset = new VideoAsset(url);
		}
		else{
			asset = new FileAsset(url);
		}
		
		return asset;
	}
}
