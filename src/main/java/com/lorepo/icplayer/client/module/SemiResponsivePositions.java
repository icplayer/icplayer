package com.lorepo.icplayer.client.module;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

import com.lorepo.icplayer.client.dimensions.ModuleDimensions;
import com.lorepo.icplayer.client.model.layout.PageLayout;

public class SemiResponsivePositions {
	private HashMap<String, ModuleDimensions> positions = new HashMap<String, ModuleDimensions>();
	protected HashMap<String, LayoutDefinition> layoutsDefinitions = new HashMap<String, LayoutDefinition>();
	private String defaultLayoutID = "default";
	private String semiResponsiveID = "default";
	
	public SemiResponsivePositions () {
		this.positions.put(this.defaultLayoutID, new ModuleDimensions());
		this.layoutsDefinitions.put(this.defaultLayoutID, new LayoutDefinition());
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
	

	public HashMap<String, ModuleDimensions> getAllLayoutsDefinitions() {
		return this.positions;
	}

	public void syncSemiResponsiveLayouts(Set<PageLayout> actualSemiResponsiveLayouts) {
		this.syncDefaultLayoutID(actualSemiResponsiveLayouts);
		this.deleteOldLayouts(actualSemiResponsiveLayouts);
		this.addMissingLayouts(actualSemiResponsiveLayouts);
		this.syncCurrentLayoudID();
	}

	private void syncDefaultLayoutID(Set<PageLayout> actualSemiResponsiveLayouts) {
		for(PageLayout pl : actualSemiResponsiveLayouts) {
			if (pl.isDefault()) {
				String actualDefaultID = pl.getID();
				if (this.defaultLayoutID.compareTo(actualDefaultID) != 0) {
					this.ensureLayoutExistsOrFallbackToDefault(actualDefaultID);
					this.defaultLayoutID = actualDefaultID;
				}
				break;
			}
		}
	}

	private void deleteOldLayouts(Set<PageLayout> actualSemiResponsiveLayouts) {
		Set<String> actualIDs = this.convertToActualLayoutsIDs(actualSemiResponsiveLayouts);
		
		for (String positionID : this.positions.keySet()) {
			if (!actualIDs.contains(positionID)) {
				this.positions.remove(positionID);
			}
		}
		
		for (String layoutID : this.layoutsDefinitions.keySet()) {
			if (!actualIDs.contains(layoutID)) {
				this.layoutsDefinitions.remove(layoutID);
			}
		}
	}
	
	private void addMissingLayouts(Set<PageLayout> actualSemiResponsiveLayouts) {
		for(PageLayout pl : actualSemiResponsiveLayouts) {
			this.ensureLayoutExistsOrFallbackToDefault(pl.getID());
		}
	}
	

	private void syncCurrentLayoudID() {
		if (!this.positions.containsKey(this.semiResponsiveID)) {
			this.semiResponsiveID = this.defaultLayoutID;
		}
	}

	private Set<String> convertToActualLayoutsIDs(
			Set<PageLayout> actualSemiResponsiveLayouts) {
		Set<String> actualIDs = new HashSet<String>();
		for (PageLayout pl : actualSemiResponsiveLayouts) {
			actualIDs.add(pl.getID());
		}
		return actualIDs;
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
		LayoutDefinition layoutDefinition = this.layoutsDefinitions.get(this.defaultLayoutID);
		LayoutDefinition copyOfDefaultLayout = LayoutDefinition.copy(layoutDefinition);
		return copyOfDefaultLayout;
	}

	private ModuleDimensions getDefaultDimensionsCopy() {
		ModuleDimensions defaultDimensions = this.positions.get(this.defaultLayoutID);
		ModuleDimensions copyOfDefaultDimensions = ModuleDimensions.copy(defaultDimensions);
		return copyOfDefaultDimensions;
	}
}
