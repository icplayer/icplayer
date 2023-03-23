package com.lorepo.icplayer.client.page.mockup;

import java.util.HashMap;
import java.util.List;
import java.util.Set;

import com.google.gwt.xml.client.Element;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.IPropertyListener;
import com.lorepo.icplayer.client.dimensions.ModuleDimensions;
import com.lorepo.icplayer.client.framework.module.IStyleListener;
import com.lorepo.icplayer.client.metadata.IMetadata;
import com.lorepo.icplayer.client.model.layout.PageLayout;
import com.lorepo.icplayer.client.model.page.group.GroupPropertyProvider;
import com.lorepo.icplayer.client.module.LayoutDefinition;
import com.lorepo.icplayer.client.module.api.ILayoutDefinition;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.INameValidator;
import com.lorepo.icplayer.client.semi.responsive.SemiResponsiveStyles;

public class ModuleModelMockup implements IModuleModel {
	
	private String buttonType = "";
	private String moduleTypeName = "";
	private boolean isModuleInEditorVisible = true;

	@Override
	public void addStyleListener(IStyleListener listener) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public String getInlineStyle() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String getStyleClass() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void setInlineStyle(String inlineStyle) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void setStyleClass(String styleClass) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public String getClassNamePrefix() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ILayoutDefinition getLayout() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public int getLeft() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int getRight() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int getTop() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int getBottom() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int getWidth() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int getHeight() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public void setLeft(int left) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void setRight(int left) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void setTop(int top) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void setBottom(int top) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void setWidth(int width) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void setHeight(int height) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void disableChangeEvent(boolean disable) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public String getProviderName() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void addPropertyListener(IPropertyListener listener) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void removePropertyListener(IPropertyListener listener) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public int getPropertyCount() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public IProperty getProperty(int index) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String getModuleTypeName() {
		return moduleTypeName;
	}
	
	public void setModuleTypeName(String moduleTypeName) {
		this.moduleTypeName = moduleTypeName;
	}

	@Override
	public String getId() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void setId(String id) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void release() {
		// TODO Auto-generated method stub
		
	}


	@Override
	public String toXML() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void addNameValidator(INameValidator validator) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public boolean isLocked() {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public void lock(boolean state) {
		// TODO Auto-generated method stub
		
	}
	
	public void setButtonType (String buttonType) {
		this.buttonType = buttonType;
	}

	@Override
	public String getButtonType() {
		return buttonType;
	}
	
	@Override
	public boolean isModuleInEditorVisible() {
		return this.isModuleInEditorVisible;
	}
	
	@Override
	public void setModuleInEditorVisibility(boolean moduleInEditorVisibility) {
		this.isModuleInEditorVisible = moduleInEditorVisibility;
	}

	@Override
	public String getModuleName() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void load(Element node, String baseURL, String version) {
		// TODO Auto-generated method stub
	}

	@Override
	public void setSemiResponsiveLayoutID(String semiResponsiveLayoutID) {
		// TODO Auto-generated method stub
	}

	@Override
	public HashMap<String, ModuleDimensions> getResponsiveLayouts() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void addSemiResponsiveDimensions(String name,
			ModuleDimensions dimensions) {
		// TODO Auto-generated method stub

	}

	@Override
	public void syncSemiResponsiveLayouts(
			Set<PageLayout> actualSemiResponsiveLayouts) {
	}

	@Override
	public void copyConfiguration(String lastSeenLayout) {
		// TODO Auto-generated method stub

	}

	@Override
	public void syncSemiResponsiveStyles(
			Set<PageLayout> actualSemiResponsiveLayouts) {
		// TODO Auto-generated method stub

	}

    @Override
	public boolean isTabindexEnabled() {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public void setIsTabindexEnabled(boolean value) {
		// TODO Auto-generated method stub

	}

	@Override
	public boolean shouldOmitInTTS() {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public void setOmitInTTS(boolean value) {
		// TODO Auto-generated method stub
	}
	
	@Override
	public String getTTSTitle() {
		// TODO Auto-generated method stub
		return "";
	}

	@Override
	public void setTTSTitle(String title) {
		// TODO Auto-generated method stub
	}
	
	@Override
	public void translateSemiResponsiveIDs(
			HashMap<String, String> translationMap) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public HashMap<String, Boolean> getResponsiveVisibilityInEditor() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public HashMap<String, Boolean> getResponsiveLocked() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public HashMap<String, LayoutDefinition> getResponsiveRelativeLayouts() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void setContentDefaultLayoutID(String layoutID) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public SemiResponsiveStyles getSemiResponsiveStyles() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void changeAbsoluteToRelative(int deltaLeft, int deltaTop) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void changeRelativeToAbsolute(int deltaLeft, int deltaTop) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void setGroupPropertyProvider(GroupPropertyProvider group) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public boolean hasGroup() {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public LayoutDefinition getCurrentLayoutDefinition() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void setIsVisible(Boolean isVisible) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public boolean isVisible() {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public IMetadata getMetadata() {
		return null;
	}

	@Override
	public List<String> getNameProperties() {
		return null;
	}

	@Override
	public List<IProperty> getProperties() {
		return null;
	}
}
