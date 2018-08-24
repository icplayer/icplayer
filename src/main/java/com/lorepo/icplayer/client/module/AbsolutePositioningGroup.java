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
	
	public void setIsModificatedHeight(String name, boolean isModificatedHeight) {
		GroupSemiResponsivePositions semi = (GroupSemiResponsivePositions) semiResponsivePositions; 
		semi.setIsModificatedHeight(name, isModificatedHeight);
	}
	
	public boolean isModificatedHeight() {
		GroupSemiResponsivePositions semi = (GroupSemiResponsivePositions) semiResponsivePositions; 
		return semi.isModificatedHeight();
	}
	
	public void setIsModificatedHeight(boolean setIsModificatedHeight) {
		GroupSemiResponsivePositions semi = (GroupSemiResponsivePositions) semiResponsivePositions; 
		semi.setIsModificatedHeight(setIsModificatedHeight);
	}
	
	public void setIsModificatedWidth(String name, boolean setIsModificatedHeight) {
		GroupSemiResponsivePositions semi = (GroupSemiResponsivePositions) semiResponsivePositions; 
		semi.setIsModificatedWidth(name, setIsModificatedHeight);
	}
	
	public boolean isModificatedWidth() {
		GroupSemiResponsivePositions semi = (GroupSemiResponsivePositions) semiResponsivePositions; 
		return semi.isModificatedWidth();
	}
	
	public void setIsModificatedWidth(boolean setIsModificatedHeight) {
		GroupSemiResponsivePositions semi = (GroupSemiResponsivePositions) semiResponsivePositions; 
		semi.setIsModificatedWidth(setIsModificatedHeight);
	}
}
