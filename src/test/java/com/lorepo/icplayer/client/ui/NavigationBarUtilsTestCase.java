package com.lorepo.icplayer.client.ui;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

public class NavigationBarUtilsTestCase {
	@Test
	public void pagePreviewIsALinkToPortalFile() {
		String previewURL = NavigationBarUtils.getPagePreviewURL("/file/serve/123456", "http://www.mauthor.com");

		assertEquals("/file/serve/123456", previewURL);
	}
	
	@Test
	public void baseURLHasFileProtocol() {
		String previewURL = NavigationBarUtils.getPagePreviewURL("../resources/123456.png", "file:///C:/Development/WAMP/www/");

		assertEquals("file:///C:/Development/WAMP/www/../resources/123456.png", previewURL);
	}
	
	@Test
	public void pagePreviewPointsToLocalSCORMResourceWithoutExtension() {
		String previewURL = NavigationBarUtils.getPagePreviewURL("../resources/123456", "http://localhost");

		assertEquals("../resources/123456", previewURL);
	}
	
	@Test
	public void pagePreviewPointsToLocalSCORMResourceWithExtension() {
		String previewURL = NavigationBarUtils.getPagePreviewURL("../resources/123456.png", "http://localhost/");

		assertEquals("http://localhost/../resources/123456.png", previewURL);
	}
	
	@Test
	public void pagePreviewPointsToPortalFileThatLooksLikeLocalResorce() {
		String previewURL = NavigationBarUtils.getPagePreviewURL("http://www.mauthor/../resources/123456.png", "http:///www.mauthor.com");

		assertEquals("http://www.mauthor/../resources/123456.png", previewURL);
	}
}