package com.lorepo.icplayer.client.module.api;


public interface IRectangleItem{

	public int	getLeft();
	public int	getTop();
	public int	getWidth();
	public int	getHeight();
	
	public void setLeft(int left);
	public void setTop(int top);
	public void setWidth(int width);
	public void setHeight(int height);
	
	public void disableChangeEvent(boolean disable);

}
