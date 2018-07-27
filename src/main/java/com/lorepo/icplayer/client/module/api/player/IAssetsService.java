package com.lorepo.icplayer.client.module.api.player;

public interface IAssetsService {
	String getContentType (String href);
	void storeAsset(Object asset, Object callback);
}
