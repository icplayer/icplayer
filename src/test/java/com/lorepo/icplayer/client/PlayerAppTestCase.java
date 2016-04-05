//package com.lorepo.icplayer.client;
//
//import org.junit.Test;
//import org.junit.runner.RunWith;
//import org.powermock.core.classloader.annotations.PrepareForTest;
//import org.powermock.modules.junit4.PowerMockRunner;
//
//import com.lorepo.icf.utils.i18n.DictionaryWrapper;
//import com.lorepo.icplayer.client.PlayerApp;
//import com.lorepo.icplayer.client.PlayerEntryPoint;
//
//@RunWith(PowerMockRunner.class)
//@PrepareForTest(DictionaryWrapper.class)
//public class PlayerAppTestCase {
//
//	@Test
//	public void setPagesWithCorrectString() {
//		PlayerEntryPoint entryPoint = new PlayerEntryPoint();
//		PlayerApp player = new PlayerApp("player", entryPoint);
//		player.setPages("1,2");
//	}
//
//	@Test(expected = IllegalArgumentException.class)
//	public void setPagesWithEmptyString() {
//		PlayerEntryPoint entryPoint1 = new PlayerEntryPoint();
//		PlayerApp player = new PlayerApp("player", entryPoint1);
//		player.setPages("");
//	}
//
//	@Test(expected = IllegalArgumentException.class)
//	public void setPagesWithNull() {
//		PlayerEntryPoint entryPoint1 = new PlayerEntryPoint();
//		PlayerApp player = new PlayerApp("player", entryPoint1);
//		player.setPages(null);
//	}
//
//	@Test(expected = IllegalArgumentException.class)
//	public void setPagesWithAlpha() {
//		PlayerEntryPoint entryPoint1 = new PlayerEntryPoint();
//		PlayerApp player = new PlayerApp("player", entryPoint1);
//		player.setPages("1,2a,3");
//	}
//}