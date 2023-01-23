package com.lorepo.icplayer.client.model;

public interface IAsset {

	public String getHref();
	public String getType();
	public String toXML();
	public String getTitle();
	public String getFileName();
	public String getContentType();
	public void setTitle(String title);
	public void setFileName(String name);
	public void setContentType(String type);
	
	public void setOrderNumber(int number);
	public int getOrderNumber();
}
