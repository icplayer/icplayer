package com.lorepo.icplayer.client.ui;

public class Ruler {

	private int position;
	private String type;
	private String layoutID = "";

	public Ruler() {}

	public Ruler(String type, int position) {
		this.type = type;
		this.position = position;
	}

	public Ruler(String type, int position, String layoutID) {
		this.type = type;
		this.position = position;
		this.layoutID = layoutID;
	}

	public String toXML() {
		if (layoutID.isEmpty()) {
			return "<" + type +">" + position + "</"+ type +">";
		}
		return "<" + type +">" + position + " " + layoutID + "</"+ type +">";
	}

	public String getType() {
		return type;
	}

	public int getPosition() {
		return position;
	}

	public String getLayoutID() {
		return this.layoutID;
	}

	public void setPosition(int position) {
		this.position = position;
	}

	public void setType(String type) {
		this.type = type;
	}

	public void setLayoutID(String layoutID) {
		this.layoutID = layoutID;
	}
}
