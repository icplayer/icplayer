package com.lorepo.icplayer.client.model.layout;

public class PageLayout implements PageLayoutBuilder{

	public static int MAX_TRESHOLD = 100000;
	private String name;
	private String id;
	private int treshold;
	private String type;
	private String styleID;
	
	public PageLayout(String id, String name) {
		this.id = id;
		this.name = name;
	}

	@Override
	public void setName(String name) {
		this.name = name;
	}

	@Override
	public void setTreshold(int value) {
		this.treshold = value;
	}

	@Override
	public void setType(String type) {
		this.type = type;
	}

	public String getName() {
		return this.name;
	}

	@Override
	public void setCssID(String styleID) {
		this.styleID = styleID;
	}
}
