package com.lorepo.icplayer.client.content.services.dto;

public class ScaleInformation{

	public double baseScaleX;
	public double baseScaleY;
	public double scaleX;
	public double scaleY;
	public String transform;
	public String transformOrigin;

	public ScaleInformation() {
		this.baseScaleX = 1.0;
		this.baseScaleY = 1.0;
		this.scaleX = 1.0;
		this.scaleY = 1.0;
		this.transform = "";
		this.transformOrigin = "";
	}
	
	public ScaleInformation(double baseScaleX, double baseScaleY, String transform, String transformOrigin)
	{
		this.baseScaleX = baseScaleX;
		this.baseScaleY = baseScaleY;
		this.scaleX = baseScaleX;
		this.scaleY = baseScaleY;
		this.transform = transform;
		this.transformOrigin = transformOrigin;
	}
	
}
