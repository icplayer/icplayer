package com.lorepo.icplayer.client.module;

public class AbsolutePositioningGroup extends AbsolutePositioningModule{
	private GroupSemiResponsivePositions semi; 
	
	
	public AbsolutePositioningGroup(String name) {
		super(name);
		semiResponsivePositions = new GroupSemiResponsivePositions();
		this.semi = (GroupSemiResponsivePositions) semiResponsivePositions; 
	}
	
	public void setIsDiv(String name, boolean isDiv) {
		semi.setIsDiv(name, isDiv);
	}
	
	public boolean isDiv() {
		return semi.isDiv();
	}
	
	public void setIsDiv(boolean isDiv) {
		semi.setIsDiv(isDiv);
	}
	
	public void setIsModificatedHeight(String name, boolean isModificatedHeight) {
		semi.setIsModificatedHeight(name, isModificatedHeight);
	}
	
	public boolean isModificatedHeight() {
		return semi.isModificatedHeight();
	}
	
	public void setIsModificatedHeight(boolean setIsModificatedHeight) {
		semi.setIsModificatedHeight(setIsModificatedHeight);
	}
	
	public void setIsModificatedWidth(String name, boolean setIsModificatedHeight) {
		semi.setIsModificatedWidth(name, setIsModificatedHeight);
	}
	
	public boolean isModificatedWidth() {
		return semi.isModificatedWidth();
	}
	
	public void setIsModificatedWidth(boolean setIsModificatedHeight) {
		semi.setIsModificatedWidth(setIsModificatedHeight);
	}
}
