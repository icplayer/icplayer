package com.lorepo.icplayer.client.model.page.properties;


public class OutstretchHeightData {
	public int y;
	public int height;
	public boolean dontMoveModules;
	public String layoutName;
	
	public OutstretchHeightData(int y, int height, boolean dontMoveModules, String layoutName) {
		this.y = y;
		this.height = height;
		this.dontMoveModules = dontMoveModules;
		this.layoutName = layoutName;
	}
}
