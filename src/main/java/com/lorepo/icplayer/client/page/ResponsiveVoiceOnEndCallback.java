package com.lorepo.icplayer.client.page;

public class ResponsiveVoiceOnEndCallback {
	private String text;
	private String lang;
	
	public ResponsiveVoiceOnEndCallback() {
	}

	public ResponsiveVoiceOnEndCallback(String text, String lang) {
		this.text = text;
		this.lang = lang;
	}
	
	public String getText() {
		return text;
	}
	
	public String getLang() {
		return lang;
	}
}
