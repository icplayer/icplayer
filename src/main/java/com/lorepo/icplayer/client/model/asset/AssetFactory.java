package com.lorepo.icplayer.client.model.asset;

import com.lorepo.icplayer.client.model.IAsset;

public class AssetFactory {
	
	private int orderNumber = 0;

	public IAsset createAsset(String type, String url) {


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
		else if(type.compareTo("script") == 0){
			asset = new ScriptAsset(url);
		}
		else if(type.compareTo("module-script") == 0){
			asset = new ScriptAsset(url, true);
		}
		else {
			asset = new FileAsset(url);
		}
		
		asset.setOrderNumber(this.orderNumber);
		this.orderNumber++;
		
		return asset;
	}
}
