package com.lorepo.icplayer.client.model.page;

import com.google.gwt.core.client.JavaScriptObject;

// basic model with needed properties for adaptive lesson purposes
public class AdaptivePage {
	private String ID;
	private String name;
	private String previewImageURL;
	
	public AdaptivePage(String ID, String name, String previewImageURL) {
		this.ID = ID;
		this.name = name;
		this.previewImageURL = previewImageURL;
	}
	
	public AdaptivePage(Page page) {
		this.ID = page.getId();
		this.name = page.getName();
		this.previewImageURL = page.getPreview();
	}
	
	public String getID() {
		return this.ID;
	}
	
	public String getPreviewImageURL() {
		return this.previewImageURL;
	}
	
	public String getName() {
		return this.name;
	}
	
	public JavaScriptObject getAsJSObject() {
		return this.createJSObject(this.name, this.previewImageURL);
	}
	
	private native JavaScriptObject createJSObject(String pageName, String previewURL) /*-{
		return {
			name: pageName,
			preview: previewURL
		}
	}-*/;

}
