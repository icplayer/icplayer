package com.lorepo.icplayer.client.model.layout;

public class Size {
	
	private String id;
	private int width;
	private int height;
	private boolean isDefault = false;

	public Size(String id, int width, int height) {
		this.id = id;
		this.width = width;
		this.height = height;
	}
	
	public static Size copy(String layoutID, Size size) {
		return new Size(layoutID, size.width, size.height);
	}
	
	public int getWidth() {
		return this.width;
	}
	
	public int getHeight() {
		return this.height;
	}
	
	public String getID() {
		return this.id;
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
	
	
	@Override
	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		
		if (other instanceof Size) {
			Size otherSize = (Size) other;
			return (this.id.compareTo(otherSize.getID()) == 0)
					&& this.width == otherSize.getWidth()
					&& this.height == otherSize.getHeight()
					&& this.isDefault == otherSize.isDefault();
		}
		
		return false;
	}
}
