package com.lorepo.icplayer.client.module;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

import com.google.gwt.xml.client.Document;
import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.XMLParser;
import com.lorepo.icplayer.client.dimensions.ModuleDimensions;
import com.lorepo.icplayer.client.model.layout.PageLayout;

public class GroupSemiResponsivePositions extends SemiResponsivePositions{
	
	private HashMap<String, Boolean> isDiv = new HashMap<String, Boolean>(); 
	
	public GroupSemiResponsivePositions () {
		this.positions.put(this.defaultLayoutID, new ModuleDimensions());
		this.layoutsDefinitions.put(this.defaultLayoutID, new LayoutDefinition());
		this.isVisible.put(this.semiResponsiveID, true);
		this.isLocked.put(this.semiResponsiveID, false);
		this.isModuleVisibleInEditor.put(this.semiResponsiveID, true);
		this.isDiv.put(this.semiResponsiveID, false); 
	}
	
	
	protected void deleteOldLayouts(Set<PageLayout> actualSemiResponsiveLayouts) {
		Set<String> actualIDs = this.convertToActualLayoutsIDs(actualSemiResponsiveLayouts);
		
		this.removeOldKeysFromHashMap(actualIDs, this.positions);
		this.removeOldKeysFromHashMap(actualIDs, this.layoutsDefinitions);
		this.removeOldKeysFromHashMap(actualIDs, this.isVisible);
		this.removeOldKeysFromHashMap(actualIDs, this.isLocked);
		this.removeOldKeysFromHashMap(actualIDs, this.isModuleVisibleInEditor);
		this.removeOldKeysFromHashMap(actualIDs, this.isDiv);
	}
	
	protected void ensureLayoutExistsOrFallbackToDefault(String semiResponsiveLayoutID) {
		super.ensureLayoutExistsOrFallbackToDefault(semiResponsiveLayoutID);
		this.ensureDefaultValueInBooleanHashMap(semiResponsiveLayoutID, this.isDiv);
	}
	
	public boolean isDiv() {
		return this.isDiv.get(this.semiResponsiveID); 
	}
	
	public void setIsDiv(Boolean isDiv) {
		this.isDiv.put(this.semiResponsiveID, isDiv); 
	}
	
	public void setIsDiv(String layoutID, boolean isDiv) {
		this.isDiv.put(layoutID, isDiv); 
	}
	
	public Element toXML() {
		Document doc = XMLParser.createDocument();
		Element layouts = doc.createElement("layouts");
		
		for(String layoutID : this.positions.keySet()) {
			Element layout = doc.createElement("layout");
			layout.setAttribute("isLocked", this.isLocked.get(layoutID).toString());
			layout.setAttribute("isModuleVisibleInEditor", this.isModuleVisibleInEditor.get(layoutID).toString());
			layout.setAttribute("id", layoutID);
			layout.setAttribute("isVisible", this.isVisible.get(layoutID).toString());
			layout.setAttribute("isDiv", this.isDiv.get(layoutID).toString()); 
			layout.appendChild(this.layoutsDefinitions.get(layoutID).toXML());
			layout.appendChild(this.getAbsolutePositionsXML(layoutID, doc));
			layouts.appendChild(layout);
		}
		
		return layouts;
	}
	
	public void copyConfiguration(String lastSeenLayout) {
		super.copyConfiguration(lastSeenLayout);
		this.copyValueInBoolenHashMap(lastSeenLayout, this.isDiv);
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
			
			if (this.isVisible.containsKey(key)) {
				this.translateBooleanHashMap(this.isVisible, key, translatedID);
			}
			
			if (this.isModuleVisibleInEditor.containsKey(key)) {
				this.translateBooleanHashMap(this.isModuleVisibleInEditor, key, translatedID);
			}
			
			if (this.layoutsDefinitions.containsKey(key)) {
				this.translateLayoutsDefinition(key, translatedID);
			}
			
			if(this.isDiv.containsKey(key)) {
				this.translateBooleanHashMap(this.isDiv, key, translatedID);
			}
		}
	}
	
	
	public HashMap<String, Boolean> getResponsiveDiv(){
		return this.isDiv; 
	}
}
