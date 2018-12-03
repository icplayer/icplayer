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

public class GroupSemiResponsivePositions extends SemiResponsivePositions{
	
	private HashMap<String, Boolean> isDiv = new HashMap<String, Boolean>(); 
	private HashMap<String, Boolean> isModificatedHeight = new HashMap<String, Boolean>(); 
	private HashMap<String, Boolean> isModificatedWidth = new HashMap<String, Boolean>(); 
	
	public GroupSemiResponsivePositions () {
		super();
		this.isDiv.put(this.semiResponsiveID, false); 
		this.isModificatedHeight.put(this.semiResponsiveID, false); 
		this.isModificatedWidth.put(this.semiResponsiveID, false); 
	}
	
	
	protected void deleteOldLayouts(Set<PageLayout> actualSemiResponsiveLayouts) {
		super.deleteOldLayouts(actualSemiResponsiveLayouts);
		Set<String> actualIDs = this.convertToActualLayoutsIDs(actualSemiResponsiveLayouts);
		this.removeOldKeysFromHashMap(actualIDs, this.isDiv);
		this.removeOldKeysFromHashMap(actualIDs, this.isModificatedHeight);
		this.removeOldKeysFromHashMap(actualIDs, this.isModificatedWidth);
	}
	
	protected void ensureLayoutExistsOrFallbackToDefault(String semiResponsiveLayoutID) {
		super.ensureLayoutExistsOrFallbackToDefault(semiResponsiveLayoutID);
		this.ensureDefaultValueInBooleanHashMap(semiResponsiveLayoutID, this.isDiv);
		this.ensureDefaultValueInBooleanHashMap(semiResponsiveLayoutID, this.isModificatedHeight);
		this.ensureDefaultValueInBooleanHashMap(semiResponsiveLayoutID, this.isModificatedWidth);
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
	
	public boolean isModificatedHeight() {
		return this.isModificatedHeight.get(this.semiResponsiveID); 
	}
	
	public void setIsModificatedHeight(Boolean isModificatedHeight) {
		this.isModificatedHeight.put(this.semiResponsiveID, isModificatedHeight); 
	}
	
	public void setIsModificatedHeight(String layoutID, boolean isModificatedHeight) {
		this.isModificatedHeight.put(layoutID, isModificatedHeight); 
	}
	
	public boolean isModificatedWidth() {
		return this.isModificatedWidth.get(this.semiResponsiveID); 
	}
	
	public void setIsModificatedWidth(Boolean isModificatedWidth) {
		this.isModificatedWidth.put(this.semiResponsiveID, isModificatedWidth); 
	}
	
	public void setIsModificatedWidth(String layoutID, boolean isModificatedWidth) {
		this.isModificatedWidth.put(layoutID, isModificatedWidth); 
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
			layout.setAttribute("isDiv", this.isDiv.get(layoutID).toString()); 
			layout.setAttribute("isModificatedHeight", this.isModificatedHeight.get(layoutID).toString()); 
			layout.setAttribute("isModificatedWidth", this.isModificatedWidth.get(layoutID).toString()); 
			layout.appendChild(this.layoutsDefinitions.get(layoutID).toXML());
			layout.appendChild(this.getAbsolutePositionsXML(layoutID, doc));
			layouts.appendChild(layout);
		}
		
		return layouts;
	}
	
	public void copyConfiguration(String lastSeenLayout) {
		super.copyConfiguration(lastSeenLayout);
		this.copyValueInBoolenHashMap(lastSeenLayout, this.isDiv);
		this.copyValueInBoolenHashMap(lastSeenLayout, this.isModificatedHeight);
		this.copyValueInBoolenHashMap(lastSeenLayout, this.isModificatedWidth);
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
			
			if(this.isDiv.containsKey(key)) {
				this.translateBooleanHashMap(this.isDiv, key, translatedID);
			}
			
			if(this.isModificatedHeight.containsKey(key)) {
				this.translateBooleanHashMap(this.isModificatedHeight, key, translatedID);
			}
			
			if(this.isModificatedWidth.containsKey(key)) {
				this.translateBooleanHashMap(this.isModificatedWidth, key, translatedID);
			}
		}
	}
	
	
	public HashMap<String, Boolean> getResponsiveDiv(){
		return this.isDiv; 
	}
}
