package com.lorepo.icplayer.client.module.api;

import java.util.HashMap;
import java.util.Set;

import com.lorepo.icplayer.client.dimensions.ModuleDimensions;
import com.lorepo.icplayer.client.model.layout.PageLayout;
import com.lorepo.icplayer.client.module.LayoutDefinition;

public interface SemiResponsiveLayouts {
	public void setSemiResponsiveLayoutID(String semiResponsiveLayoutID);
	public HashMap<String, ModuleDimensions> getResponsiveLayouts();
	public HashMap<String, Boolean> getResponsiveVisibilityInEditor();
	public HashMap<String, Boolean> getResponsiveLocked();
	public HashMap<String, LayoutDefinition>  getResponsiveRelativeLayouts();
	public void addSemiResponsiveDimensions(String name, ModuleDimensions dimensions);
	public void syncSemiResponsiveLayouts(Set<PageLayout> actualSemiResponsiveLayouts);
	public void copyConfiguration(String lastSeenLayout);
	public void translateSemiResponsiveIDs(HashMap<String, String> translationMap);
	public LayoutDefinition getCurrentLayoutDefinition();
}
