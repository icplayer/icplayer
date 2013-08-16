package com.lorepo.icplayer.client.module;

import com.lorepo.icplayer.client.module.api.ILayoutDefinition;

public class LayoutDefinition implements ILayoutDefinition{

	private boolean left = true;
	private boolean top = true;
	private boolean right = false;
	private boolean bottom = false;
	private boolean width = true;
	private boolean height = true;
	
	
	@Override
	public boolean hasLeft() {
		return left;
	}

	@Override
	public boolean hasRight() {
		return right;
	}

	@Override
	public boolean hasWidth() {
		return width;
	}

	@Override
	public boolean hasTop() {
		return top;
	}

	@Override
	public boolean hasBottom() {
		return bottom;
	}

	@Override
	public boolean hasHeight() {
		return height;
	}

}
