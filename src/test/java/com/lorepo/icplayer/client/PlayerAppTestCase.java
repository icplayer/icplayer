package com.lorepo.icplayer.client;

import org.junit.Test;
import org.junit.Ignore;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.powermock.reflect.Whitebox;

import com.googlecode.gwt.test.GwtModule;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.PlayerApp;
import com.lorepo.icplayer.client.PlayerEntryPoint;
import com.lorepo.icplayer.client.content.services.PlayerServices;
import com.lorepo.icplayer.client.model.asset.FileAsset;
import com.lorepo.icplayer.client.content.services.AssetsService;

import java.lang.reflect.*;
import java.util.HashMap;
import java.util.Map;
@GwtModule("com.lorepo.icplayer.Icplayer")
public class PlayerAppTestCase {

	@Test
	public void setPagesWithCorrectString() {
		PlayerEntryPoint entryPoint = new PlayerEntryPoint();
		PlayerApp player = new PlayerApp("player", entryPoint);
		player.setPages("1,2");
	}

	@Test(expected = IllegalArgumentException.class)
	public void setPagesWithEmptyString() {
		PlayerEntryPoint entryPoint1 = new PlayerEntryPoint();
		PlayerApp player = new PlayerApp("player", entryPoint1);
		player.setPages("");
	}

	@Test(expected = IllegalArgumentException.class)
	public void setPagesWithNull() {
		PlayerEntryPoint entryPoint1 = new PlayerEntryPoint();
		PlayerApp player = new PlayerApp("player", entryPoint1);
		player.setPages(null);
	}

	@Test(expected = IllegalArgumentException.class)
	public void setPagesWithAlpha() {
		PlayerEntryPoint entryPoint1 = new PlayerEntryPoint();
		PlayerApp player = new PlayerApp("player", entryPoint1);
		player.setPages("1,2a,3");
	}
	
	@Test
	public void updateLayoutTest() {
		PlayerApp appMock = Mockito.mock(PlayerApp.class);
		Mockito.doCallRealMethod().when(appMock).updateLayout();
		String lastSentLayout = "1234";
		Whitebox.setInternalState(appMock, "lastSentLayoutID", lastSentLayout);
		appMock.updateLayout();
		Mockito.verify(appMock, Mockito.times(1)).changeLayout(lastSentLayout);
	}

	@Ignore
	@Test
	// mocked assets service occures null - to correct
	public void loadAttachedLibrariesTest() throws InvocationTargetException, IllegalAccessException, NoSuchMethodException {
		PlayerController playerControllerMock = Mockito.mock(PlayerController.class);
		PlayerEntryPoint entryPoint1 = new PlayerEntryPoint();
		PlayerApp player = new PlayerApp("player", entryPoint1);
		Method method = this.getLoadAttachedLibraries(player);
		FileAsset asset = new FileAsset("test/url");
		Map<String, FileAsset> libraries = new HashMap<String, FileAsset>();
		AssetsService assetsService = Mockito.mock(AssetsService.class);
		libraries.put("Test", asset);

		Mockito.when(playerControllerMock.getAssetsService()).thenReturn(assetsService);
		Mockito.when(assetsService.getAttachedLibraries()).thenReturn(libraries);
		
		method.invoke(player);
	}

	private Method getLoadAttachedLibraries(PlayerApp player) throws NoSuchMethodException {
		Method method = player.getClass().getDeclaredMethod("loadAttachedLibraries");
		method.setAccessible(true);

		return method;
	}
}