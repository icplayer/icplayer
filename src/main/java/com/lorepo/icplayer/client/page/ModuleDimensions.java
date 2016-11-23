package com.lorepo.icplayer.client.page;

public class ModuleDimensions {
	int left;
	int right;
	int width;
	int top;
	int bottom;
	int height;
	
	public ModuleDimensions(int left, int right, int top, int bottom, int height, int width) {
		this.left = left;
		this.right = right;
		this.top = top;
		this.bottom = bottom;
		this.width = width;
		this.height = height;
	}
	
	public static ModuleDimensions copy(ModuleDimensions dimensions) {
		return new ModuleDimensions(dimensions.left, dimensions.right, dimensions.top, dimensions.bottom, 
				dimensions.height, dimensions.width);
	}
}
