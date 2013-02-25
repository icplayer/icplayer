package com.lorepo.icplayer.client.module.api;

public interface IStateful {

	public String getSerialId();	
	public String getState();
	public void setState(String state);
}
