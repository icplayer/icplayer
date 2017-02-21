package com.lorepo.icplayer.client.module;

import java.util.HashMap;

import com.lorepo.icplayer.client.dimensions.ModuleDimensions;

public class SemiResponsivePositions {
	private HashMap<String, ModuleDimensions> positions = new HashMap<String, ModuleDimensions>();
	protected HashMap<String, LayoutDefinition> layoutsDefinitions = new HashMap<String, LayoutDefinition>();
	private final String DEFAULT_LAYOUT_ID = "default";
	private String semiResponsiveID = "default";
	
	public SemiResponsivePositions () {
		this.positions.put(this.DEFAULT_LAYOUT_ID, new ModuleDimensions());
		this.layoutsDefinitions.put(this.DEFAULT_LAYOUT_ID, new LayoutDefinition());
	}
	
	public void addSemiResponsiveDimensions(String name, ModuleDimensions dimensions) {
		this.positions.put(name,  dimensions);
	}
	
	public int getPositionValue(String attribute) {
		ModuleDimensions dimensions = this.positions.get(this.semiResponsiveID);
		return dimensions.getValueByAttributeName(attribute);
	}
	
	public void setPositionValue(String attribute, int value) {
		ModuleDimensions dimensions = this.positions.get(this.semiResponsiveID);
		dimensions.setValueByAttributeName(attribute, value);
		this.positions.put(this.semiResponsiveID, dimensions);
	}
	
	public void setSemiResponsiveLayoutID (String semiResponsiveLayoutID) {
		this.semiResponsiveID = semiResponsiveLayoutID;
		this.ensureLayoutExistsOrFallbackToDefault(semiResponsiveLayoutID);
	}
	
	public void setLayoutDefinition(String layoutSemiResponsiveID, LayoutDefinition layout) {
		this.layoutsDefinitions.put(layoutSemiResponsiveID, layout);
	}
	
	public LayoutDefinition getCurrentLayoutDefinition() {
		return this.layoutsDefinitions.get(this.semiResponsiveID);
	}

	private void ensureLayoutExistsOrFallbackToDefault(String semiResponsiveLayoutID) {
		if (!this.positions.containsKey(semiResponsiveLayoutID)) {
			ModuleDimensions copyOfDefaultDimensions = this.getDefaultDimensionsCopy();
			this.positions.put(semiResponsiveLayoutID, copyOfDefaultDimensions);
		}
		
		if (!this.layoutsDefinitions.containsKey(semiResponsiveLayoutID)) {
			LayoutDefinition copyOfDefaultLayoutDefinition = this.getDefaultLayoutDefinitionCopy();
			this.layoutsDefinitions.put(semiResponsiveLayoutID, copyOfDefaultLayoutDefinition);
		}
	}

	private LayoutDefinition getDefaultLayoutDefinitionCopy() {
		LayoutDefinition layoutDefinition = this.layoutsDefinitions.get(this.DEFAULT_LAYOUT_ID);
		LayoutDefinition copyOfDefaultLayout = LayoutDefinition.copy(layoutDefinition);
		return copyOfDefaultLayout;
	}

	private ModuleDimensions getDefaultDimensionsCopy() {
		ModuleDimensions defaultDimensions = this.positions.get(this.DEFAULT_LAYOUT_ID);
		ModuleDimensions copyOfDefaultDimensions = ModuleDimensions.copy(defaultDimensions);
		return copyOfDefaultDimensions;
	}

	public HashMap<String, ModuleDimensions> getAllLayoutsDefinitions() {
		return this.positions;
	}
}
