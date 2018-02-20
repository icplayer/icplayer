package com.lorepo.icplayer.client.dimensions;

public class ModuleDimensions {
	public int left;
	public int right;
	public int top;
	public int bottom;
	public int width;
	public int height;
	
	public ModuleDimensions() {}
	
	public ModuleDimensions(int left, int right, int top, int bottom, int height, int width) {
		this.left = left;
		this.right = right;
		this.top = top;
		this.bottom = bottom;
		this.width = width;
		this.height = height;
	}
	
	public static ModuleDimensions copy(ModuleDimensions dimensions) {
		return new ModuleDimensions(dimensions.left, dimensions.right, dimensions.top, dimensions.bottom, dimensions.height, dimensions.width);
	}

	public int getValueByAttributeName(String attribute) {
		if (attribute.compareTo(DimensionName.LEFT) == 0) {
			return this.left;
		} else if (attribute.compareTo(DimensionName.RIGHT) == 0) {
			return this.right;
		} else if (attribute.compareTo(DimensionName.TOP) == 0) {
			return this.top;
		} else if (attribute.compareTo(DimensionName.BOTTOM) == 0) {
			return this.bottom;
		} else if (attribute.compareTo(DimensionName.WIDTH) == 0) {
			return this.width;
		} else if (attribute.compareTo(DimensionName.HEIGHT) == 0) {
			return this.height;
		}
		
		return 0;
	}

	public void setValueByAttributeName(String attribute, int value) {
		if (attribute.compareTo(DimensionName.LEFT) == 0) {
			this.left = value;
		} else if (attribute.compareTo(DimensionName.RIGHT) == 0) {
			this.right = value;
		} else if (attribute.compareTo(DimensionName.TOP) == 0) {
			this.top = value;
		} else if (attribute.compareTo(DimensionName.BOTTOM) == 0) {
			this.bottom = value;;
		} else if (attribute.compareTo(DimensionName.WIDTH) == 0) {
			this.width = value;;
		} else if (attribute.compareTo(DimensionName.HEIGHT) == 0) {
			this.height = value;;
		}
	}
	
	@Override
	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		
		if (other instanceof ModuleDimensions) {
			ModuleDimensions otherDimension = (ModuleDimensions) other;
			return this.left == otherDimension.left
					&& this.right == otherDimension.right
					&& this.height == otherDimension.height
					&& this.width == otherDimension.width
					&& this.top == otherDimension.top
					&& this.bottom == otherDimension.bottom;
			
		}
		
		return false;
	}
}
