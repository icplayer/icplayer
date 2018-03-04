package com.lorepo.icplayer.client.content.services.dto;

import com.google.gwt.core.client.JavaScriptObject;

public class ScaleInformation{

	public double scaleX;
	public double scaleY;
	public String transform;
	public String transformOrigin;
	
	public ScaleInformation() {
		this.scaleX = 1.0;
		this.scaleY = 1.0;
		this.transform = "";
		this.transformOrigin = "";
	}
	public ScaleInformation(double scaleX, double scaleY, String transform, String transformOrigin){
		this.scaleX = scaleX;
		this.scaleY = scaleY;
		this.transform = transform;
		this.transformOrigin = transformOrigin;
	}
	
}
