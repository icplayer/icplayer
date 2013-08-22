package com.lorepo.icplayer.client.module.api;

public interface ILayoutDefinition {

	enum Property{
		left, top, right, bottom
	}
	boolean hasLeft();
	boolean hasRight();
	boolean hasWidth();
	boolean hasTop();
	boolean hasBottom();
	boolean hasHeight();
	String getLeftRelativeTo();
	Property getLeftRelativeToProperty();
	String getTopRelativeTo();
	Property getTopRelativeToProperty();
	String getRightRelativeTo();
	Property getRightRelativeToProperty();
	String getBottomRelativeTo();
	Property getBottomRelativeToProperty();
}
