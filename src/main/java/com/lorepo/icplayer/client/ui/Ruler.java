package com.lorepo.icplayer.client.ui;

public class Ruler {

	private int position;
	private String type;

	public Ruler() {}

	public Ruler(String type, int position) {
		this.type = type;
		this.position = position;
	}

	public String toXML() {
		return "<" + type +">" + position + "</"+ type +">";
	}

	public String getType() {
		return type;
	}

	public int getPosition() {
		return position;
	}

	public void setPosition(int position) {
		this.position = position;
	}

	public void setType(String type) {
		this.type = type;
	}
}
