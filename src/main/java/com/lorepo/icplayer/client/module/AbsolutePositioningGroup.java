package com.lorepo.icplayer.client.module;

public class AbsolutePositioningGroup extends AbsolutePositioningModule{
	
	public AbsolutePositioningGroup(String name) {
		super(name);
		semiResponsivePositions = new GroupSemiResponsivePositions();
	}
	
	
	public void setIsDiv(String name, boolean isDiv) {
		GroupSemiResponsivePositions semi = (GroupSemiResponsivePositions) semiResponsivePositions; 
		semi.setIsDiv(name, isDiv);
	}
	
	public boolean isDiv() {
		GroupSemiResponsivePositions semi = (GroupSemiResponsivePositions) semiResponsivePositions; 
		return semi.isDiv();
	}
	
	public void setIsDiv(boolean isDiv) {
		GroupSemiResponsivePositions semi = (GroupSemiResponsivePositions) semiResponsivePositions; 
		semi.setIsDiv(isDiv);
	}
}
