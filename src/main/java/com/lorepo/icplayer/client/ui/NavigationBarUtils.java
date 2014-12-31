package com.lorepo.icplayer.client.ui;


public class NavigationBarUtils {
	public static String getPagePreviewURL(String previewURL, String baseURL) {
		if (baseURL.startsWith("file://") || previewURL.matches("^\\.\\.\\/resources\\/[0-9]*\\.[a-zA-Z]+$")) {
			return baseURL + previewURL;
		}

		return previewURL;
	}
}
