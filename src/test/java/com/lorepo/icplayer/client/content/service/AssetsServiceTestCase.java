package com.lorepo.icplayer.client.content.service;

import static org.junit.Assert.assertEquals;

import java.util.ArrayList;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;

import com.lorepo.icplayer.client.content.services.AssetsService;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.model.IAsset;
import com.lorepo.icplayer.client.model.asset.AssetFactory;
import com.lorepo.icplayer.client.module.api.player.IAssetsService;
import com.lorepo.icplayer.client.module.api.player.IContent;

public class AssetsServiceTestCase {
	List<IAsset> assetsList = new ArrayList<IAsset>();
	AssetFactory factory = new AssetFactory();
	IContent mockedContent;
	IAssetsService as;
	
	@Before
	public void setUp () {
		mockedContent = Mockito.mock(Content.class);
	}
	
	@Test
	public void isCorrectContentTypeTest() {
		IAsset asset = factory.createAsset("image", "file/1");
		asset.setContentType("image/svg+xml");
		
		IAsset asset2 = factory.createAsset("image", "file/2");
		asset2.setContentType("image/png");
		
		List<IAsset> assets = new ArrayList<IAsset>();
		
		assets.add(asset);
		assets.add(asset2);
		
		Mockito.when(mockedContent.getAssets()).thenReturn(assets);
		as = new AssetsService(mockedContent);
		
		assertEquals("image/svg+xml", as.getContentType("file/1"));
		assertEquals("image/png", as.getContentType("file/2"));
		assertEquals("", as.getContentType("file/75"));
	}
}
