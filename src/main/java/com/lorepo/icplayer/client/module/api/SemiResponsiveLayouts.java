package com.lorepo.icplayer.client.module.api;

import java.util.HashMap;
import java.util.Set;

import com.lorepo.icplayer.client.dimensions.ModuleDimensions;
import com.lorepo.icplayer.client.model.layout.PageLayout;

public interface SemiResponsiveLayouts {
	public void setSemiResponsiveLayoutID(String semiResponsiveLayoutID);
	public HashMap<String, ModuleDimensions> getResponsiveLayouts();
	public void addSemiResponsiveDimensions(String name, ModuleDimensions dimensions);
	public void syncSemiResponsiveLayouts(Set<PageLayout> actualSemiResponsiveLayouts);
	public void copyConfiguration(String lastSeenLayout);
}
