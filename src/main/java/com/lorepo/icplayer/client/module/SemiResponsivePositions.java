package com.lorepo.icplayer.client.module;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

import com.google.gwt.xml.client.Document;
import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.XMLParser;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icplayer.client.dimensions.ModuleDimensions;
import com.lorepo.icplayer.client.model.layout.PageLayout;

public class SemiResponsivePositions {
	protected HashMap<String, ModuleDimensions> positions = new HashMap<String, ModuleDimensions>();
	protected HashMap<String, LayoutDefinition> layoutsDefinitions = new HashMap<String, LayoutDefinition>();
	protected HashMap<String, Boolean> isLocked = new HashMap<String, Boolean>();
	protected HashMap<String, Boolean> isModuleVisibleInEditor = new HashMap<String, Boolean>();
	protected boolean isVisible = true;
	
	protected String defaultLayoutID = "default";
	protected String semiResponsiveID = "default";
	
	public SemiResponsivePositions () {
		this.positions.put(this.defaultLayoutID, new ModuleDimensions());
		this.layoutsDefinitions.put(this.defaultLayoutID, new LayoutDefinition());
		this.isLocked.put(this.semiResponsiveID, false);
		this.isModuleVisibleInEditor.put(this.semiResponsiveID, true);
	}
	
	public void addSemiResponsiveDimensions(String name, ModuleDimensions dimensions) {
		this.positions.put(name, dimensions);
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
	
	public void setPositionValue(String idLayout, String attribute, int value) {
		ModuleDimensions dimensions = this.positions.get(this.semiResponsiveID);
		dimensions.setValueByAttributeName(attribute, value);
		this.positions.put(idLayout, dimensions);
	}

	public void setSemiResponsiveLayoutID (String semiResponsiveLayoutID) {
		this.semiResponsiveID = semiResponsiveLayoutID;
		this.ensureLayoutExistsOrFallbackToDefault(semiResponsiveLayoutID);
	}
	
	public String getSemiResponsiveLayoutID () {
		return this.semiResponsiveID;
	}
	
	public String getDefaultSemiResponsiveLayoutID() {
		return this.defaultLayoutID;
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
		this.syncCurrentLayoutID();
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

	protected void deleteOldLayouts(Set<PageLayout> actualSemiResponsiveLayouts) {
		Set<String> actualIDs = this.convertToActualLayoutsIDs(actualSemiResponsiveLayouts);
		
		this.removeOldKeysFromHashMap(actualIDs, this.positions);
		this.removeOldKeysFromHashMap(actualIDs, this.layoutsDefinitions);
		this.removeOldKeysFromHashMap(actualIDs, this.isLocked);
		this.removeOldKeysFromHashMap(actualIDs, this.isModuleVisibleInEditor);
	}

	protected void removeOldKeysFromHashMap(Set<String> actualIDs, HashMap<String, ?> hashmap) {
		for (String key : hashmap.keySet()) {
			if(!actualIDs.contains(key)) {
				hashmap.remove(key);
			}
		}
	}
	
	private void addMissingLayouts(Set<PageLayout> actualSemiResponsiveLayouts) {
		for(PageLayout pl : actualSemiResponsiveLayouts) {
			this.ensureLayoutExistsOrFallbackToDefault(pl.getID());
		}
	}
	

	private void syncCurrentLayoutID() {
		if (!this.positions.containsKey(this.semiResponsiveID)) {
			this.semiResponsiveID = this.defaultLayoutID;
		}
	}

	protected Set<String> convertToActualLayoutsIDs(Set<PageLayout> actualSemiResponsiveLayouts) {
		Set<String> actualIDs = new HashSet<String>();
		for (PageLayout pl : actualSemiResponsiveLayouts) {
			actualIDs.add(pl.getID());
		}
		return actualIDs;
	}

	protected void ensureLayoutExistsOrFallbackToDefault(String semiResponsiveLayoutID) {
		if (!this.positions.containsKey(semiResponsiveLayoutID)) {
			ModuleDimensions copyOfDefaultDimensions = this.getDimensionsCopy(this.defaultLayoutID);
			this.positions.put(semiResponsiveLayoutID, copyOfDefaultDimensions);
		}
		
		if (!this.layoutsDefinitions.containsKey(semiResponsiveLayoutID)) {
			LayoutDefinition copyOfDefaultLayoutDefinition = this.getLayoutDefinitionCopy(this.defaultLayoutID);
			this.layoutsDefinitions.put(semiResponsiveLayoutID, copyOfDefaultLayoutDefinition);
		}
		
		this.ensureDefaultValueInBooleanHashMap(semiResponsiveLayoutID, this.isLocked);
		this.ensureDefaultValueInBooleanHashMap(semiResponsiveLayoutID, this.isModuleVisibleInEditor);
	}

	protected void ensureDefaultValueInBooleanHashMap(String semiResponsiveLayoutID, HashMap<String, Boolean> hashmap) {
		if (!hashmap.containsKey(semiResponsiveLayoutID)) {
			hashmap.put(semiResponsiveLayoutID, hashmap.get(this.defaultLayoutID));
		}
	}

	private LayoutDefinition getLayoutDefinitionCopy(String layoutID) {
		LayoutDefinition layoutDefinition = this.layoutsDefinitions.get(layoutID);
		LayoutDefinition copyOfDefaultLayout = LayoutDefinition.copy(layoutDefinition);
		return copyOfDefaultLayout;
	}

	private ModuleDimensions getDimensionsCopy(String layoutID) {
		ModuleDimensions layoutDimensions = this.positions.get(layoutID);
		ModuleDimensions copyOfDefaultDimensions = ModuleDimensions.copy(layoutDimensions);
		return copyOfDefaultDimensions;
	}

	public boolean isModuleInEditorVisible() {
		return this.isModuleVisibleInEditor.get(this.semiResponsiveID);
	}

	public boolean isVisible() {
		return this.isVisible;
	}

	public boolean isLocked() {
		return this.isLocked.get(this.semiResponsiveID);
	}

	public void setIsVisible(Boolean isVisible) {
		this.isVisible = isVisible;
	}

	public void setIsLocked(Boolean isLocked) {
		this.isLocked.put(semiResponsiveID, isLocked);
	}

	public void setIsVisibleInEditor(Boolean isVisibleInEditor) {
		this.isModuleVisibleInEditor.put(this.semiResponsiveID, isVisibleInEditor);
	}

	public void setIsLocked(String layoutID, boolean isLocked) {
		this.isLocked.put(layoutID, isLocked);
	}

	public void setIsVisibleInEditor(String layoutID, boolean isVisibleInEditor) {
		this.isModuleVisibleInEditor.put(layoutID, isVisibleInEditor);
	}

	public void lock(boolean state) {
		this.isLocked.put(this.semiResponsiveID, state);
	}

	public Element toXML() {
		Document doc = XMLParser.createDocument();
		Element layouts = doc.createElement("layouts");
		XMLUtils.setBooleanAttribute(layouts, "isVisible", this.isVisible);

		for(String layoutID : this.positions.keySet()) {
			Element layout = doc.createElement("layout");
			layout.setAttribute("isLocked", this.isLocked.get(layoutID).toString());
			layout.setAttribute("isModuleVisibleInEditor", this.isModuleVisibleInEditor.get(layoutID).toString());
			layout.setAttribute("id", layoutID);
			layout.appendChild(this.layoutsDefinitions.get(layoutID).toXML());
			layout.appendChild(this.getAbsolutePositionsXML(layoutID, doc));
			layouts.appendChild(layout);
		}

		return layouts;
	}

	protected Node getAbsolutePositionsXML(String layoutID, Document doc) {
		Element absolute = doc.createElement("absolute");
		ModuleDimensions moduleDimensions = this.positions.get(layoutID);
		
		absolute.setAttribute("left", Integer.toString(moduleDimensions.left));
		absolute.setAttribute("right", Integer.toString(moduleDimensions.right));
		absolute.setAttribute("top", Integer.toString(moduleDimensions.top));
		absolute.setAttribute("bottom", Integer.toString(moduleDimensions.bottom));
		absolute.setAttribute("width", Integer.toString(moduleDimensions.width));
		absolute.setAttribute("height", Integer.toString(moduleDimensions.height));
		
		return absolute;
	}

	public void addRelativeLayout(String id, LayoutDefinition relativeLayout) {
		this.layoutsDefinitions.put(id, relativeLayout);
	}

	public void copyConfiguration(String lastSeenLayout) {
		if (this.positions.containsKey(lastSeenLayout)) {
			ModuleDimensions copy = this.getDimensionsCopy(lastSeenLayout);
			this.positions.put(this.semiResponsiveID, copy);
		}
		
		if (this.layoutsDefinitions.containsKey(lastSeenLayout)) {
			LayoutDefinition copy = this.getLayoutDefinitionCopy(lastSeenLayout);
			this.layoutsDefinitions.put(this.semiResponsiveID, copy);
		}
		
		this.copyValueInBoolenHashMap(lastSeenLayout, this.isLocked);
		this.copyValueInBoolenHashMap(lastSeenLayout, this.isModuleVisibleInEditor);
	}
	
	protected void copyValueInBoolenHashMap(String lastSeenLayout, HashMap<String, Boolean> map) {
		if (map.containsKey(lastSeenLayout)) {
			map.put(this.semiResponsiveID, map.get(lastSeenLayout));
		}
	}

	public void translateSemiResponsiveIDs(HashMap<String, String> translationMap) {
		for(String key : translationMap.keySet()) {
			String translatedID = translationMap.get(key);
			if (this.positions.containsKey(key)) {
				this.translatePositions(key, translatedID);
			}
			
			if (this.isLocked.containsKey(key)) {
				this.translateBooleanHashMap(this.isLocked, key, translatedID);
			}

			if (this.isModuleVisibleInEditor.containsKey(key)) {
				this.translateBooleanHashMap(this.isModuleVisibleInEditor, key, translatedID);
			}
			
			if (this.layoutsDefinitions.containsKey(key)) {
				this.translateLayoutsDefinition(key, translatedID);
			}
		}
	}
	
	protected void translateLayoutsDefinition(String key, String translatedID) {
		LayoutDefinition copiedLD = LayoutDefinition.copy(this.layoutsDefinitions.get(key));
		this.layoutsDefinitions.put(translatedID, copiedLD);
		this.layoutsDefinitions.remove(key);
	}

	protected void translateBooleanHashMap(HashMap<String, Boolean> map, String key, String translatedID) {
		boolean value = map.get(key);
		map.put(translatedID, value);
		map.remove(key);
	}

	protected void translatePositions(String key, String translatedID) {
		ModuleDimensions positionCopy = ModuleDimensions.copy(this.positions.get(key));
		this.positions.put(translatedID, positionCopy);
		this.positions.remove(key);
	}

	public HashMap<String, Boolean> getResponsiveVisibilityInEditor() {
		return this.isModuleVisibleInEditor;
	}

	public HashMap<String, Boolean> getResponsiveLocked() {
		return this.isLocked;
	}
	
	public HashMap<String,LayoutDefinition> getResponsiveRelativeLayouts() {
		return this.layoutsDefinitions;
	}
}
