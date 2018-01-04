package com.lorepo.icplayer.client.model.layout;

public class Size {
	
	private String ID;
	private int width;
	private int height;
	private boolean isDefault = false;

	public Size(String ID, int width, int height) {
		this.ID = ID;
		this.width = width;
		this.height = height;
	}
	
	public static Size getCopy(String layoutID, Size size) {
		return new Size(layoutID, size.width, size.height);
	}
	
	public int getWidth() {
		return this.width;
	}
	
	public int getHeight() {
		return this.height;
	}
	
	public String getID() {
		return this.ID;
	}
	
	public boolean isDefault() {
		return this.isDefault;
	}
	
	public void setWidth(int width) {
		this.width = width;
	}
	
	public void setHeight(int height) {
		this.height = height;
	}
	
	public void setIsDefault(boolean isDefault) {
		this.isDefault = isDefault;
	}

}
