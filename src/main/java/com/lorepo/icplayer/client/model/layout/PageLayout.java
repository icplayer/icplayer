package com.lorepo.icplayer.client.model.layout;

public class PageLayout implements PageLayoutBuilder{

	public static int MAX_RIGHT_TRESHOLD = 10000;
	private String name;
	private int leftTreshold;
	private int rightTreshold;
	private String type;
	
	public PageLayout() {
		// TODO Auto-generated constructor stub
	}

	@Override
	public void setName(String name) {
		this.name = name;
	}

	@Override
	public void setTreshold(int left, int right) {
		this.leftTreshold = left;
		this.rightTreshold = right;
	}

	@Override
	public void setType(String type) {
		this.type = type;
	}

	public String getName() {
		return this.name;
	}
}
