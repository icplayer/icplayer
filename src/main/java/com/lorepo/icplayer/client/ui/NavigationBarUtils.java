package com.lorepo.icplayer.client.ui;


public class NavigationBarUtils {
	public static String getPagePreviewURL(String originalPreviewURL, String baseURL) {
		if (baseURL.startsWith("file://")) {
			return baseURL + originalPreviewURL;
		} else if (originalPreviewURL.matches("^\\.\\.\\/resources\\/[0-9]*\\.[a-zA-Z]+$")) {
			return originalPreviewURL.substring(3);
		}
		
		return originalPreviewURL;
	}

}
